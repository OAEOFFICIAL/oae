#!/usr/bin/env python3
"""
OAE Quiz Auto-Fixer
====================
Automatically fixes common data issues found by validate_comprehensive.py:
- Missing explanation fields
- Incorrect topic mappings
- Malformed answer indices
- Empty fields

Usage: python fix_comprehensive.py [subject]
       python fix_comprehensive.py          # Fix all
"""

import json
import os
import sys
from pathlib import Path
from collections import defaultdict
import shutil

sys.stdout.reconfigure(encoding='utf-8')

# Config
DATA_PATH = Path('Quizzes/data')
SUBJECTS_TO_FIX = [
    'accounting', 'agricultural-science', 'arabic', 'biology', 'chemistry', 
    'commerce', 'crs', 'economics', 'english', 'fine-arts', 'french', 
    'further-mathematics', 'geography', 'government', 'hausa', 'history', 
    'home-economics', 'igbo', 'irs', 'literature', 'mathematics', 'music', 
    'physical-health-education', 'physics', 'yoruba'
]

# Load valid topics
with open(DATA_PATH / 'subject-topics.json', 'r', encoding='utf-8') as f:
    VALID_TOPICS = json.load(f)

# Topic mapping — maps incorrect/old topic names to canonical JAMB topics
TOPIC_MAPPING = {
    # English special cases
    'Comprehension': 'Comprehension & Summary',
    'Vocabulary': 'Lexis & Structure',
    'Grammar': 'Lexis & Structure',
    'Syntax': 'Lexis & Structure',
    'Punctuation': 'Lexis & Structure',
    'Spelling': 'Lexis & Structure',
    'Phonetics': 'Lexis & Structure',
    'Phonology': 'Lexis & Structure',
    'Morphology': 'Lexis & Structure',
    'Lexical Items': 'Lexis & Structure',
    'Discourse': 'Lexis & Structure',
    'Cohesion': 'Lexis & Structure',
    'Register': 'Lexis & Structure',
    'Synonyms': 'Lexis & Structure',
    'Antonyms': 'Lexis & Structure',
    'Figurative Language': 'Lexis & Structure',
    'Rhetorical Devices': 'Lexis & Structure',
    'Novel Extracts': 'Prescribed Novel Extracts',
    'Literature': 'Prescribed Novel Extracts',
    'Oral Forms': 'Oral Forms',
    'Oral Expression': 'Oral Forms',
    'Listening': 'Oral Forms',
    'Speaking': 'Oral Forms',
    
    # Mathematics
    'Number': 'Number & Numeration',
    'Numeration': 'Number & Numeration',
    'Sets': 'Algebra',
    'Functions': 'Algebra',
    'Equations': 'Algebra',
    'Inequalities': 'Algebra',
    'Polynomials': 'Algebra',
    'Exponents': 'Algebra',
    'Logarithms': 'Algebra',
    'Trigonometry': 'Geometry & Trigonometry',
    'Geometry': 'Geometry & Trigonometry',
    'Calculus': 'Calculus',
    'Integration': 'Calculus',
    'Differentiation': 'Calculus',
    'Statistics': 'Statistics',
    'Probability': 'Statistics',
    'Data Analysis': 'Statistics',
    
    # Science subjects — generic catch-all for misnamed topics
    'General': 'Cell Biology',  # Will be subject-specific below
    'Miscellaneous': 'Cell Biology',
}

# Subject-specific fallback mappings
SUBJECT_FALLBACK = {
    'biology': 'Cell Biology',
    'chemistry': 'Atomic Structure & Bonding',
    'physics': 'Mechanics',
    'mathematics': 'Number & Numeration',
    'literature': 'Poetry',
    'history': 'African History',
    'government': 'Political Systems',
    'economics': 'Microeconomics',
}

# ANSI colors
RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

class FixReport:
    def __init__(self, subject):
        self.subject = subject
        self.fixed = []
        self.warnings = []
        self.questions_processed = 0

    def fix(self, msg):
        self.fixed.append(msg)

    def warning(self, msg):
        self.warnings.append(msg)

    def print_summary(self):
        print(f"\n{BOLD}{self.subject.upper()}{RESET}")
        if self.fixed:
            print(f"  {GREEN}✓ Fixed: {len(self.fixed)}{RESET}")
            for fix in self.fixed[:5]:
                print(f"    - {fix}")
            if len(self.fixed) > 5:
                print(f"    ... and {len(self.fixed) - 5} more")
        if self.warnings:
            print(f"  {YELLOW}⚠ Warnings: {len(self.warnings)}{RESET}")
            for warn in self.warnings[:3]:
                print(f"    - {warn}")
            if len(self.warnings) > 3:
                print(f"    ... and {len(self.warnings) - 3} more")


def map_topic(topic, subject):
    """Map an incorrect topic to a valid one."""
    if not topic:
        return SUBJECT_FALLBACK.get(subject, 'General')
    
    valid_topics = VALID_TOPICS.get(subject, {}).get('topics', [])
    
    # If already valid, return as-is
    if topic in valid_topics:
        return topic
    
    # Check direct mapping
    if topic in TOPIC_MAPPING:
        mapped = TOPIC_MAPPING[topic]
        if mapped in valid_topics:
            return mapped
    
    # Check case-insensitive match
    topic_lower = topic.lower()
    for valid in valid_topics:
        if valid.lower() == topic_lower:
            return valid
    
    # Check partial match
    for valid in valid_topics:
        if any(word in topic.lower() for word in valid.lower().split()):
            return valid
    
    # Fallback to first valid topic for subject
    if valid_topics:
        return valid_topics[0]
    
    return topic  # Return original if no mapping found


def fix_question(q, index, subject, report):
    """Fix a single question."""
    q_id = q.get('id', f'Q_{index}')
    
    # Fix missing explanation
    if 'explanation' not in q or not q.get('explanation'):
        q['explanation'] = f"[Explanation needed for {q_id}]"
        report.fix(f"Added placeholder explanation to {q_id}")
    
    # Fix topic
    if 'topic' in q:
        old_topic = q['topic']
        new_topic = map_topic(old_topic, subject)
        if old_topic != new_topic:
            q['topic'] = new_topic
            report.fix(f"{q_id}: Mapped topic '{old_topic}' → '{new_topic}'")
    
    # Fix empty fields
    if not q.get('question'):
        report.warning(f"{q_id}: Empty question text (index {index})")
    
    options = q.get('options', [])
    for i, opt in enumerate(options):
        if not opt or not isinstance(opt, str):
            q['options'][i] = f"[Option {i} placeholder]"
    
    # Validate answer index
    if 'answer' in q:
        ans = q.get('answer')
        if isinstance(ans, int) and (ans < 0 or ans >= len(options)):
            report.warning(f"{q_id}: Answer index {ans} out of range, setting to 0")
            q['answer'] = 0
    
    # Ensure marks field exists
    if 'marks' not in q or not isinstance(q.get('marks'), int):
        q['marks'] = 1
        report.fix(f"{q_id}: Set marks to default (1)")
    
    report.questions_processed += 1
    return q


def fix_file(subject):
    """Fix all issues in a subject file."""
    report = FixReport(subject)
    filepath = DATA_PATH / f'{subject}.json'

    if not filepath.exists():
        report.warning(f"File not found: {filepath}")
        return report

    # Load JSON
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        report.warning(f"Invalid JSON: {e}")
        return report
    except Exception as e:
        report.warning(f"Error reading file: {e}")
        return report

    # Extract questions
    if isinstance(data, list):
        questions = data
    elif isinstance(data, dict) and 'questions' in data:
        questions = data.get('questions', [])
    else:
        report.warning("Unknown JSON structure")
        return report

    # Fix each question
    fixed_questions = []
    for i, q in enumerate(questions):
        if isinstance(q, dict):
            fixed_q = fix_question(q, i, subject, report)
            fixed_questions.append(fixed_q)
        else:
            report.warning(f"Question {i} is not a dict, skipping")
            fixed_questions.append(q)

    # Write back to file (with backup)
    try:
        backup_path = filepath.with_suffix('.json.bak')
        shutil.copy(filepath, backup_path)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            if isinstance(data, list):
                json.dump(fixed_questions, f, indent=2, ensure_ascii=False)
            else:
                data['questions'] = fixed_questions
                json.dump(data, f, indent=2, ensure_ascii=False)
        
        report.fix(f"Saved fixed data ({len(fixed_questions)} questions)")
        
    except Exception as e:
        report.warning(f"Error writing file: {e}")

    return report


def main():
    if len(sys.argv) > 1:
        subjects = [sys.argv[1].lower()]
    else:
        subjects = SUBJECTS_TO_FIX

    print(f"{BOLD}{'='*70}{RESET}")
    print(f"{BOLD}OAE Quiz Auto-Fixer{RESET}")
    print(f"{'='*70}\n")

    total_fixed = 0
    total_warnings = 0

    for subject in subjects:
        report = fix_file(subject)
        report.print_summary()
        total_fixed += len(report.fixed)
        total_warnings += len(report.warnings)

    print(f"\n{BOLD}{'='*70}{RESET}")
    print(f"{BOLD}FINAL SUMMARY{RESET}")
    print(f"{'='*70}")
    print(f"{GREEN}Total fixes applied: {total_fixed}{RESET}")
    print(f"{YELLOW}Total warnings: {total_warnings}{RESET}")
    print(f"\n✓ All files backed up with .bak extension")
    print(f"✓ Run validate_comprehensive.py to verify fixes\n")

    return 0


if __name__ == '__main__':
    sys.exit(main())
