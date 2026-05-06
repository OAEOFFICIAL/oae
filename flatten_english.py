"""
Flatten english.json — remove nested list items, apply topic normalisation, save cleanly.
"""
import json, re

ENGLISH_PATH = 'Quizzes/data/english.json'

with open(ENGLISH_PATH, encoding='utf-8') as f:
    data = json.load(f)

# Flatten all nested lists
flat = []
for item in data:
    if isinstance(item, list):
        for sub in item:
            if isinstance(sub, dict):
                flat.append(sub)
    elif isinstance(item, dict):
        flat.append(item)

print(f'After flattening: {len(flat)} questions')

# Remove duplicates by id (keep last seen)
seen = {}
for q in flat:
    qid = q.get('id', '')
    seen[qid] = q
deduped = list(seen.values())
print(f'After dedup: {len(deduped)} questions')

# ── Topic normalisation ───────────────────────────────────────────────────────
CANONICAL = {
    'Comprehension', 'Vocabulary', 'Synonyms', 'Antonyms', 'Idioms',
    'Phrasal Verbs', 'Concord', 'Tense', 'Conditionals', 'Subjunctive',
    'Sentence Structure', 'Prepositions', 'Pronouns', 'Conjunctions',
    'Articles', 'Nouns', 'Adjectives', 'Adverbs', 'Gerunds', 'Infinitives',
    'Tag Questions', 'Comparatives', 'Passive Voice', 'Reported Speech',
    'Modal Verbs', 'Quantifiers', 'Result Clauses', 'Inversion',
    'Spelling', 'Register', 'Vocabulary in Context'
}

EXACT_MAP = {
    'Vocabulary in Context':              'Vocabulary',
    'Vocabulary & Word Choice':           'Vocabulary',
    'Subject-Verb Agreement':             'Concord',
    'Grammar & Tense':                    'Tense',
    'Idioms & Phrasal Verbs':             'Idioms',
    'Idioms/Phrasal Verbs':               'Idioms',
    'Phrasal Verbs/Idioms':               'Idioms',
    'Articles & Quantifiers':             'Articles',
    'Pronouns & Antecedents':             'Pronouns',
    'Conditionals & Modals':              'Conditionals',
    'Sentence Interpretation':            'Sentence Structure',
    'Tag question response':              'Tag Questions',
    'Prepositional Phrases':              'Prepositions',
    'Analogies':                          'Comprehension',
    'Register':                           'Vocabulary',
    'Legal Register':                     'Vocabulary',
    'Book Terminology':                   'Vocabulary',
    'Newspaper Terminology':              'Vocabulary',
    'Business Idioms':                    'Idioms',
    'Dangling Modifiers':                 'Sentence Structure',
    'Participial Phrases':                'Sentence Structure',
    'Indirect Questions':                 'Sentence Structure',
    'Linking Verbs - Adjectives':         'Sentence Structure',
    'Dangling Modifier':                  'Sentence Structure',
    'Collective Nouns':                   'Nouns',
    'Uncountable Nouns':                  'Nouns',
    'Possessive with time expressions':   'Nouns',
    'Adjective Order':                    'Adjectives',
    'Superlative adjectives':             'Comparatives',
    'Past tense in reported speech':      'Reported Speech',
    'Past Perfect in Indirect Speech':    'Reported Speech',
    'Used to vs. Be used to':             'Tense',
    'Irregular Verbs - Lie/Lay':          'Tense',
}

PATTERN_RULES = [
    (r'(?i)comprehension|inference|main idea|analogy|interpretation|analogy', 'Comprehension'),
    (r'(?i)synonym',            'Synonyms'),
    (r'(?i)antonym',            'Antonyms'),
    (r'(?i)conditional',        'Conditionals'),
    (r'(?i)subjunctive|would rather|as if.*subjunctive', 'Subjunctive'),
    (r'(?i)phrasal verb',       'Phrasal Verbs'),
    (r'(?i)idiom',              'Idioms'),
    (r'(?i)subject.verb|concord|agreement', 'Concord'),
    (r'(?i)passive',            'Passive Voice'),
    (r'(?i)reported speech|indirect speech', 'Reported Speech'),
    (r'(?i)tag question',       'Tag Questions'),
    (r'(?i)inversion',          'Inversion'),
    (r'(?i)modal verb|modal',   'Modal Verbs'),
    (r'(?i)gerund',             'Gerunds'),
    (r'(?i)infinitive',         'Infinitives'),
    (r'(?i)conjunction',        'Conjunctions'),
    (r'(?i)preposition',        'Prepositions'),
    (r'(?i)article',            'Articles'),
    (r'(?i)quantifier',         'Quantifiers'),
    (r'(?i)pronoun',            'Pronouns'),
    (r'(?i)result clause|so.*that', 'Result Clauses'),
    (r'(?i)comparative|superlative', 'Comparatives'),
    (r'(?i)noun|plural|singular|uncountable|collective', 'Nouns'),
    (r'(?i)adjective',          'Adjectives'),
    (r'(?i)adverb',             'Adverbs'),
    (r'(?i)(past|present|future|perfect|continuous|simple|tense|used to|tense)', 'Tense'),
    (r'(?i)vocabulary|confusable|word choice|meaning|terminology|register', 'Vocabulary'),
    (r'(?i)sentence|structure|clause|modifier', 'Sentence Structure'),
    (r'(?i)spelling',           'Spelling'),
]

def normalize(raw):
    if not raw:
        return 'General'
    if raw in CANONICAL:
        return raw
    if raw in EXACT_MAP:
        return EXACT_MAP[raw]
    # strip subtopic after ' - '
    base = re.split(r"\s+-\s+", raw)[0].strip()
    if base in CANONICAL:
        return base
    if base in EXACT_MAP:
        return EXACT_MAP[base]
    for pattern, canonical in PATTERN_RULES:
        if re.search(pattern, raw):
            return canonical
    return base if base else 'General'

changed = 0
for q in deduped:
    old = q.get('topic', '')
    new = normalize(old)
    if old != new:
        q['topic'] = new
        changed += 1

print(f'Topics normalised: {changed}')

# Final topic summary
from collections import Counter
topics = sorted(Counter(q.get('topic','') for q in deduped).items())
print(f'\nFinal topics ({len(topics)} unique):')
for t, c in topics:
    print(f'  {c:4d}x  {t}')

# Save
with open(ENGLISH_PATH, 'w', encoding='utf-8') as f:
    json.dump(deduped, f, indent=2, ensure_ascii=False)

print(f'\nSaved {len(deduped)} questions to {ENGLISH_PATH}')
