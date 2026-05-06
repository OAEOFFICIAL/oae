"""
Normalise mathematics.json topics to standard JAMB Maths topic names.
Rule: 'Algebra - Factorization' → 'Algebra', 'Statistics - Mean' → 'Statistics', etc.
"""
import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

MATHS_PATH = 'Quizzes/data/mathematics.json'

with open(MATHS_PATH, encoding='utf-8') as f:
    raw = json.load(f)

qs = raw if isinstance(raw, list) else raw.get('questions', [])
flat = []
for item in qs:
    if isinstance(item, list): flat.extend(item)
    elif isinstance(item, dict): flat.append(item)

print(f'Loaded {len(flat)} questions')

# ── Canonical JAMB Maths topics ───────────────────────────────────────────────
# Exact overrides first
EXACT_MAP = {
    '(none)':                           'General',
    '3D Geometry':                      'Mensuration',
    'Arithmetic Progression':           'Sequences & Series',
    'Arithmetic Progression - Sum':     'Sequences & Series',
    'Geometric Progression':            'Sequences & Series',
    'Logarithms and Arithmetic Progression': 'Sequences & Series',
    'Average Speed':                    'Arithmetic',
    'Bearings':                         'Trigonometry',
    'Bearings and Distances':           'Trigonometry',
    'Time and Angles':                  'Trigonometry',
    'Linear Functions':                 'Functions',
    'Quadratic Functions':              'Algebra',
    'Quadratic Functions - Minimum':    'Algebra',
    'Quadratic Functions - Minimum Value': 'Algebra',
    'Partial Fractions':                'Algebra',
    'Investment - Simple Interest':     'Simple Interest',
    'Simple Interest':                  'Simple Interest',
    'Profit Sharing':                   'Arithmetic',
    'Work Problems':                    'Arithmetic',
    'Ratio':                            'Ratio & Proportion',
    'Ratio and Proportion':             'Ratio & Proportion',
    'Similarity - Volume Ratio':        'Mensuration',
    'Longitude and Latitude':           'Geometry',
    'Number Theory':                    'Number Theory',
    'Number Bases - Profit':            'Number Bases',
}

# Pattern-based parent rules: strip after ' - ' and check parent
PARENT_MAP = {
    'Algebra':              'Algebra',
    'Arithmetic':           'Arithmetic',
    'Coordinate Geometry':  'Coordinate Geometry',
    'Geometry':             'Geometry',
    'Indices':              'Indices',
    'Logarithms':           'Logarithms',
    'Mensuration':          'Mensuration',
    'Number Bases':         'Number Bases',
    'Number Theory':        'Number Theory',
    'Percentage':           'Percentages',
    'Probability':          'Probability',
    'Statistics':           'Statistics',
    'Trigonometry':         'Trigonometry',
    'Variation':            'Variation',
    'Ratio and Proportion': 'Ratio & Proportion',
    'Functions':            'Functions',
    'Inequalities':         'Inequalities',
    'Surds':                'Surds',
    'Set Theory':           'Set Theory',
    'Simple Interest':      'Simple Interest',
    'Bearings':             'Trigonometry',
    'Average Speed':        'Arithmetic',
    'Percentage Change':    'Percentages',
    'Percentage Error':     'Percentages',
}

def normalize(raw):
    if not raw or raw == '(none)':
        return 'General'
    if raw in EXACT_MAP:
        return EXACT_MAP[raw]
    # Strip subtopic after ' - '
    parent = re.split(r'\s+-\s+', raw)[0].strip()
    if parent in PARENT_MAP:
        return PARENT_MAP[parent]
    if parent in EXACT_MAP:
        return EXACT_MAP[parent]
    # Catch remaining patterns
    low = raw.lower()
    if 'progression' in low or 'sequence' in low or 'series' in low:
        return 'Sequences & Series'
    if 'percentage' in low or 'percent' in low:
        return 'Percentages'
    if 'bearing' in low or 'elevation' in low or 'trigon' in low:
        return 'Trigonometry'
    if 'interest' in low or 'profit' in low or 'loss' in low:
        return 'Arithmetic'
    if 'ratio' in low or 'proportion' in low or 'variation' in low:
        return 'Variation'
    return parent if parent else 'General'

changed = 0
for q in flat:
    old = q.get('topic', '')
    new = normalize(old)
    if old != new:
        q['topic'] = new
        changed += 1

print(f'Topics changed: {changed}')

from collections import Counter
topics = sorted(Counter(q.get('topic','') for q in flat).items())
print(f'\nFinal topics ({len(topics)} unique):')
for t, c in topics:
    print(f'  {c:4d}x  {t}')

# Save
with open(MATHS_PATH, 'w', encoding='utf-8') as f:
    json.dump(flat, f, indent=2, ensure_ascii=False)

print(f'\nSaved {len(flat)} questions to {MATHS_PATH}')
