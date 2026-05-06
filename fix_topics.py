"""
OAE — Final topic cleanup for english.json
Collapses ALL remaining sub-topics into their parent JAMB topic.
"""
import json, re

ENGLISH_PATH = r'Quizzes/data/english.json'

# ── Comprehensive topic → canonical JAMB topic map ────────────────────────────
FINAL_MAP = {
    # Remaining quoted/awkward ones
    "'As if' with subjunctive":          'Subjunctive',
    "'So...that' for result":            'Result Clauses',
    "'Such as' for examples":            'Conjunctions',
    "'There was' for singular":          'Sentence Structure',
    "'There were' for plural":           'Sentence Structure',
    "'Used to' for past habits":         'Tense',
    "'Would rather' with past subjunctive": 'Subjunctive',
    # Adjectives
    'Adjective Order':                   'Adjectives',
    # Adverbs
    'Adverb Phrases':                    'Adverbs',
    'Adverbs of Manner':                 'Adverbs',
    # Analogies → Comprehension (it's a reading-based skill)
    'Analogies':                         'Comprehension',
    # Register → Vocabulary
    'Register':                          'Vocabulary',
    # Spelling stays
    'Spelling':                          'Spelling',
}

# ── Regex-based catch-all rules (applied in order) ────────────────────────────
# These catch anything still slipping through after exact map lookup
PATTERN_RULES = [
    # Conditionals — any variant
    (r'(?i)conditional',                 'Conditionals'),
    # Subjunctive — any variant
    (r'(?i)subjunctive',                 'Subjunctive'),
    # Tense — catch all tense variants
    (r'(?i)(past|present|future|perfect|continuous|simple|tense|used to)',  'Tense'),
    # Passive
    (r'(?i)passive',                     'Passive Voice'),
    # Reported speech
    (r'(?i)reported',                    'Reported Speech'),
    # Phrasal verbs
    (r'(?i)phrasal verb',                'Phrasal Verbs'),
    # Idioms
    (r'(?i)idiom',                       'Idioms'),
    # Synonyms
    (r'(?i)synonym',                     'Synonyms'),
    # Antonyms
    (r'(?i)antonym',                     'Antonyms'),
    # Vocabulary
    (r'(?i)(vocabulary|confusable|word choice|register|meaning|terminology)', 'Vocabulary'),
    # Comprehension
    (r'(?i)(comprehension|inference|interpretation|main idea|analogy)',       'Comprehension'),
    # Prepositions
    (r'(?i)preposition',                 'Prepositions'),
    # Pronouns
    (r'(?i)pronoun',                     'Pronouns'),
    # Conjunctions
    (r'(?i)conjunction',                 'Conjunctions'),
    # Articles
    (r'(?i)article',                     'Articles'),
    # Nouns
    (r'(?i)(noun|plural|singular)',      'Nouns'),
    # Gerunds
    (r'(?i)gerund',                      'Gerunds'),
    # Infinitives
    (r'(?i)infinitive',                  'Infinitives'),
    # Tag Questions
    (r'(?i)tag question',                'Tag Questions'),
    # Comparatives
    (r'(?i)(comparative|superlative)',   'Comparatives'),
    # Result Clauses
    (r'(?i)result clause',               'Result Clauses'),
    # Sentence Structure
    (r'(?i)(sentence|structure|modifier|clause|inversion)', 'Sentence Structure'),
    # Concord
    (r'(?i)(subject.verb|concord|agreement)', 'Concord'),
    # Quantifiers
    (r'(?i)quantifier',                  'Quantifiers'),
    # Inversion
    (r'(?i)inversion',                   'Inversion'),
    # Modal Verbs
    (r'(?i)modal',                       'Modal Verbs'),
    # Adverbs
    (r'(?i)adverb',                      'Adverbs'),
    # Adjectives
    (r'(?i)adjective',                   'Adjectives'),
    # Spelling
    (r'(?i)spelling',                    'Spelling'),
]

# JAMB canonical topics — these never get changed
CANONICAL = {
    'Comprehension', 'Vocabulary', 'Synonyms', 'Antonyms', 'Idioms',
    'Phrasal Verbs', 'Concord', 'Tense', 'Conditionals', 'Subjunctive',
    'Sentence Structure', 'Prepositions', 'Pronouns', 'Conjunctions',
    'Articles', 'Nouns', 'Adjectives', 'Adverbs', 'Gerunds', 'Infinitives',
    'Tag Questions', 'Comparatives', 'Passive Voice', 'Reported Speech',
    'Modal Verbs', 'Quantifiers', 'Result Clauses', 'Inversion',
    'Spelling', 'Register'
}

def normalize(raw):
    if raw in CANONICAL:
        return raw
    if raw in FINAL_MAP:
        return FINAL_MAP[raw]
    for pattern, canonical in PATTERN_RULES:
        if re.search(pattern, raw):
            return canonical
    return raw  # leave unchanged if still no match

# ── Load ──────────────────────────────────────────────────────────────────────
with open(ENGLISH_PATH, encoding='utf-8') as f:
    data = json.load(f)

questions = [q for q in data if isinstance(q, dict)]
print(f"Total questions: {len(questions)}")

changed = 0
for q in questions:
    old = q.get('topic', '')
    new = normalize(old)
    if old != new:
        q['topic'] = new
        changed += 1

print(f"Topics changed: {changed}")

# ── Show final topic list ─────────────────────────────────────────────────────
from collections import Counter
topics = sorted(Counter(q.get('topic','') for q in questions).items())
print(f"\nFinal topics ({len(topics)} unique):")
for t, c in topics:
    print(f"  {c:3d}x  {t}")

# ── Save ──────────────────────────────────────────────────────────────────────
with open(ENGLISH_PATH, 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"\nSaved. File: {ENGLISH_PATH}")
