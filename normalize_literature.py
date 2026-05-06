"""
Normalize literature.json — collapse messy sub-topics into 5 clean JAMB Literature categories.
"""
import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

LIT_PATH = 'Quizzes/data/literature.json'

with open(LIT_PATH, encoding='utf-8') as f:
    raw = json.load(f)

qs = raw if isinstance(raw, list) else raw.get('questions', [])
flat = []
for item in qs:
    if isinstance(item, list): flat.extend(item)
    elif isinstance(item, dict): flat.append(item)

def normalize(raw):
    if not raw:
        return 'General'
    # Strip surrounding quotes if any
    t = raw.strip("'\"")
    # Main rule: first word(s) before ' - ' or '(' determine the category
    if re.match(r'(?i)^prose', t):
        return 'Prose'
    if re.match(r'(?i)^poetry', t):
        return 'Poetry'
    if re.match(r'(?i)^drama', t):
        return 'Drama'
    if re.match(r'(?i)^(literary devices|literary elements|figurative language|imagery|symbolism|metaphor|simile|tone|mood)', t):
        return 'Literary Devices'
    if re.match(r'(?i)^(literary terms|narrative technique|plot structure|characteriz|genre)', t):
        return 'Literary Terms & Concepts'
    # Fallback pattern matching
    low = t.lower()
    if 'prose' in low:
        return 'Prose'
    if 'poetry' in low or 'poem' in low or 'sonnet' in low or 'ballad' in low:
        return 'Poetry'
    if 'drama' in low or 'play' in low or 'theatre' in low:
        return 'Drama'
    if any(x in low for x in ['literary device', 'figurative', 'imagery', 'symbolism', 'irony', 'metaphor', 'simile', 'alliteration', 'rhyme', 'metre', 'tone', 'mood']):
        return 'Literary Devices'
    if any(x in low for x in ['literary term', 'narrative', 'plot', 'character', 'genre', 'structure', 'form', 'setting', 'theme']):
        return 'Literary Terms & Concepts'
    return 'General'

changed = 0
for q in flat:
    old = q.get('topic', '')
    new = normalize(old)
    if old != new:
        q['topic'] = new
        changed += 1

from collections import Counter
topics = sorted(Counter(q.get('topic','') for q in flat).items())
print(f'Topics changed: {changed}')
print(f'Final topics ({len(topics)} unique):')
for t, c in topics:
    print(f'  {c:4d}x  {t}')

with open(LIT_PATH, 'w', encoding='utf-8') as f:
    json.dump(flat, f, indent=2, ensure_ascii=False)

print(f'\nSaved {len(flat)} questions.')
