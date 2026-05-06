import os
import sys
import glob
import re
import time
from google import genai
from google.genai import types

# ==========================================
# CONFIGURATION
# ==========================================
# IMPORTANT: Put your Gemini API key here or set it as an environment variable
# export GEMINI_API_KEY="your_api_key"
API_KEY = "THAT KAIN THING"

# We only process .htm files that have "Placeholder notes" in them
BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "notes")

SYSTEM_PROMPT = """You are an expert, highly empathetic Nigerian teacher known for making complex academic topics incredibly simple to understand. You are writing study notes for the OAE platform (Oluwatosin Academy of Excellence).
Your target audience includes slow learners, so you must use simple language, step-by-step breakdowns, and relatable everyday analogies.

CRITICAL INSTRUCTION: Your notes MUST BE EXTREMELY DETAILED AND COMPREHENSIVE, reading like a full textbook chapter but written in accessible language. Do not provide a short summary. You must write at least 6 to 10 detailed paragraphs covering the topic entirely. 
For example, if the topic is "Acids", you must cover: definitions (Arrhenius, Bronsted-Lowry, Lewis), types (strong/weak), physical and chemical properties, reactions, pH scale, uses in daily life, and safety precautions.

Write the content in HTML format. DO NOT INCLUDE `<!DOCTYPE html>`, `<html>`, `<head>`, or `<body>` tags. ONLY output the HTML that should go inside the `<main class="study-note-container">` element.

You MUST strictly follow this HTML structure, using the CSS classes to break up your long, detailed paragraphs:

<main class="study-note-container section">
    <h1>[Topic Name]</h1>
    
    <div class="note-hook">
        <strong><i class="fas fa-lightbulb"></i> Real-World Example:</strong>
        [Provide a highly relatable, everyday example in a detailed paragraph.]
    </div>

    <div class="note-definition">
        <strong>What is [Topic Name]?</strong>
        <p>[Provide a comprehensive and detailed definition and introduction to the topic. Write at least 2 full paragraphs.]</p>
    </div>

    <h2>Detailed Explanation</h2>
    [Write extensive, long-form paragraphs explaining the core concepts, classifications, and properties. Break them down with <h3> tags for subtopics. This section should be very long and detailed, covering everything a student needs for WAEC/JAMB.]
    
    <!-- IF THERE IS A FORMULA OR CHEMICAL EQUATION, INCLUDE THIS BOX -->
    <div class="note-formula">
        <h3>Important Formula / Equation</h3>
        <div class="note-formula-math">[Formula here]</div>
        <ul class="note-formula-vars">
            <li><strong>Var 1</strong> = [Explanation]</li>
        </ul>
    </div>

    <h2>Worked Examples & Applications</h2>
    <div class="note-example">
        <div class="note-example-header">Example 1</div>
        <div class="note-example-body">
            <p class="note-example-question">[Question text]</p>
            <div class="note-example-step">
                <strong>Step 1: [Action]</strong>
                <p>[Detailed explanation of the step]</p>
                <span class="note-example-step-why">Why? [Explain why]</span>
            </div>
        </div>
    </div>

    <div class="note-trap">
        <strong><i class="fas fa-exclamation-triangle"></i> Watch Out! (Exam Trap)</strong>
        [Highlight a common mistake students make in JAMB/WAEC and how to avoid it in detail.]
    </div>

    <div class="note-summary">
        <h3><i class="fas fa-clipboard-list"></i> Conclusion & Summary</h3>
        <p>[Write a concluding paragraph.]</p>
        <ul>
            <li>[Key point 1]</li>
            <li>[Key point 2]</li>
            <li>[Key point 3]</li>
            <li>[Key point 4]</li>
            <li>[Key point 5]</li>
        </ul>
    </div>
</main>
"""

def generate_note_content(subject, topic, current_html):
    if not API_KEY:
        print("ERROR: API key not found. Please set the GEMINI_API_KEY environment variable.")
        sys.exit(1)
        
    client = genai.Client(api_key=API_KEY)
    
    user_prompt = f"Write the study notes for the topic '{topic}' under the subject '{subject}'. Remember to output ONLY the HTML for the <main> block as specified in the instructions."
    
    print(f"Generating content for {subject} -> {topic}...")
    
    max_retries = 5
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                )
            )
            content = response.text
            
            # Clean up Markdown formatting if the LLM wraps it in ```html ... ```
            if content.startswith("```html"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
                
            return content.strip()
            
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                print(f"Rate limit hit (429). Waiting 60 seconds before retrying... (Attempt {attempt+1}/{max_retries})")
                time.sleep(60)
            else:
                print(f"Error generating content: {e}")
                return None
                
    print(f"Failed to generate content for {topic} after {max_retries} attempts.")
    return None

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Check if this is an empty placeholder
    if 'class="study-note-container"' in html:
        print(f"Skipping {os.path.basename(filepath)} - Already processed")
        return
        
    # Extract Topic and Subject
    # We can guess subject from path, e.g., notes/science/physics/motion.htm -> Subject: Physics
    parts = filepath.split(os.sep)
    try:
        idx = parts.index("notes")
        department = parts[idx+1]
        subject = parts[idx+2].capitalize()
    except ValueError:
        subject = "General"
        
    # Extract Topic from the <h1> or <title>
    title_match = re.search(r'<h1>(.*?)</h1>', html)
    if title_match:
        topic = title_match.group(1)
    else:
        topic = os.path.basename(filepath).replace(".htm", "").replace("-", " ").title()
        
    # Ensure css is linked
    if "study-notes.css" not in html:
        # insert css link before </head>
        css_link = '\n  <link rel="stylesheet" href="../../Assets/css/study-notes.css">\n'
        html = html.replace("</head>", f"{css_link}</head>")
        
    new_main_content = generate_note_content(subject, topic, html)
    if not new_main_content:
        return
        
    # Replace the existing <main> block
    # This regex finds <main ...> ... </main> across multiple lines
    new_html = re.sub(r'<main.*?</main>', new_main_content, html, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)
        
    print(f"Successfully updated {filepath}")
    time.sleep(2) # Prevent rate limiting

def main():
    if not API_KEY:
        print("="*60)
        print("ATTENTION: GEMINI_API_KEY is not set.")
        print("Please edit this script to add your API_KEY or set it in your terminal:")
        print('Example: $env:GEMINI_API_KEY="your_api_key" (Windows PowerShell)')
        print("="*60)
        return

    # Find all .htm files in notes directory (excluding index.htm)
    search_pattern = os.path.join(BASE_DIR, "**", "*.htm")
    all_files = glob.glob(search_pattern, recursive=True)
    
    target_files = [f for f in all_files if not f.endswith("index.htm")]
    
    print(f"Found {len(target_files)} topic files.")
    
    # Process just the first 5 for testing
    count = 0
    for file in target_files:
        with open(file, 'r', encoding='utf-8') as f:
            if 'class="study-note-container"' not in f.read():
                process_file(file)
                count += 1
                
        # Limit removed to process all files
        # Removed limit checking block

if __name__ == "__main__":
    main()
