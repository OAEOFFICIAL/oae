#!/usr/bin/env python3
"""
OAE Quiz Validation - Quick Summary Report
Scans all subjects and shows error/warning counts
"""

import json
import sys
from pathlib import Path

DATA_PATH = Path('Quizzes/data')
SUBJECTS = [
    'accounting', 'agricultural-science', 'arabic', 'biology', 'chemistry', 
    'commerce', 'crs', 'economics', 'english', 'fine-arts', 'french', 
    'further-mathematics', 'geography', 'government', 'hausa', 'history', 
    'home-economics', 'igbo', 'irs', 'literature', 'mathematics', 'music', 
    'physical-health-education', 'physics', 'yoruba'
]

sys.stdout.reconfigure(encoding='utf-8')

with open(DATA_PATH / 'subject-topics.json', 'r', encoding='utf-8') as f:
    VALID_TOPICS = json.load(f)

BLUE = '\033[94m'
RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
RESET = '\033[0m'
BOLD = '\033[1m'

def count_issues(subject):
    """Quick count of issues in a subject."""
    filepath = DATA_PATH / f'{subject}.json'
    
    if not filepath.exists():
        return None, None, None
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except:
        return None, None, 0
    
    questions = data if isinstance(data, list) else data.get('questions', [])
    total = len(questions)
    
    errors = 0
    warnings = 0
    
    valid_topics = set(VALID_TOPICS.get(subject, {}).get('topics', []))
    
    for i, q in enumerate(questions):
        if not isinstance(q, dict):
            errors += 1
            continue
        
        # Check required fields
        for field in ['id', 'question', 'options', 'answer', 'exam', 'level', 'topic', 'marks', 'explanation']:
            if field not in q:
                errors += 1
                break
        
        # Check answer index
        opts = q.get('options', [])
        ans = q.get('answer')
        if isinstance(opts, list) and isinstance(ans, int):
            if ans < 0 or ans >= len(opts):
                errors += 1
        
        # Check topic
        topic = q.get('topic', '')
        if topic and topic not in valid_topics:
            warnings += 1
    
    return total, errors, warnings

print(f"\n{BOLD}{'='*80}{RESET}")
print(f"{BOLD}OAE Quiz Data Quality Report{RESET}")
print(f"{'='*80}\n")
print(f"{'Subject':<35} {'Questions':>10} {'Errors':>8} {'Warnings':>10} {'Status':<10}")
print(f"{'-'*80}")

total_questions = 0
total_errors = 0
total_warnings = 0

for subject in SUBJECTS:
    total, errors, warnings = count_issues(subject)
    
    if total is None:
        status = f"{RED}ERROR{RESET}"
    elif errors == 0 and warnings == 0:
        status = f"{GREEN}✓ PASS{RESET}"
    elif errors == 0:
        status = f"{YELLOW}⚠ WARN{RESET}"
    else:
        status = f"{RED}✗ FAIL{RESET}"
    
    if total is not None:
        total_questions += total
        total_errors += errors
        total_warnings += warnings
        print(f"{subject:<35} {total:>10} {errors:>8} {warnings:>10} {status}")

print(f"{'-'*80}")
print(f"{'TOTAL':<35} {total_questions:>10} {total_errors:>8} {total_warnings:>10}")
print(f"\n{BOLD}Summary:{RESET}")
print(f"  Questions: {total_questions}")
print(f"  {RED}Errors: {total_errors}{RESET}")
print(f"  {YELLOW}Warnings: {total_warnings}{RESET}")

if total_errors == 0:
    print(f"\n{GREEN}{BOLD}✓ Ready for deployment{RESET}")
else:
    print(f"\n{RED}{BOLD}✗ Run fix_comprehensive.py before deployment{RESET}")
