import os
import json
import sys

# Reconfigure stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def check_unilag_questions():
    dir_path = r"c:\Users\USER\Documents\OAE\Quizzes\data\post-utme\unilag"
    files = ["english.json", "general-paper.json", "mathematics.json"]
    report_lines = []
    
    for filename in files:
        report_lines.append("="*60)
        report_lines.append(f"Checking {filename}...")
        report_lines.append("="*60)
        filepath = os.path.join(dir_path, filename)
        
        if not os.path.exists(filepath):
            report_lines.append(f"File {filename} does not exist!")
            continue
            
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                questions = json.load(f)
        except Exception as e:
            report_lines.append(f"Failed to load JSON: {e}")
            continue
            
        report_lines.append(f"Successfully loaded {len(questions)} questions.")
        
        errors = []
        warnings = []
        ids_seen = set()
        
        for idx, q in enumerate(questions):
            q_id = q.get("id", f"missing-id-at-index-{idx}")
            
            # Check duplicate ID
            if q_id in ids_seen:
                errors.append(f"Index {idx} has duplicate ID: {q_id}")
            else:
                ids_seen.add(q_id)
                
            # Check required fields
            required_fields = ["id", "question", "options", "answer"]
            for field in required_fields:
                if field not in q:
                    errors.append(f"Question {q_id} (index {idx}) is missing required field: {field}")
            
            # If options or answer are missing, skip further checks for them
            if "options" not in q or "answer" not in q:
                continue
                
            options = q["options"]
            answer = q["answer"]
            
            # Check options is list
            if not isinstance(options, list):
                errors.append(f"Question {q_id} (index {idx}): options must be a list, got {type(options)}")
                continue
                
            # Check number of options
            if len(options) != 4:
                warnings.append(f"Question {q_id} (index {idx}): has {len(options)} options instead of 4. Options: {options}")
                
            # Check options aren't empty
            for opt_idx, opt in enumerate(options):
                if not isinstance(opt, str) or not opt.strip():
                    errors.append(f"Question {q_id} (index {idx}): option {opt_idx} is empty or not a string: {opt}")
                    
            # Check answer type and matching
            if isinstance(answer, int):
                # If answer is an index
                if answer < 0 or answer >= len(options):
                    errors.append(f"Question {q_id} (index {idx}): answer index {answer} is out of range")
            elif isinstance(answer, str):
                # If answer is a string, check if it matches one of the options (case-sensitive or insensitive)
                # Let's check exact match first, and case-insensitive match if exact fails
                if answer not in options:
                    # check case-insensitive match
                    matches = [opt for opt in options if str(opt).strip().lower() == answer.strip().lower()]
                    if matches:
                        warnings.append(f"Question {q_id} (index {idx}): answer '{answer}' has capitalization/whitespace difference with option '{matches[0]}'")
                    else:
                        errors.append(f"Question {q_id} (index {idx}): answer '{answer}' does not match any of the options: {options}")
            else:
                errors.append(f"Question {q_id} (index {idx}): answer is neither a string nor an integer: {answer} (type {type(answer)})")
                
        report_lines.append(f"Found {len(errors)} errors and {len(warnings)} warnings.")
        if errors:
            report_lines.append("\nERRORS:")
            for err in errors:
                report_lines.append(f"  - {err}")
                
        if warnings:
            report_lines.append("\nWARNINGS:")
            for warn in warnings:
                report_lines.append(f"  - {warn}")
        report_lines.append("")

    report_content = "\n".join(report_lines)
    
    # Write to file first
    with open("validation_report.txt", "w", encoding="utf-8") as f:
        f.write(report_content)
        
    print("Report written to validation_report.txt successfully.")

if __name__ == "__main__":
    check_unilag_questions()
