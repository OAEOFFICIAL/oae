import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

data_path = 'Quizzes/data'
files = sorted(os.listdir(data_path))
print(f"{'File':<35} {'Questions':>10} {'Topics':>8}  Status")
print('-'*72)
for f in files:
    if not f.endswith('.json') or f == 'subject-topics.json':
        continue
    path = os.path.join(data_path, f)
    size = os.path.getsize(path)
    try:
        with open(path, encoding='utf-8') as fh:
            raw = json.load(fh)
        qs = raw if isinstance(raw, list) else raw.get('questions', [])
        flat = []
        for item in qs:
            if isinstance(item, list):
                flat.extend(item)
            elif isinstance(item, dict):
                flat.append(item)
        n = len(flat)
        topics = len(set(q.get('topic','') for q in flat if isinstance(q, dict)))
        if n > 100:
            status = 'GOOD'
        elif n > 10:
            status = 'MINIMAL'
        else:
            status = 'EMPTY'
        print(f"{f:<35} {n:>10} {topics:>8}  {status:<10} ({size//1024}KB)")
    except Exception as e:
        print(f"{f:<35}  ERROR: {e}")
