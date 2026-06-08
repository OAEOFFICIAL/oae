import re
import json
import os

def parse_txt_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by "Question X"
    # We want to keep the question numbers, so we use parentheses in split
    parts = re.split(r'^Question\s+(\d+)\b', content, flags=re.MULTILINE)
    
    questions = []
    # parts[0] is header before "Question 1"
    # then parts[1] is "1", parts[2] is the content of Question 1, etc.
    for i in range(1, len(parts), 2):
        q_num = int(parts[i])
        q_body = parts[i+1]
        questions.append((q_num, q_body))
        
    return questions

if __name__ == '__main__':
    files = {
        'general': r'c:\Users\USER\Documents\OAE\unilag_gen_paper_text.txt',
        'english': r'c:\Users\USER\Documents\OAE\unilag_english_text.txt',
        'maths': r'c:\Users\USER\Documents\OAE\unilag_maths_text.txt'
    }
    
    for name, path in files.items():
        if os.path.exists(path):
            qs = parse_txt_file(path)
            q_nums = [q[0] for q in qs]
            print(f"{name}: parsed {len(qs)} questions. Min number: {min(q_nums)}, Max number: {max(q_nums)}")
            # Check for gaps
            all_nums = set(q_nums)
            expected = set(range(min(q_nums), max(q_nums) + 1))
            missing = expected - all_nums
            if missing:
                print(f"  Missing question numbers: {sorted(missing)}")
            else:
                print("  No gaps in question numbers.")
        else:
            print(f"File not found: {path}")
