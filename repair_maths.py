import json
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

DOCX_TEXT_PATH = r"c:\Users\USER\Documents\OAE\mathematics_docx_text.txt"
JSON_PATH = r"c:\Users\USER\Documents\OAE\Quizzes\data\post-utme\unilag\mathematics.json"

def clean_option(opt):
    opt = opt.strip()
    # Strip trailing commas, periods, or semicolons
    if opt.endswith(',') or opt.endswith('.') or opt.endswith(';'):
        opt = opt[:-1].strip()
    return opt

def parse_docx_questions():
    if not os.path.exists(DOCX_TEXT_PATH):
        print("Docx text file not found!")
        return {}

    with open(DOCX_TEXT_PATH, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f.readlines()]

    parsed_questions = {} # number (int) -> dict
    
    current_q = None
    state = None # "question", "options", "answer", "explanation"
    
    for line in lines:
        if not line:
            continue
            
        # Detect new Question
        q_match = re.match(r'^Question\s+(\d+)', line, re.IGNORECASE)
        if q_match:
            if current_q:
                parsed_questions[current_q["num"]] = current_q
            num = int(q_match.group(1))
            current_q = {
                "num": num,
                "question_lines": [],
                "options": [],
                "answer_raw": "",
                "explanation_lines": []
            }
            state = "metadata"
            continue
            
        if current_q is None:
            continue
            
        if state == "metadata":
            if line.lower().startswith("subject:") or line.lower().startswith("year:"):
                continue
            else:
                state = "question"
                
        # Check for Options start
        if line.lower().startswith("options:"):
            state = "options"
            options_text = line[len("options:"):].strip()
            # If options are on the same line
            if "(" in options_text:
                opts = re.findall(r'\(([a-e])\)\s*(.*?)(?=\s*\([a-e]\)|$)', options_text, re.IGNORECASE)
                if opts:
                    # Sort by letter just in case
                    opts_sorted = sorted(opts, key=lambda x: x[0].lower())
                    current_q["options"] = [clean_option(x[1]) for x in opts_sorted]
            continue
            
        # Check for Correct Answer start
        if line.lower().startswith("correct answer:"):
            state = "answer"
            current_q["answer_raw"] = line[len("correct_answer:"):].strip()
            continue
            
        # Check for Explanation start
        if line.lower().startswith("explanation:"):
            state = "explanation"
            exp_text = line[len("explanation:"):].strip()
            if exp_text:
                current_q["explanation_lines"].append(exp_text)
            continue
            
        # Append based on state
        if state == "question":
            current_q["question_lines"].append(line)
        elif state == "options":
            # If line starts with (a), (b), etc.
            opt_match = re.match(r'^\(([a-e])\)\s*(.*)', line, re.IGNORECASE)
            if opt_match:
                current_q["options"].append(clean_option(opt_match.group(2)))
            else:
                # Options might be on a single line below "Options:"
                opts = re.findall(r'\(([a-e])\)\s*(.*?)(?=\s*\([a-e]\)|$)', line, re.IGNORECASE)
                if opts:
                    opts_sorted = sorted(opts, key=lambda x: x[0].lower())
                    current_q["options"].extend([clean_option(x[1]) for x in opts_sorted])
        elif state == "answer":
            # Sometimes answer spans multiple lines or has additional text
            current_q["answer_raw"] += " " + line
        elif state == "explanation":
            current_q["explanation_lines"].append(line)
            
    if current_q:
        parsed_questions[current_q["num"]] = current_q
        
    # Process answer and explanation for each parsed question
    for num, q in parsed_questions.items():
        q["question"] = " ".join(q["question_lines"]).strip()
        q["explanation"] = " ".join(q["explanation_lines"]).strip()
        
        # Parse correct answer letter
        ans_raw = q["answer_raw"]
        ans_match = re.search(r'\(([a-e])\)', ans_raw, re.IGNORECASE)
        if ans_match:
            letter = ans_match.group(1).lower()
            idx = ord(letter) - ord('a')
            if idx < len(q["options"]):
                q["answer"] = q["options"][idx]
                # Any text after the letter + value could be explanation
                # e.g., "(a) 4 because ..."
                # Let's extract the rest of the text as explanation
                val = q["options"][idx]
                pattern = re.escape(f"({letter})") + r"\s*" + re.escape(val) + r"\s*(.*)"
                rest_match = re.search(pattern, ans_raw, re.IGNORECASE)
                if rest_match:
                    rest_text = rest_match.group(1).strip()
                    if rest_text:
                        if q["explanation"]:
                            q["explanation"] = rest_text + " " + q["explanation"]
                        else:
                            q["explanation"] = rest_text
            else:
                q["answer"] = ans_raw
        else:
            q["answer"] = ans_raw

    return parsed_questions

def repair_json():
    parsed_qs = parse_docx_questions()
    print(f"Parsed {len(parsed_qs)} questions from docx text.")
    
    if not os.path.exists(JSON_PATH):
        print("JSON file not found!")
        return

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        json_qs = json.load(f)

    repaired_count = 0
    skipped_count = 0
    
    # Map json_qs to their question numbers.
    # The JSON question id is "unilag-math-<N>" where <N> corresponds to the question number in the docx.
    # Let's verify this mapping.
    for q in json_qs:
        q_id = q.get("id", "")
        # extract number from id, e.g. "unilag-math-311" -> 311
        num_match = re.search(r'unilag-math-(\d+)', q_id)
        if not num_match:
            continue
        num = int(num_match.group(1))
        
        # Check if this question is incomplete (options empty or answer empty)
        opts = q.get("options", [])
        ans = q.get("answer", "")
        
        needs_repair = len(opts) == 0 or not ans or "options missing" in q.get("question", "").lower()
        
        if needs_repair and num in parsed_qs:
            pq = parsed_qs[num]
            # Verify if the parsed question has options and answer
            if len(pq["options"]) > 0 and pq["answer"]:
                print(f"Repairing {q_id} (Num {num}):")
                print(f"  Old Question: {q.get('question')[:60]}...")
                print(f"  New Options: {pq['options']}")
                print(f"  New Answer: {pq['answer']}")
                
                # Check if we should update question text (sometimes it contains notes like "Options missing. Skip.")
                # We strip any notes at the end of the question text
                cleaned_q_text = pq["question"]
                cleaned_q_text = re.sub(r'\s*Options:\s*\(.*?\)\s*.*$', '', cleaned_q_text, flags=re.IGNORECASE)
                cleaned_q_text = re.sub(r'\s*\(We will skip.*?\)\s*$', '', cleaned_q_text, flags=re.IGNORECASE)
                cleaned_q_text = re.sub(r'\s*Options missing.*$', '', cleaned_q_text, flags=re.IGNORECASE)
                
                q["question"] = cleaned_q_text.strip()
                q["options"] = pq["options"]
                q["answer"] = pq["answer"]
                
                # Update explanation
                # If parsed explanation contains the answer key explanation, prepend or set it
                if pq["explanation"]:
                    q["explanation"] = "- " + pq["explanation"]
                
                repaired_count += 1
            else:
                skipped_count += 1
                
    print(f"\nRepaired {repaired_count} questions.")
    print(f"Skipped {skipped_count} incomplete/unrepairable questions.")
    
    # Save the updated JSON
    if repaired_count > 0:
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(json_qs, f, indent=2, ensure_ascii=False)
        print("Successfully updated mathematics.json!")

if __name__ == "__main__":
    repair_json()
