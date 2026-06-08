import os

files = [
    r'c:\Users\USER\Documents\OAE\Quizzes\post-utme.html',
    r'c:\Users\USER\Documents\OAE\Quizzes\post-utme-arena.htm',
    r'c:\Users\USER\Documents\OAE\Assets\js\post-utme-prep.js',
    r'c:\Users\USER\Documents\OAE\Assets\js\post-utme-engine.js'
]

for fp in files:
    if not os.path.exists(fp):
        print(f"Not found: {fp}")
        continue
    with open(fp, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    print(f"File: {os.path.basename(fp)}")
    for idx, line in enumerate(lines):
        if 'faculty' in line.lower():
            # encode to system encoding or just print ascii-safe
            safe_line = line.strip().encode('ascii', errors='replace').decode('ascii')
            print(f"  Line {idx+1}: {safe_line}")
