#!/usr/bin/env python3
"""
OAE Quiz Maintenance Pipeline
==============================
Comprehensive validation + fixing script for all quiz data.
Runs validation, fixes issues, then validates again to confirm.

Usage: python maintain_quizzes.py
       python maintain_quizzes.py --fix-all
       python maintain_quizzes.py --validate-only
"""

import subprocess
import sys
from pathlib import Path

PYTHON_EXE = Path('.venv/Scripts/python.exe')
SUBJECTS = [
    'accounting', 'agricultural-science', 'arabic', 'biology', 'chemistry', 
    'commerce', 'crs', 'economics', 'english', 'fine-arts', 'french', 
    'further-mathematics', 'geography', 'government', 'hausa', 'history', 
    'home-economics', 'igbo', 'irs', 'literature', 'mathematics', 'music', 
    'physical-health-education', 'physics', 'yoruba'
]

BOLD = '\033[1m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
RESET = '\033[0m'

def run_script(script, args=[]):
    """Run a Python script and return exit code."""
    cmd = [str(PYTHON_EXE), script] + args
    result = subprocess.run(cmd, capture_output=False)
    return result.returncode

def main():
    action = sys.argv[1] if len(sys.argv) > 1 else '--validate-and-fix'
    
    print(f"\n{BOLD}{'='*70}{RESET}")
    print(f"{BOLD}OAE Quiz Maintenance Pipeline{RESET}")
    print(f"{'='*70}\n")
    
    if action == '--validate-only':
        print(f"{YELLOW}Running validation only...{RESET}\n")
        return run_script('validate_comprehensive.py')
    
    elif action == '--fix-all':
        print(f"{YELLOW}Running auto-fixer on all subjects...{RESET}\n")
        return run_script('fix_comprehensive.py')
    
    else:  # Default: validate, then fix, then validate again
        print(f"{YELLOW}Step 1: Initial validation...{RESET}\n")
        ret1 = run_script('validate_comprehensive.py')
        
        print(f"\n{YELLOW}Step 2: Running auto-fixer...{RESET}\n")
        ret2 = run_script('fix_comprehensive.py')
        
        print(f"\n{YELLOW}Step 3: Final validation...{RESET}\n")
        ret3 = run_script('validate_comprehensive.py')
        
        print(f"\n{BOLD}{'='*70}{RESET}")
        print(f"{BOLD}PIPELINE COMPLETE{RESET}")
        print(f"{'='*70}")
        
        return ret3

if __name__ == '__main__':
    sys.exit(main())
