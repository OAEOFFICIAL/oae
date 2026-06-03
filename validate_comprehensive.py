#!/usr/bin/env python3
"""
OAE Comprehensive Quiz Validator
=================================
Validates all quiz questions against:
- JSON structure & syntax
- Required fields
- Answer indices
- Topic validity
- Duplicate detection
- Data consistency

Usage: python validate_comprehensive.py [subject]
       python validate_comprehensive.py          # Validate all
"""

import json
import os
import sys
from pathlib import Path
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

# Config
DATA_PATH = Path('Quizzes/data')
SUBJECTS_TO_VALIDATE = [
    'accounting', 'agricultural-science', 'arabic', 'biology', 'chemistry', 
    'commerce', 'crs', 'economics', 'english', 'fine-arts', 'french', 
    'further-mathematics', 'geography', 'government', 'hausa', 'history', 
    'home-economics', 'igbo', 'irs', 'literature', 'mathematics', 'music', 
    'physical-health-education', 'physics', 'yoruba'
]

# Load valid topics
with open(DATA_PATH / 'subject-topics.json', 'r', encoding='utf-8') as f:
    VALID_TOPICS = json.load(f)

# ANSI colors for output
RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

class ValidationReport:
    def __init__(self, subject):
        self.subject = subject
        self.errors = []
        self.warnings = []
        self.info = []
        self.question_count = 0
        self.topics_used = set()
        self.ids_seen = set()
        self.duplicate_ids = []

    def error(self, msg):
        self.errors.append(msg)

    def warning(self, msg):
        self.warnings.append(msg)

    def info_msg(self, msg):
        self.info.append(msg)

    def is_valid(self):
        return len(self.errors) == 0

    def has_issues(self):
        return len(self.errors) > 0 or len(self.warnings) > 0

    def print_summary(self):
        print(f"\n{BOLD}{'='*70}{RESET}")
        print(f"{BOLD}Subject: {self.subject.upper()}{RESET}")
        print(f"{'='*70}")

        if self.question_count == 0:
            print(f"{RED}✗ NO QUESTIONS FOUND{RESET}")
            return

        status = f"{GREEN}✓{RESET}" if self.is_valid() else f"{RED}✗{RESET}"
        print(f"{status} Questions: {self.question_count}")
        print(f"   Topics used: {len(self.topics_used)}")
        print(f"   Valid topics: {len(VALID_TOPICS.get(self.subject, {}).get('topics', []))}")

        if self.errors:
            print(f"\n{RED}{BOLD}ERRORS ({len(self.errors)}):{RESET}")
            for err in self.errors[:20]:  # Show first 20
                print(f"  {RED}✗ {err}{RESET}")
            if len(self.errors) > 20:
                print(f"  {RED}... and {len(self.errors) - 20} more{RESET}")

        if self.warnings:
            print(f"\n{YELLOW}{BOLD}WARNINGS ({len(self.warnings)}):{RESET}")
            for warn in self.warnings[:15]:
                print(f"  {YELLOW}⚠ {warn}{RESET}")
            if len(self.warnings) > 15:
                print(f"  {YELLOW}... and {len(self.warnings) - 15} more{RESET}")

        if self.info:
            print(f"\n{BLUE}INFO:{RESET}")
            for msg in self.info[:5]:
                print(f"  {BLUE}ℹ {msg}{RESET}")

        # Topic coverage
        if self.topics_used:
            print(f"\n{BLUE}Topics used ({len(self.topics_used)}):{RESET}")
            for topic in sorted(self.topics_used):
                print(f"  - {topic}")


def validate_question(q, index, report):
    """Validate a single question object."""
    # Check if it's a dict
    if not isinstance(q, dict):
        report.error(f"Question {index}: Not a dict (type: {type(q).__name__})")
        return

    # Required fields
    required_fields = ['id', 'question', 'options', 'answer', 'exam', 'level', 'topic', 'marks', 'explanation']
    for field in required_fields:
        if field not in q:
            report.error(f"Question {index}: Missing required field '{field}'")

    # Check ID
    q_id = q.get('id', f'MISSING_{index}')
    if q_id in report.ids_seen:
        report.duplicate_ids.append(q_id)
        report.error(f"Question {index}: Duplicate ID '{q_id}'")
    report.ids_seen.add(q_id)

    # Check question text
    question_text = q.get('question', '')
    if not question_text or not isinstance(question_text, str):
        report.error(f"Question {index} ({q_id}): Invalid question text")
    if len(question_text) < 5:
        report.warning(f"Question {index} ({q_id}): Question text is very short")

    # Check options
    options = q.get('options', [])
    if not isinstance(options, list):
        report.error(f"Question {index} ({q_id}): 'options' is not a list")
        return
    if len(options) != 4:
        report.warning(f"Question {index} ({q_id}): Expected 4 options, got {len(options)}")
    for i, opt in enumerate(options):
        if not isinstance(opt, str) or len(opt.strip()) < 1:
            report.error(f"Question {index} ({q_id}): Option {i} is invalid or empty")

    # Check answer index
    answer = q.get('answer')
    if not isinstance(answer, int):
        report.error(f"Question {index} ({q_id}): 'answer' is not an integer (got {type(answer).__name__})")
    elif answer < 0 or answer >= len(options):
        report.error(f"Question {index} ({q_id}): Answer index {answer} out of range (0-{len(options)-1})")

    # Check exam
    exam = q.get('exam', [])
    if not isinstance(exam, list) or len(exam) == 0:
        report.error(f"Question {index} ({q_id}): 'exam' must be a non-empty list")
    valid_exams = ['JAMB', 'WAEC', 'NECO', 'GCE', 'POST-UTME']
    for ex in exam:
        if ex not in valid_exams:
            report.warning(f"Question {index} ({q_id}): Unknown exam '{ex}', expected one of {valid_exams}")

    # Check level
    level = q.get('level', '')
    if level not in ['easy', 'medium', 'hard']:
        report.warning(f"Question {index} ({q_id}): Unknown level '{level}'")

    # Check topic
    topic = q.get('topic', '')
    valid_topics = VALID_TOPICS.get(report.subject, {}).get('topics', [])
    if not topic:
        report.error(f"Question {index} ({q_id}): 'topic' is empty")
    elif topic not in valid_topics:
        report.warning(f"Question {index} ({q_id}): Topic '{topic}' not in subject topics")
    else:
        report.topics_used.add(topic)

    # Check marks
    marks = q.get('marks')
    if not isinstance(marks, int) or marks < 1:
        report.warning(f"Question {index} ({q_id}): 'marks' should be positive integer (got {marks})")

    # Check explanation
    explanation = q.get('explanation', '')
    if not explanation or len(explanation.strip()) < 5:
        report.warning(f"Question {index} ({q_id}): Explanation missing or too short")

    # Optional fields warning
    if 'hint' in q and not q['hint']:
        report.warning(f"Question {index} ({q_id}): 'hint' is empty")

    report.question_count += 1


def validate_file(subject):
    """Validate a single subject JSON file."""
    report = ValidationReport(subject)
    filepath = DATA_PATH / f'{subject}.json'

    if not filepath.exists():
        report.error(f"File not found: {filepath}")
        return report

    # Try to load JSON
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        report.error(f"Invalid JSON: {e}")
        return report
    except Exception as e:
        report.error(f"Error reading file: {e}")
        return report

    # Check structure
    if isinstance(data, list):
        questions = data
    elif isinstance(data, dict) and 'questions' in data:
        questions = data.get('questions', [])
    else:
        report.error("JSON structure: expected list or dict with 'questions' key")
        return report

    # Validate each question
    for i, q in enumerate(questions):
        validate_question(q, i, report)

    # Check coverage
    valid_topics = set(VALID_TOPICS.get(subject, {}).get('topics', []))
    uncovered = valid_topics - report.topics_used
    if uncovered:
        report.info_msg(f"Topics not covered: {', '.join(sorted(uncovered))}")

    return report


def main():
    if len(sys.argv) > 1:
        subjects = [sys.argv[1].lower()]
    else:
        subjects = SUBJECTS_TO_VALIDATE

    reports = []
    for subject in subjects:
        report = validate_file(subject)
        reports.append(report)
        report.print_summary()

    # Final summary
    print(f"\n{BOLD}{'='*70}{RESET}")
    print(f"{BOLD}OVERALL SUMMARY{RESET}")
    print(f"{'='*70}")

    total_valid = sum(1 for r in reports if r.is_valid() and r.question_count > 0)
    total_errors = sum(len(r.errors) for r in reports)
    total_warnings = sum(len(r.warnings) for r in reports)
    total_questions = sum(r.question_count for r in reports)

    print(f"Subjects validated: {len(reports)}")
    print(f"Valid subjects: {GREEN}{total_valid}{RESET}")
    print(f"Total questions: {total_questions}")
    print(f"Total errors: {RED}{total_errors}{RESET}")
    print(f"Total warnings: {YELLOW}{total_warnings}{RESET}")

    if total_errors > 0:
        print(f"\n{RED}{BOLD}⚠ VALIDATION FAILED - Fix errors before deployment{RESET}")
        return 1
    elif total_warnings > 0:
        print(f"\n{YELLOW}{BOLD}⚠ VALIDATION PASSED with warnings - Review before deployment{RESET}")
        return 0
    else:
        print(f"\n{GREEN}{BOLD}✓ ALL VALIDATIONS PASSED{RESET}")
        return 0


if __name__ == '__main__':
    sys.exit(main())
