import json

ENGLISH_PATH = 'Quizzes/data/english.json'

with open(ENGLISH_PATH, encoding='utf-8') as f:
    data = json.load(f)

print(f'Type: {type(data).__name__}')
print(f'Length: {len(data)}')
print(f'First item type: {type(data[0]).__name__}')
print()
print('First item sample:')
print(json.dumps(data[0], indent=2)[:400])
print()

problems = []
required = ['id', 'question', 'options', 'answer']
for i, q in enumerate(data):
    if not isinstance(q, dict):
        problems.append(f'Item {i} is not a dict: {type(q)}')
        continue
    for field in required:
        if field not in q:
            problems.append(f'Item {i} id={q.get("id","?")} missing: {field}')
    opts = q.get('options', [])
    if isinstance(opts, list) and len(opts) == 0:
        problems.append(f'Item {i} id={q.get("id","?")} has empty options')
    ans = q.get('answer', 0)
    if isinstance(opts, list) and isinstance(ans, int) and ans >= len(opts):
        problems.append(f'Item {i} id={q.get("id","?")} answer={ans} out of range (options: {len(opts)})')

if problems:
    print(f'PROBLEMS ({len(problems)}):')
    for p in problems[:30]:
        print(f'  {p}')
else:
    print('No structural problems — JSON is valid.')

# Also check the quiz-api.js to see how it fetches questions
print()
print('--- Checking quiz API file ---')
with open('Assets/js/quiz-api.js', encoding='utf-8') as f:
    print(f.read())
