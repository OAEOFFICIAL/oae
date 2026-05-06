import zipfile
import xml.etree.ElementTree as ET
import re
import json
import os

DOCX_PATH = r'c:\Users\USER\Documents\OAE\OAE-JAMB-COMPREHENSION-DATABASE 1978-1986.docx'
OUTPUT_PATH = r'c:\Users\USER\Documents\OAE\Quizzes\data\english.json'
NS = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

# ── 1. READ DOCX ──────────────────────────────────────────────────────────────
with zipfile.ZipFile(DOCX_PATH) as z:
    xml_content = z.read('word/document.xml')

tree = ET.fromstring(xml_content)
paragraphs = []
for para in tree.iter(NS + 'p'):
    texts = [node.text for node in para.iter(NS + 't') if node.text]
    line = ''.join(texts).strip()
    if line:
        paragraphs.append(line)

print(f"Total paragraphs: {len(paragraphs)}")

# ── 2. CLEAN HELPER ───────────────────────────────────────────────────────────
def clean(text):
    text = re.sub(r'\*+', '', text)          # remove **bold**
    text = re.sub(r'#{1,6}\s*', '', text)    # remove ### headers
    text = text.replace('\u2019', "'").replace('\u2018', "'")
    text = text.replace('\u201c', '"').replace('\u201d', '"')
    text = text.replace('\ufffd', "'")       # replace corrupted chars
    return text.strip()

# ── 3. PARSE PASSAGES ─────────────────────────────────────────────────────────
all_passages = []
current_passage = None
current_questions = []
current_question = None
state = 'find_passage'

PASSAGE_RE = re.compile(r'PASSAGE\s+([A-Z]+|[IVX]+)\s*\((\d{4})\)', re.IGNORECASE)
QUESTION_RE = re.compile(r'^(\d+)[\.\)]\s+(.+)')
OPTION_RE = re.compile(r'^([A-E])[\.\)]\s+(.+)')
ANSWER_RE = re.compile(r'^(\d+)\.\s+\*?\*?([A-E])\*?\*?')

for line in paragraphs:
    c = clean(line)

    # Detect PASSAGE header
    pm = PASSAGE_RE.search(line)
    if pm:
        if current_question:
            current_questions.append(current_question)
            current_question = None
        if current_passage and current_questions:
            all_passages.append({**current_passage, 'questions': current_questions})
        current_passage = {
            'year': int(pm.group(2)),
            'letter': pm.group(1).upper(),
            'text': '',
            'answers': {}
        }
        current_questions = []
        state = 'find_text'
        continue

    if state == 'find_text':
        if 'Passage:' in line:
            state = 'passage'
        continue

    if state == 'passage':
        if re.search(r'QUESTIONS', line, re.I):
            state = 'questions'
        elif '---' in line:
            pass
        elif c:
            current_passage['text'] = (current_passage['text'] + ' ' + c).strip()
        continue

    if state == 'questions':
        if re.search(r'ANSWERS', line, re.I):
            if current_question:
                current_questions.append(current_question)
                current_question = None
            state = 'answers'
            continue
        if '---' in line:
            continue
        qm = QUESTION_RE.match(c)
        if qm:
            if current_question:
                current_questions.append(current_question)
            current_question = {
                'num': int(qm.group(1)),
                'text': qm.group(2).strip(),
                'options': []
            }
            continue
        om = OPTION_RE.match(c)
        if om and current_question:
            current_question['options'].append(om.group(2).strip())
        continue

    if state == 'answers':
        am = ANSWER_RE.match(c)
        if am and current_passage:
            qnum = int(am.group(1))
            letter = am.group(2).upper()
            current_passage['answers'][qnum] = ord(letter) - ord('A')

# Finalise last passage
if current_question:
    current_questions.append(current_question)
if current_passage and current_questions:
    all_passages.append({**current_passage, 'questions': current_questions})

print(f"\nParsed {len(all_passages)} passages:")
for p in all_passages:
    print(f"  {p['year']} Passage {p['letter']}: {len(p['questions'])} questions, {len(p['answers'])} answers")

# ── 4. BUILD JSON ENTRIES ─────────────────────────────────────────────────────
new_entries = []
counter = 1

for p in all_passages:
    passage_id = f"PASS-{p['year']}-{p['letter']}"
    year = p['year']
    passage_text = p['text']
    
    # Generate a simple passage title from first sentence
    first_sentence = re.split(r'[.!?]', passage_text)[0].strip()[:60]
    passage_title = first_sentence if first_sentence else f"Comprehension {year}"

    for q in p['questions']:
        qnum = q['num']
        answer_idx = p['answers'].get(qnum)

        # Skip if no answer found or no options
        if answer_idx is None or not q['options']:
            print(f"  WARNING: Skipping Q{qnum} in {year} Passage {p['letter']} — missing answer or options")
            continue

        # Clamp answer index to valid range
        if answer_idx >= len(q['options']):
            answer_idx = len(q['options']) - 1

        entry = {
            "id": f"ENG-COMP-{year}-{p['letter']}-{qnum:02d}",
            "section": "comprehension",
            "type": "comprehension",
            "passageId": passage_id,
            "passageTitle": passage_title,
            "passageText": passage_text,
            "question": q['text'],
            "options": q['options'],
            "answer": answer_idx,
            "exam": ["JAMB"],
            "level": "medium",
            "topic": "Comprehension",
            "marks": 2,
            "year": year,
            "tags": ["english", "comprehension", "reading", "jamb"],
            "requiresCalculator": False,
            "createdBy": "OAE Admin",
            "lastUpdated": "2026-04-28"
        }
        new_entries.append(entry)
        counter += 1

print(f"\nGenerated {len(new_entries)} question entries")

# ── 5. MERGE WITH EXISTING english.json ───────────────────────────────────────
existing_entries = []
if os.path.exists(OUTPUT_PATH):
    with open(OUTPUT_PATH, encoding='utf-8') as f:
        try:
            raw = json.load(f)
            existing_entries = raw if isinstance(raw, list) else raw.get('questions', [])
            # Flatten nested lists if any
            flat = []
            for item in existing_entries:
                if isinstance(item, list):
                    flat.extend(item)
                elif isinstance(item, dict):
                    flat.append(item)
            existing_entries = flat
            print(f"Existing questions in english.json: {len(existing_entries)}")
        except Exception as e:
            print(f"Could not read existing file: {e}")

# Collect existing IDs to avoid duplicates
existing_ids = {e.get('id', '') for e in existing_entries if isinstance(e, dict)}
added = 0
for entry in new_entries:
    if entry['id'] not in existing_ids:
        existing_entries.append(entry)
        added += 1

print(f"Added {added} new questions (skipped {len(new_entries) - added} duplicates)")
print(f"Total questions after merge: {len(existing_entries)}")

# ── 6. SAVE ───────────────────────────────────────────────────────────────────
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(existing_entries, f, indent=2, ensure_ascii=False)

print(f"\nSaved to: {OUTPUT_PATH}")
print(f"\nFile path for verification:")
print(f"  {OUTPUT_PATH}")
