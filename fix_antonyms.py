import re

with open('notes/english/antonyms.htm', 'r', encoding='utf-8') as f:
    html = f.read()

new_main = """<link rel="stylesheet" href="../../Assets/css/study-notes.css">
</head>
<body>
  <main class="study-note-container section">
    <h1>Antonyms</h1>
    
    <div class="note-hook">
        <strong><i class="fas fa-lightbulb"></i> Real-World Example:</strong>
        Imagine you are turning on a tap. You can turn it to <strong>Hot</strong> or you can turn it to <strong>Cold</strong>. "Hot" and "Cold" are exact opposites. In English, when two words mean the exact opposite of each other, we call them Antonyms!
    </div>

    <div class="note-definition">
        <strong>What is an Antonym?</strong>
        <p>An antonym is simply a word that means the opposite of another word. For example, the opposite of "Day" is "Night". The opposite of "Happy" is "Sad". Knowing antonyms helps you describe things better and helps you score very high in your exams!</p>
    </div>

    <h2>Breaking It Down Step-by-Step</h2>
    <p>Not all antonyms are the same. English has two main types of opposites that you need to know:</p>
    
    <h3>1. Absolute (Binary) Antonyms</h3>
    <p>These are "Do or Die" opposites. It is either one or the other, there is no in-between. You cannot be a little bit of both.</p>
    <ul>
        <li><strong>Alive / Dead</strong> (You cannot be "a little bit" dead)</li>
        <li><strong>Pass / Fail</strong> (You either passed the exam or you failed it)</li>
        <li><strong>On / Off</strong> (The light switch is either on or off)</li>
    </ul>

    <h3>2. Gradable Antonyms</h3>
    <p>These are opposites where there can be a middle ground. Think of it like a volume button on your phone, you can turn it up a little bit or a lot.</p>
    <ul>
        <li><strong>Hot / Cold</strong> (Water can also be Warm)</li>
        <li><strong>Rich / Poor</strong> (You can be middle-class, not very rich and not very poor)</li>
        <li><strong>Fast / Slow</strong> (You can move at a medium speed)</li>
    </ul>

    <h2>Worked Examples (The "How-To")</h2>
    <div class="note-example">
        <div class="note-example-header">JAMB Example 1</div>
        <div class="note-example-body">
            <p class="note-example-question">Choose the word most nearly opposite in meaning to the italicized word:<br>The teacher gave a <em>concise</em> summary of the book.</p>
            <ul>
                <li>A. Long</li>
                <li>B. Short</li>
                <li>C. Wordy</li>
                <li>D. Clear</li>
            </ul>
            <div class="note-example-step">
                <strong>Step 1: Understand the italicized word.</strong>
                <p>What does "concise" mean? It means "short and straight to the point".</p>
                <span class="note-example-step-why">Why? If the teacher gave a short summary, the opposite would be a summary that is too long and has too many words.</span>
            </div>
            <div class="note-example-step">
                <strong>Step 2: Find the opposite.</strong>
                <p>The correct answer is <strong>C. Wordy</strong>.</p>
                <span class="note-example-step-why">Why? Because "wordy" means using too many words, which is the exact opposite of being short and straight to the point (concise).</span>
            </div>
        </div>
    </div>

    <div class="note-trap">
        <strong><i class="fas fa-exclamation-triangle"></i> Watch Out! (Exam Trap)</strong>
        In exams, they will almost always put a <strong>Synonym</strong> (a word with the SAME meaning) in the options to trick you! In the example above, Option B ("Short") is the same meaning as "Concise". If you forget that the question asked for an <em>Antonym</em>, you might accidentally choose the Synonym. Always read the instruction carefully!
    </div>

    <div class="note-summary">
        <h3><i class="fas fa-clipboard-list"></i> Quick Summary</h3>
        <ul>
            <li>An antonym is a word that means the opposite of another word.</li>
            <li><strong>Absolute antonyms</strong> have no middle ground (e.g., Alive/Dead).</li>
            <li><strong>Gradable antonyms</strong> have a middle ground (e.g., Hot/Cold).</li>
            <li>Always watch out for synonyms trying to trick you in the exam options!</li>
        </ul>
    </div>
    
    <div class="note-nav">
        <a href="../JambEnglishSyllabus.htm"><i class="fas fa-arrow-left"></i> Back to Syllabus</a>
    </div>
  </main>"""

html = re.sub(r'</head>\s*<body>\s*<main.*?</main>', new_main, html, flags=re.DOTALL)
with open('notes/english/antonyms.htm', 'w', encoding='utf-8') as f:
    f.write(html)
