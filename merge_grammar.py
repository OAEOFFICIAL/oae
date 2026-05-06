"""
OAE — Merge grammar.json into english.json
- Renumbers grammar questions continuing from last english.json entry
- Normalizes ALL topic names to clean single-format labels
- No subtopics like "Idioms - 'Learn by heart'" — just "Idioms"
"""
import json, re

ENGLISH_PATH = r'Quizzes/data/english.json'
GRAMMAR_PATH = r'Quizzes/data/grammar.json'

# ── 1. TOPIC NORMALISATION MAP ────────────────────────────────────────────────
# Rule: strip everything after ' - ' or ' & ' and simplify
# Then apply known corrections (e.g. Subject-Verb Agreement → Concord)

TOPIC_MAP = {
    # --- Comprehension family ---
    'Comprehension - Main Idea':            'Comprehension',
    'Comprehension - Detail':               'Comprehension',
    'Comprehension - Inference':            'Comprehension',
    'Comprehension - Interpretation':       'Comprehension',
    'Comprehension - Analogy':              'Comprehension',
    'Comprehension - Title Selection':      'Comprehension',
    'Comprehension - Character Description':'Comprehension',
    "Comprehension - Author's Opinion":     'Comprehension',
    # --- Vocabulary family ---
    'Vocabulary in Context':                'Vocabulary',
    'Vocabulary & Word Choice':             'Vocabulary',
    # --- Idioms family ---
    'Idioms & Phrasal Verbs':               'Idioms',
    'Idioms/Phrasal Verbs':                 'Idioms',
    'Phrasal Verbs/Idioms':                 'Idioms',
    'Phrasal Verbs - Aviation':             'Phrasal Verbs',
    # --- Concord ---
    'Subject-Verb Agreement':               'Concord',
    # --- Tense family ---
    'Grammar & Tense':                      'Tense',
    'Past Continuous Tense':                'Tense',
    'Past Simple Tense':                    'Tense',
    'Past Tense':                           'Tense',
    'Past Perfect Tense':                   'Tense',
    'Past Perfect in Indirect Speech':      'Tense',
    'Past Perfect in Reported Speech':      'Tense',
    'Past perfect in reported speech':      'Tense',
    'Past Tense in Reported Speech':        'Tense',
    'Past tense in reported speech':        'Tense',
    'Present Simple Tense':                 'Tense',
    'Present Perfect Tense':                'Tense',
    'Present Perfect Tense - Passive':      'Tense',
    'Present Perfect Continuous':           'Tense',
    "Present perfect - 'Since'":            'Tense',
    "Present perfect - 'There have been'":  'Tense',
    'Future Perfect Tense':                 'Tense',
    'Future Perfect Continuous':            'Tense',
    'Future Conditional':                   'Conditionals',
    'Past Subjunctive':                     'Conditionals',
    "Past subjunctive - 'Wish' about past": 'Conditionals',
    # --- Conditionals ---
    'Conditionals & Modals':                'Conditionals',
    'Conditional Sentences':                'Conditionals',
    'Conditional Sentences (Second Conditional)': 'Conditionals',
    'Conditional Sentences (Third Conditional)':  'Conditionals',
    'Conditional Sentences Interpretation': 'Conditionals',
    'Second Conditional':                   'Conditionals',
    # --- Modal verbs ---
    "Modal verbs - 'Needn't'":              'Modal Verbs',
    'Modal verbs - Prohibition':            'Modal Verbs',
    # --- Reported Speech ---
    'Reported speech - Complex':            'Reported Speech',
    'Reported speech - Infinitives':        'Reported Speech',
    'Reported speech - Tense shift':        'Reported Speech',
    # --- Articles ---
    'Articles & Quantifiers':               'Articles',
    'Articles with geographical names':     'Articles',
    'Articles with names':                  'Articles',
    # --- Quantifiers ---
    "Quantifiers - 'A few'":                'Quantifiers',
    "Quantifiers - 'A lot of'":             'Quantifiers',
    "Quantifiers - 'As many as'":           'Quantifiers',
    "Quantifiers - 'Some'":                 'Quantifiers',
    # --- Pronouns ---
    'Pronouns & Antecedents':               'Pronouns',
    'Possessive Pronouns':                  'Pronouns',
    'Reflexive pronouns':                   'Pronouns',
    'Reciprocal Pronouns':                  'Pronouns',
    'Indefinite pronouns':                  'Pronouns',
    'Indefinite pronouns - Negative':       'Pronouns',
    "Relative pronouns - 'Which'":          'Pronouns',
    'Pronouns - Prepositions':              'Pronouns',
    # --- Conjunctions ---
    "Conjunctions - 'If' in polite requests": 'Conjunctions',
    "Conjunctions - 'In case'":             'Conjunctions',
    "Conjunctions - 'Yet'":                 'Conjunctions',
    'Conjunctions - Purpose':               'Conjunctions',
    'Conjunctions - Time Clauses':          'Conjunctions',
    'Conjunctions/Adverbs':                 'Conjunctions',
    # --- Prepositions ---
    'Prepositional Phrases':                'Prepositions',
    'Prepositions - Idioms':                'Prepositions',
    'Prepositions - Location':              'Prepositions',
    'Prepositions - Duration':              'Prepositions',
    'Prepositions - Time':                  'Prepositions',
    'Prepositions - Reason':                'Prepositions',
    'Prepositions - Cause':                 'Prepositions',
    'Prepositions - Speed':                 'Prepositions',
    # --- Tag Questions ---
    'Tag question response':                'Tag Questions',
    "Tag questions - 'Used to'":            'Tag Questions',
    # --- Passive Voice ---
    "Passive Voice - 'Be supposed to'":     'Passive Voice',
    'Passive voice - Future':               'Passive Voice',
    'Passive voice - Past tense':           'Passive Voice',
    # --- Result Clauses ---
    "Result Clauses - 'So...that'":         'Result Clauses',
    "Result clauses - 'So...that'":         'Result Clauses',
    # --- Sentence Structure ---
    'Sentence Interpretation':              'Sentence Structure',
    'Comparative Structures':               'Comparatives',
    "Comparatives - 'As little as possible'": 'Comparatives',
    "Comparatives - 'Farther'":             'Comparatives',
    "Comparatives - 'More...than'":         'Comparatives',
    "Comparatives - 'Worse'":              'Comparatives',
    'Superlative adjectives':               'Comparatives',
    # --- Gerunds ---
    "Gerunds after 'feel like'":            'Gerunds',
    'Gerunds after phrasal verbs':          'Gerunds',
    'Gerunds and Possessives':              'Gerunds',
    'Gerunds as subjects':                  'Gerunds',
    # --- Infinitives ---
    "Bare infinitive after 'bade'":         'Infinitives',
    'Perfect Infinitives':                  'Infinitives',
    # --- Subjunctive ---
    "Subjunctive - 'It's time'":            'Subjunctive',
    # --- Nouns ---
    'Collective Nouns':                     'Nouns',
    "Plural of 'hero'":                     'Nouns',
    'Plural of compound nouns':             'Nouns',
    'Uncountable Nouns':                    'Nouns',
    "Uncountable Nouns - 'Noise'":          'Nouns',
    "Uncountable nouns - 'Luggage'":        'Nouns',
    # --- Inversion ---
    "Inversion - 'No sooner...than'":       'Inversion',
    "Inversion - 'So'":                     'Inversion',
    # --- Miscellaneous → their parent ---
    'Used to vs. Be used to':               'Tense',
    "Confusable Verbs - 'Tell'":            'Vocabulary',
    'Confusable Words':                     'Vocabulary',
    'Confusable Words - Incidence/Incident':'Vocabulary',
    'Confusable Words - Lend/Borrow':       'Vocabulary',
    "Confusable verbs - 'Say'":             'Vocabulary',
    'Confusable words - Found/Funded':      'Vocabulary',
    'Confusable words - Lend/Borrow':       'Vocabulary',
    'Legal Register':                       'Vocabulary',
    'Legal Register':                       'Vocabulary',
    'Book Terminology':                     'Vocabulary',
    'Newspaper Terminology':                'Vocabulary',
    'Business Idioms':                      'Idioms',
    "Idiom - 'Without mincing words'":      'Idioms',
    'Dangling Modifiers':                   'Sentence Structure',
    'Participial Phrases':                  'Sentence Structure',
    'Indirect Questions':                   'Sentence Structure',
    'Linking Verbs - Adjectives':           'Sentence Structure',
    'Transitive Verbs - Discuss':           'Sentence Structure',
    "Transitive Verbs - 'Discuss'":         'Sentence Structure',
    "Verbs - 'Consists of'":                'Sentence Structure',
    "Irregular Verbs - Lie/Lay":            'Tense',
    "Spelling - 'Received'":                'Spelling',
    "Negative agreement - 'Neither'":       'Conjunctions',
    "Negative purpose - 'So as not to'":    'Conjunctions',
    "Politeness - Responding to 'Would you mind'": 'Register',
    'Possessive with time expressions':     'Nouns',
    "Interpretation - 'In spite of'":       'Comprehension',
    "Interpretation - 'Retained'":          'Comprehension',
    'Antonyms - Legal Terms':               'Antonyms',
    "Antonyms - 'Bleak'":                   'Antonyms',
    "Antonyms - 'Lightly'":                 'Antonyms',
    'Vocabulary - History':                 'Vocabulary',
    'Vocabulary - Inference':               'Vocabulary',
    'Vocabulary - Legal Terms':             'Vocabulary',
    'Vocabulary - Legal/Medical Terms':     'Vocabulary',
    'Vocabulary - Sensory Words':           'Vocabulary',
    'Synonyms - Siren sound':               'Synonyms',
    "Synonyms - 'Big heart' idiom":         'Synonyms',
    "(none)":                               'General',
    "":                                     'General',
}

def normalize_topic(raw):
    """Return clean topic. First check exact map, then strip subtopic pattern."""
    if raw in TOPIC_MAP:
        return TOPIC_MAP[raw]
    # Strip everything after ' - ' e.g. "Idioms - 'Learn by heart'" → "Idioms"
    stripped = re.split(r"\s+-\s+", raw)[0].strip()
    if stripped in TOPIC_MAP:
        return TOPIC_MAP[stripped]
    # Strip after ' & '
    stripped2 = re.split(r"\s+&\s+", stripped)[0].strip()
    if stripped2 in TOPIC_MAP:
        return TOPIC_MAP[stripped2]
    # Return stripped base if no match (already cleaned)
    return stripped if stripped else 'General'


# ── 2. LOAD english.json ─────────────────────────────────────────────────────
with open(ENGLISH_PATH, encoding='utf-8') as f:
    raw = json.load(f)

english_questions = []
for item in raw:
    if isinstance(item, list):
        english_questions.extend(item)
    elif isinstance(item, dict):
        english_questions.append(item)

print(f"Loaded {len(english_questions)} questions from english.json")

# Normalize existing english.json topics
for q in english_questions:
    old = q.get('topic', '')
    q['topic'] = normalize_topic(old)

# ── 3. LOAD grammar.json ─────────────────────────────────────────────────────
with open(GRAMMAR_PATH, encoding='utf-8') as f:
    g_raw = json.load(f)

grammar_questions = g_raw.get('questions', g_raw) if isinstance(g_raw, dict) else g_raw
print(f"Loaded {len(grammar_questions)} questions from grammar.json")

# ── 4. FIND LAST SEQUENTIAL NUMBER IN english.json ───────────────────────────
# IDs like ENG-COMP-1978-A-01, ENG-JAMB-001, eng-g-001 — find highest numeric suffix
last_num = 0
for q in english_questions:
    qid = q.get('id', '')
    m = re.search(r'(\d+)$', qid)
    if m:
        last_num = max(last_num, int(m.group(1)))

print(f"Last sequential number in english.json: {last_num}")
next_num = last_num + 1

# ── 5. CONVERT & MERGE grammar questions ─────────────────────────────────────
existing_ids = {q.get('id','') for q in english_questions}
added = 0
skipped = 0

for gq in grammar_questions:
    old_topic = gq.get('topic', gq.get('category', ''))
    clean_topic = normalize_topic(old_topic)

    new_id = f"ENG-G-{next_num:03d}"
    while new_id in existing_ids:
        next_num += 1
        new_id = f"ENG-G-{next_num:03d}"

    year_raw = gq.get('year', '')
    try:
        year_val = int(year_raw)
    except:
        year_val = None

    entry = {
        "id": new_id,
        "section": "grammar",
        "type": "objective",
        "question": gq.get('question', ''),
        "options": gq.get('options', []),
        "answer": gq.get('answer', 0),
        "exam": ["JAMB"],
        "level": gq.get('level', 'medium'),
        "topic": clean_topic,
        "marks": gq.get('marks', 1),
        "explanation": gq.get('explanation', ''),
        "year": year_val,
        "tags": ["english", "grammar", "jamb"],
        "requiresCalculator": False,
        "createdBy": "OAE Admin",
        "lastUpdated": "2026-04-28"
    }
    english_questions.append(entry)
    existing_ids.add(new_id)
    next_num += 1
    added += 1

print(f"Added {added} grammar questions")
print(f"Total questions: {len(english_questions)}")

# ── 6. VERIFY TOPICS AFTER MERGE ─────────────────────────────────────────────
from collections import Counter
topics = Counter(q.get('topic','') for q in english_questions)
print(f"\nTopics now ({len(topics)} unique):")
for t, c in sorted(topics.items()):
    print(f"  {c:3d}x  {t}")

# ── 7. SAVE ───────────────────────────────────────────────────────────────────
with open(ENGLISH_PATH, 'w', encoding='utf-8') as f:
    json.dump(english_questions, f, indent=2, ensure_ascii=False)

print(f"\nSaved to: {ENGLISH_PATH}")
