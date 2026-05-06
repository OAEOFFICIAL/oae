import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('Quizzes/data/mathematics.json', encoding='utf-8') as f:
    raw = json.load(f)

qs = raw if isinstance(raw, list) else raw.get('questions', [])
flat = []
for item in qs:
    if isinstance(item, list): flat.extend(item)
    elif isinstance(item, dict): flat.append(item)

from collections import Counter
topics = sorted(Counter(q.get('topic','(none)') for q in flat).items())
print(f'Total questions: {len(flat)}')
print(f'Total unique topics: {len(topics)}')
print()
for t, c in topics:
    print(f'  {c:3d}x  {repr(t)}')
