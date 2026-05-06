"""
Final cleanup pass for english.json — fix last remaining non-canonical topics.
"""
import json, re

ENGLISH_PATH = 'Quizzes/data/english.json'

with open(ENGLISH_PATH, encoding='utf-8') as f:
    data = json.load(f)

REMAINING = {
    "'Such as' for examples":   'Conjunctions',
    'Negative purpose':         'Conjunctions',
    'Politeness':               'Vocabulary',
    'Transitive Verbs':         'Sentence Structure',
    'Verbs':                    'Sentence Structure',
    'Vocabulary in Context':    'Vocabulary',
}

changed = 0
for q in data:
    if not isinstance(q, dict):
        continue
    old = q.get('topic', '')
    if old in REMAINING:
        q['topic'] = REMAINING[old]
        changed += 1

print(f'Topics changed: {changed}')

# Final count
from collections import Counter
topics = sorted(Counter(q.get('topic','') for q in data if isinstance(q, dict)).items())
print(f'Final topics ({len(topics)} unique):')
for t, c in topics:
    print(f'  {c:4d}x  {t}')

with open(ENGLISH_PATH, 'w', encoding='utf-8') as f:
    json.dump([q for q in data if isinstance(q, dict)], f, indent=2, ensure_ascii=False)

print(f'\nDone. {len(data)} questions saved.')
