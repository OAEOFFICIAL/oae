// post-utme-engine.js

class PostUTMEEngine {
    constructor() {
        this.params = new URLSearchParams(window.location.search);
        this.schoolKey = this.params.get('school');
        this.faculty = this.params.get('faculty');
        
        // This relies on schoolDatabase from post-utme-prep.js
        this.schoolConfig = typeof schoolDatabase !== 'undefined' ? schoolDatabase[this.schoolKey] : null;
        
        this.questions = [];
        this.currentSubjectIndex = 0;
        this.currentQuestionIndex = 0; // Relative to the subject
        this.answers = {}; // { questionId: selectedOptionIndex }
        
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.reviewMode = false; // Tracks if we are reviewing corrections
        
        this.mode = this.params.get('mode') || 'exam';
        this.studySubjects = this.params.get('subjects') ? this.params.get('subjects').split(',') : null;

        this.init();
    }

    getSubjectsForSchool() {
        const f = this.faculty || 'science';
        
        const subjNames = {
            "physics": "Physics", "chemistry": "Chemistry", "biology": "Biology",
            "literature": "Literature", "government": "Government", "crs": "CRS",
            "economics": "Economics", "accounting": "Accounting", "commerce": "Commerce", "geography": "Geography"
        };
        
        const createSub = (id, limit) => ({ id, name: subjNames[id] || id, file: `${id}.json`, limit });
        const eng = (limit) => ({ id: "english", name: "Use of English", file: "english.json", limit });
        const math = (limit) => ({ id: "mathematics", name: "Mathematics", file: "mathematics.json", limit });
        const gen = (limit) => ({ id: "general-paper", name: "General Paper", file: "general-paper.json", limit });
        
        const jamb4 = {
            science: [eng, math, (l) => createSub('physics', l), (l) => createSub('chemistry', l)],
            arts: [eng, (l) => createSub('literature', l), (l) => createSub('government', l), (l) => createSub('crs', l)],
            commercial: [eng, math, (l) => createSub('economics', l), (l) => createSub('accounting', l)]
        };
        
        const j = jamb4[f] || jamb4.science;

        let allSubjects = [];
        switch(this.schoolKey) {
            case 'unilag': allSubjects = [math(15), eng(15), gen(10)]; break;
            case 'unilorin': allSubjects = [eng(20), math(15), gen(15)]; break;
            case 'lasu': allSubjects = [eng(20), math(15), gen(15)]; break;
            case 'oau': allSubjects = [gen(10), j[0](10), j[1](10), j[2](10)]; break;
            case 'ui': allSubjects = [j[0](25), j[1](25), j[2](25), j[3](25)]; break;
            case 'unn': allSubjects = [j[0](15), j[1](15), j[2](15), j[3](15)]; break;
            case 'buk': allSubjects = [j[0](15), j[1](15), j[2](10), j[3](10)]; break;
            case 'abu': allSubjects = [eng(15), math(15), gen(10), j[2](10)]; break;
            case 'uniben': allSubjects = [eng(25), gen(25), j[1](25), j[2](25)]; break;
            case 'funaab': allSubjects = [eng(15), math(15), createSub('biology', 15), createSub('chemistry', 15)]; break;
            case 'futa': allSubjects = [eng(15), math(15), createSub('physics', 10), createSub('chemistry', 10)]; break;
            case 'uniport': allSubjects = [eng(15), math(15), j[2](10), j[3](10)]; break;
            default: allSubjects = [j[0](15), j[1](15), j[2](10), j[3](10)]; break; // Default fallback
        }

        if (this.mode === 'study' && this.studySubjects) {
            return allSubjects.filter(sub => this.studySubjects.includes(sub.id));
        }
        return allSubjects;
    }

    async init() {
        if (!this.schoolConfig) {
            alert('Invalid school selected. Redirecting back...');
            window.location.href = 'post-utme.html';
            return;
        }

        this.setupUI();
        await this.loadQuestions();
        this.startTimer();
        this.renderSubjectTabs();
        this.renderQuestion();
        this.renderPalette();
    }

    setupUI() {
        const schoolLogo = document.querySelector('.school-logo');
        const schoolName = document.querySelector('.school-info h2');
        const schoolDesc = document.querySelector('.school-info p');
        
        if (schoolLogo) {
            if (this.schoolConfig.logoImg) {
                schoolLogo.innerHTML = `<img src="${this.schoolConfig.logoImg}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`;
                schoolLogo.style.background = "transparent";
            } else {
                schoolLogo.innerText = this.schoolConfig.logo;
            }
        }
        if (schoolName) schoolName.innerText = this.schoolConfig.name;
        if (schoolDesc) {
            let desc = this.mode === 'study' ? 'Interactive Study Session' : 'Post-UTME Mock';
            if (this.faculty) {
                desc += ` • ${this.faculty.charAt(0).toUpperCase() + this.faculty.slice(1)}`;
            }
            schoolDesc.innerText = desc;
        }

        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const btnSubmit = document.getElementById('btn-submit-exam');

        if (this.mode === 'study' && btnSubmit) {
            btnSubmit.innerHTML = '<i class="fas fa-check-circle"></i> Finish Study Session';
        }

        if (btnPrev) btnPrev.addEventListener('click', () => this.navigate(-1));
        if (btnNext) btnNext.addEventListener('click', () => this.navigate(1));
        if (btnSubmit) btnSubmit.addEventListener('click', () => {
            if (this.reviewMode || this.mode === 'study') {
                window.location.href = 'post-utme.html'; // Exit review or study
            } else {
                this.submitExam();
            }
        });
    }

    async loadQuestions() {
        const subjects = this.getSubjectsForSchool();
        if (!subjects || subjects.length === 0) {
            const elem = document.querySelector('.question-text');
            if (elem) elem.innerHTML = `<span style="color:red">Questions for ${this.schoolConfig.name} are not yet loaded into the database.</span>`;
            
            // Remove loading options/explanation if they exist
            document.querySelectorAll('.options-container, .explanation-box').forEach(el => el.remove());
            return;
        }

        this.questions = [];
        let hasCORS = false;

        for (const sub of subjects) {
            try {
                let data = null;
                // Try specific school folder first
                const filePath = `data/post-utme/${this.schoolKey}/${sub.file}`;
                const response = await fetch(filePath);
                
                if (response.ok) {
                    data = await response.json();
                } else {
                    // Fallback to main JAMB database if school-specific file doesn't exist
                    const fallbackPath = `data/${sub.file}`;
                    const fallbackResp = await fetch(fallbackPath);
                    if (fallbackResp.ok) {
                        data = await fallbackResp.json();
                    } else {
                        throw new Error(`File not found: ${filePath} and ${fallbackPath}`);
                    }
                }
                
                let subQuestions = Array.isArray(data) ? data : (data.questions || data.data || []);
                
                // --- DEPARTMENTAL FILTERING LOGIC ---
                // For subjects like UNILAG General Paper where questions are department-specific
                if (sub.id === 'general-paper' && this.faculty) {
                    subQuestions = subQuestions.filter(q => {
                        if (!q.tag) return true;
                        const t = q.tag.toLowerCase();
                        return t === 'general' || t === this.faculty.toLowerCase();
                    });
                }
                
                const shuffled = subQuestions.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, sub.limit);
                
                this.questions.push({
                    id: sub.id,
                    name: sub.name,
                    data: selected
                });
            } catch (err) {
                console.warn(`Could not load ${sub.file}: ${err.message}`);
                this.questions.push({
                    id: sub.id,
                    name: sub.name,
                    data: []
                });
            }
        }
    }

    startTimer() {
        const display = document.querySelector('.timer-display');
        
        if (this.mode === 'study') {
            if (display) {
                display.innerHTML = '<i class="fas fa-infinity" style="font-size:1.8rem;"></i>';
                display.style.color = 'var(--green)';
                const label = display.nextElementSibling;
                if(label) label.innerText = "Study Mode";
            }
            return;
        }

        const timeMatch = this.schoolConfig.time.match(/\d+/);
        const minutes = timeMatch ? parseInt(timeMatch[0]) : 30;
        this.timeRemaining = minutes * 60;
        
        this.timerInterval = setInterval(() => {
            if (this.reviewMode) return; // Stop ticking in review mode

            this.timeRemaining--;
            
            const m = Math.floor(this.timeRemaining / 60).toString().padStart(2, '0');
            const s = (this.timeRemaining % 60).toString().padStart(2, '0');
            
            if (display) {
                display.innerText = `${m}:${s}`;
                if (this.timeRemaining <= 300) { 
                    display.classList.add('warning');
                }
            }

            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.submitExam(true);
            }
        }, 1000);
    }

    renderSubjectTabs() {
        const container = document.querySelector('.subject-tabs');
        if (!container) return;
        
        container.innerHTML = '';
        this.questions.forEach((sub, index) => {
            const btn = document.createElement('button');
            btn.className = `subject-tab ${index === this.currentSubjectIndex ? 'active' : ''}`;
            btn.innerText = sub.name;
            btn.onclick = () => {
                this.currentSubjectIndex = index;
                this.currentQuestionIndex = 0;
                this.renderSubjectTabs();
                this.renderQuestion();
                this.renderPalette();
            };
            container.appendChild(btn);
        });
    }

    // ---------------------------------------------------------------
    // Rich Text Formatter
    // Supports:
    //   **bold**  *italic*  __underline__
    //   ^{sup} or ^x  (superscript)       _{sub} or _x (subscript)
    //   Auto chemical formulas: H2O → H<sub>2</sub>O
    //   MathJax: $...$ and \(...\) pass through untouched
    // ---------------------------------------------------------------
    formatText(str) {
        if (!str) return '';
        let s = String(str);

        // 1. Protect MathJax delimiters with a safe placeholder.
        //    Format: \x01mx{N}\x01  — all lowercase, no A-Z+digit pattern,
        //    so the chemical formula regex below can never corrupt them.
        const mathChunks = [];
        const protect = (match) => {
            const idx = mathChunks.length;
            mathChunks.push(match);
            return `\x01mx${idx}\x01`;
        };
        // Display math  \[...\]  and  $$...$$
        s = s.replace(/\\\[[\s\S]*?\\\]/g, protect);
        s = s.replace(/\$\$[\s\S]*?\$\$/g, protect);
        // Inline math  \(...\)  and  $...$
        s = s.replace(/\\\([\s\S]*?\\\)/g, protect);
        s = s.replace(/\$[^$\n]+?\$/g, protect);

        // 2. Bold:  **text**
        s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // 3. Italic:  *text*  (single star, not inside a word boundary to avoid false matches)
        s = s.replace(/(?<![\w*])\*(?!\*)(.+?)(?<!\*)\*(?![\w*])/g, '<em>$1</em>');

        // 4. Underline:  __text__
        s = s.replace(/(?<!_)__(.+?)__(?!_)/g, '<u>$1</u>');

        // 5. Explicit superscript:  ^{text}  or  ^x (single char)
        s = s.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
        s = s.replace(/\^(\w)/g, '<sup>$1</sup>');

        // 6. Explicit subscript:  _{text}  or  _x (single char)
        s = s.replace(/\_\{([^}]+)\}/g, '<sub>$1</sub>');
        // Note: bare _x is skipped to avoid mangling snake_case words

        // 7. Auto chemical formula subscripting:
        //    Matches sequences like H2O, CO2, H2SO4, C6H12O6, Na2CO3, H2SO4
        //    Strategy: look for ElementSymbol+digits patterns within what
        //    looks like a formula (capital-letter-starts, chemical-ish pattern).
        //    We use a conservative regex that subscripts digits immediately
        //    following one or two letters where the first is uppercase.
        //    Runs multiple passes to handle chains like C6H12O6.
        s = s.replace(/([A-Z][a-z]?)(\d+)(?=[A-Z()|,;. \x01]|$)/g, '$1<sub>$2</sub>');
        // Second pass for trailing numbers at end of token
        s = s.replace(/([A-Z][a-z]?)(\d+)/g, (m, elem, num) => {
            // Don't double-wrap if already inside <sub>
            return `${elem}<sub>${num}</sub>`;
        });

        // 8. Restore protected math chunks
        s = s.replace(/\x01mx(\d+)\x01/g, (_, i) => mathChunks[parseInt(i, 10)]);

        return s;
    }

    // Resolves the correct answer index regardless of whether `answer`
    // is stored as a full option string (UNILAG) or an integer index.
    getCorrectAnswerIndex(q) {
        if (q.answer === undefined || q.answer === null) return -1;
        if (typeof q.answer === 'number') return q.answer;
        const answerStr = String(q.answer).trim();
        // Check if the value is a stringified integer index (e.g. "2")
        const numAns = parseInt(answerStr, 10);
        if (!isNaN(numAns) && numAns >= 0 && q.options && numAns < q.options.length && answerStr === numAns.toString()) {
            return numAns;
        }
        // Fall back to matching by the full option text
        return q.options ? q.options.findIndex(o => String(o).trim() === answerStr) : -1;
    }

    renderQuestion() {
        const currentSub = this.questions[this.currentSubjectIndex];
        const qData = currentSub ? currentSub.data[this.currentQuestionIndex] : null;

        const container = document.querySelector('.main-panel');
        if (!container || !qData) return;

        // Clean up
        const oldTitle = container.querySelector('.question-text');
        const oldOptions = container.querySelector('.options-container');
        const oldExp = container.querySelector('.explanation-box');
        if (oldTitle) oldTitle.remove();
        if (oldOptions) oldOptions.remove();
        if (oldExp) oldExp.remove();

        // Create Title
        const qTitle = document.createElement('h3');
        qTitle.className = 'question-text';
        const instructionHtml = qData.instruction ? `<em class="q-instruction">${this.formatText(qData.instruction)}</em><br><br>` : '';
        qTitle.innerHTML = `<span class="q-number">Q${this.currentQuestionIndex + 1}.</span> ${instructionHtml}${this.formatText(qData.question)}`;

        // Create Options
        const optsContainer = document.createElement('div');
        optsContainer.className = 'options-container';

        const letters = ['A', 'B', 'C', 'D', 'E'];
        const savedAnswer = this.answers[qData.id];
        
        // Find correct index for review mode or study mode feedback
        let correctIdx = -1;
        const isStudyAnswered = this.mode === 'study' && savedAnswer !== undefined;
        if (this.reviewMode || isStudyAnswered) {
            correctIdx = this.getCorrectAnswerIndex(qData);
        }

        // Update the question counter element
        const counterEl = document.getElementById('question-counter');
        if (counterEl && currentSub) {
            counterEl.innerText = `Question ${this.currentQuestionIndex + 1} of ${currentSub.data.length}`;
        }

        qData.options.forEach((opt, idx) => {
            const optDiv = document.createElement('div');
            optDiv.className = 'option-item';
            
            if (!this.reviewMode && !isStudyAnswered && savedAnswer === idx) {
                optDiv.classList.add('selected');
            }

            // --- REVIEW / STUDY MODE STYLING ---
            if (this.reviewMode || isStudyAnswered) {
                optDiv.style.cursor = 'default';
                if (idx === correctIdx) {
                    // Correct Answer gets Green Outline/Background
                    optDiv.style.borderColor = '#10b981';
                    optDiv.style.background = 'rgba(16, 185, 129, 0.1)';
                    optDiv.innerHTML = `
                        <div class="opt-letter" style="background:#10b981; color:white;">${letters[idx]}</div>
                        <div class="opt-text" style="color:var(--oae-dark); font-weight:bold;">${this.formatText(opt)} <i class="fas fa-check" style="color:#10b981; margin-left:10px;"></i></div>
                    `;
                } else if (savedAnswer === idx && savedAnswer !== correctIdx) {
                    // Wrong Answer gets Red Outline/Background
                    optDiv.style.borderColor = '#ef4444';
                    optDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                    optDiv.innerHTML = `
                        <div class="opt-letter" style="background:#ef4444; color:white;">${letters[idx]}</div>
                        <div class="opt-text" style="color:#ef4444; font-weight:bold;">${this.formatText(opt)} <i class="fas fa-times" style="color:#ef4444; margin-left:10px;"></i></div>
                    `;
                } else {
                    optDiv.innerHTML = `
                        <div class="opt-letter">${letters[idx]}</div>
                        <div class="opt-text">${this.formatText(opt)}</div>
                    `;
                }
                
                // Allow changing answer in study mode, but keep feedback visible
                if (this.mode === 'study' && !this.reviewMode) {
                    optDiv.style.cursor = 'pointer';
                    optDiv.onclick = () => {
                        this.answers[qData.id] = idx;
                        this.renderQuestion();
                        this.renderPalette();
                    };
                }
            } else {
                optDiv.innerHTML = `
                    <div class="opt-letter">${letters[idx]}</div>
                    <div class="opt-text">${this.formatText(opt)}</div>
                `;
                optDiv.onclick = () => {
                    Array.from(optsContainer.children).forEach(c => c.classList.remove('selected'));
                    optDiv.classList.add('selected');
                    this.answers[qData.id] = idx;
                    
                    if (this.mode === 'study') {
                        this.renderQuestion(); // Re-render to show feedback
                    }
                    this.renderPalette();
                };
            }

            optsContainer.appendChild(optDiv);
        });

        const nav = container.querySelector('.nav-controls');
        container.insertBefore(qTitle, nav);
        container.insertBefore(optsContainer, nav);

        // --- RENDER EXPLANATION IN REVIEW MODE OR STUDY MODE ---
        if ((this.reviewMode || isStudyAnswered) && qData.explanation) {
            const expDiv = document.createElement('div');
            expDiv.className = 'explanation-box';
            expDiv.style.background = 'rgba(59,130,246,0.06)';
            expDiv.style.borderLeft = '4px solid #3b82f6';
            expDiv.style.padding = '15px 20px';
            expDiv.style.marginTop = '20px';
            expDiv.style.marginBottom = '20px';
            expDiv.style.borderRadius = '0 8px 8px 0';
            expDiv.innerHTML = `<strong style="color:#3b82f6;"><i class="fas fa-lightbulb"></i> Explanation:</strong><p style="margin:8px 0 0; color:var(--oae-dark); line-height:1.6;">${this.formatText(qData.explanation)}</p>`;
            container.insertBefore(expDiv, nav);
        }

        // Update Nav buttons
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        if (btnPrev) btnPrev.disabled = this.currentQuestionIndex === 0;
        if (btnNext) {
            btnNext.innerHTML = (this.currentQuestionIndex === currentSub.data.length - 1) 
                ? 'Next Section <i class="fas fa-arrow-right"></i>' 
                : 'Next <i class="fas fa-arrow-right"></i>';
        }

        // Trigger MathJax rendering for newly injected HTML equations
        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
            window.MathJax.typesetPromise().catch(function (err) {
                console.warn('MathJax typesetting error:', err);
            });
        }
    }

    renderPalette() {
        const board = document.querySelector('.review-board');
        if (!board) return;
        
        board.innerHTML = '';
        const currentSub = this.questions[this.currentSubjectIndex];
        if (!currentSub) return;

        currentSub.data.forEach((q, idx) => {
            const btn = document.createElement('button');
            btn.className = 'p-btn';
            btn.innerText = idx + 1;
            
            if (this.reviewMode || (this.mode === 'study' && this.answers[q.id] !== undefined)) {
                // Show green for right, red for wrong
                const userAnsIdx = this.answers[q.id];
                const correctIdx = this.getCorrectAnswerIndex(q);
                
                if (userAnsIdx === undefined) {
                    btn.style.background = '#e2e8f0'; // missed (review mode only)
                } else if (userAnsIdx === correctIdx) {
                    btn.style.background = '#10b981'; btn.style.color = 'white'; btn.style.borderColor = '#10b981';
                } else {
                    btn.style.background = '#ef4444'; btn.style.color = 'white'; btn.style.borderColor = '#ef4444';
                }
            } else {
                if (this.answers[q.id] !== undefined) {
                    btn.classList.add('answered');
                }
            }

            if (idx === this.currentQuestionIndex) {
                btn.classList.add('current');
            }

            btn.onclick = () => {
                this.currentQuestionIndex = idx;
                this.renderQuestion();
                this.renderPalette();
            };

            board.appendChild(btn);
        });
    }

    navigate(dir) {
        const currentSub = this.questions[this.currentSubjectIndex];
        if (!currentSub) return;

        let newIdx = this.currentQuestionIndex + dir;
        
        if (newIdx < 0) return;
        
        if (newIdx >= currentSub.data.length) {
            if (this.currentSubjectIndex < this.questions.length - 1) {
                this.currentSubjectIndex++;
                this.currentQuestionIndex = 0;
                this.renderSubjectTabs();
                this.renderQuestion();
                this.renderPalette();
            }
            return;
        }

        this.currentQuestionIndex = newIdx;
        this.renderQuestion();
        this.renderPalette();
    }

    submitExam(auto = false) {
        if (!auto) {
            const confirmed = confirm("Are you sure you want to submit your Post-UTME Mock Exam?");
            if (!confirmed) return;
        }

        clearInterval(this.timerInterval);

        // Grade exam
        let totalQuestions = 0;
        let correctAnswers = 0;

        this.questions.forEach(sub => {
            sub.data.forEach(q => {
                totalQuestions++;
                const userAnsIdx = this.answers[q.id];
                if (userAnsIdx !== undefined) {
                    const correctIdx = this.getCorrectAnswerIndex(q);
                    if (userAnsIdx === correctIdx) {
                        correctAnswers++;
                    }
                }
            });
        });

        const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        
        // Massive Results & Admission Predictor Interface
        document.querySelector('.arena-layout').innerHTML = `
            <div class="main-panel" style="grid-column: 1 / -1; padding: 40px; animation: fadeIn 0.5s ease;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <i class="fas fa-check-circle" style="font-size: 5rem; color: var(--green); margin-bottom: 15px;"></i>
                    <h2 style="font-size: 2.2rem; color: var(--oae-dark); margin:0;">Exam Completed</h2>
                    <p style="color: var(--muted); font-size: 1.1rem; margin-top:5px;">Your ${this.schoolConfig.name} Simulation Results</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px;">
                    <div style="background: rgba(10,138,47,0.05); border: 1px solid rgba(10,138,47,0.2); border-radius: 16px; padding: 30px; text-align: center;">
                        <h4 style="margin:0; color: var(--muted); font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">Total Score</h4>
                        <div style="font-size: 3.5rem; font-weight: 800; color: var(--green); line-height:1.2; margin-top:10px;">
                            ${correctAnswers}<span style="font-size: 1.5rem; color: #94a3b8;">/${totalQuestions}</span>
                        </div>
                    </div>
                    <div style="background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.2); border-radius: 16px; padding: 30px; text-align: center;">
                        <h4 style="margin:0; color: var(--muted); font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">Accuracy</h4>
                        <div style="font-size: 3.5rem; font-weight: 800; color: #3b82f6; line-height:1.2; margin-top:10px;">
                            ${percentage}%
                        </div>
                    </div>
                </div>

                <!-- ADMISSION PREDICTOR TOOL -->
                <div style="background: var(--card); border: 1px solid var(--card-border); border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 40px;">
                    <h3 style="margin-top:0; color: var(--oae-dark); font-size: 1.4rem; display:flex; align-items:center; gap:10px;">
                        <i class="fas fa-magic" style="color: #f59e0b;"></i> Admission Chance Predictor
                    </h3>
                    <p style="color: var(--muted); margin-bottom: 25px;">Enter your JAMB score and desired course to calculate your official aggregate and admission probability.</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display:block; font-weight:bold; color:var(--oae-dark); margin-bottom:8px;">JAMB Score (0-400)</label>
                            <input type="number" id="predJamb" placeholder="e.g. 250" min="0" max="400" style="width:100%; padding:14px; border-radius:10px; border:2px solid var(--card-border); background:var(--body-bg); color:var(--oae-dark); outline:none; font-size:1.1rem;">
                        </div>
                        <div>
                            <label style="display:block; font-weight:bold; color:var(--oae-dark); margin-bottom:8px;">Target Course Cutoff (Optional)</label>
                            <input type="number" id="predCutoff" placeholder="e.g. 65" style="width:100%; padding:14px; border-radius:10px; border:2px solid var(--card-border); background:var(--body-bg); color:var(--oae-dark); outline:none; font-size:1.1rem;">
                        </div>
                    </div>
                    ${['unilag', 'oau'].includes(this.schoolKey) ? `
                    <div style="margin-top:20px;">
                        <label style="display:block; font-weight:bold; color:var(--oae-dark); margin-bottom:8px;">
                            O'Level Score ${ this.schoolKey === 'unilag' ? '(out of 20)' : '(out of 10)' }
                        </label>
                        <input type="number" id="predOlevel" placeholder="${ this.schoolKey === 'unilag' ? 'e.g. 15' : 'e.g. 7' }" min="0" max="${ this.schoolKey === 'unilag' ? 20 : 10 }" style="width:100%; padding:14px; border-radius:10px; border:2px solid var(--card-border); background:var(--body-bg); color:var(--oae-dark); outline:none; font-size:1.1rem;">
                    </div>` : ''}
                    <button onclick="window.postUTMEEngine.calculateAdmission(${correctAnswers}, ${totalQuestions})" style="background: #0f172a; color: white; border: none; padding: 15px 30px; border-radius: 10px; font-weight:bold; font-size:1.1rem; width:100%; margin-top:20px; cursor:pointer; transition:0.3s;">
                        Calculate Official Aggregate
                    </button>
                    
                    <div id="predictionResult" style="margin-top: 25px; display:none; padding: 20px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; text-align: center;">
                        <!-- Injected via calculateAdmission -->
                    </div>
                </div>

                <div style="display: flex; gap: 20px; justify-content: center;">
                    <button onclick="window.postUTMEEngine.startReview()" style="background: white; border: 2px solid var(--green); color: var(--green); padding: 16px 35px; border-radius: 12px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; display:flex; align-items:center; gap:10px;">
                        <i class="fas fa-search"></i> Review Corrections
                    </button>
                    <button onclick="window.location.href='post-utme.html'" style="background: linear-gradient(135deg, var(--green), var(--darkgreen)); border: none; color: white; padding: 16px 35px; border-radius: 12px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 8px 24px rgba(10,138,47,0.3); display:flex; align-items:center; gap:10px;">
                        Exit to Dashboard <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        `;
    }

    calculateAdmission(mockScore, maxScore) {
        const jambInput = document.getElementById('predJamb').value;
        const cutoffInput = document.getElementById('predCutoff').value;
        const resultDiv = document.getElementById('predictionResult');

        if (!jambInput || jambInput < 0 || jambInput > 400) {
            alert("Please enter a valid JAMB score between 0 and 400.");
            return;
        }

        let jamb = parseInt(jambInput);
        let totalAggregate = 0;
        let percentageMock = (mockScore / maxScore) * 100;
        let formulaUsed = "";
        
        const oLevelInput = document.getElementById('predOlevel');
        const oLevelVal = oLevelInput ? parseFloat(oLevelInput.value) : NaN;

        switch(this.schoolKey) {
            case 'unilag': {
                // Validate O'Level score (required for UNILAG)
                if (isNaN(oLevelVal) || oLevelVal < 0 || oLevelVal > 20) {
                    alert("Please enter your O'Level score (0–20) for the UNILAG formula.");
                    return;
                }
                totalAggregate = (jamb / 8) + (mockScore / maxScore * 30) + oLevelVal;
                formulaUsed = `(JAMB/8) + (Post-UTME out of 30) + (O'Level: ${oLevelVal})`;
                break;
            }
            case 'ui':
                totalAggregate = (jamb / 8) + (mockScore / maxScore * 50);
                formulaUsed = "(JAMB/8) + (Post-UTME out of 50)";
                break;
            case 'oau': {
                // Validate O'Level score (required for OAU)
                if (isNaN(oLevelVal) || oLevelVal < 0 || oLevelVal > 10) {
                    alert("Please enter your O'Level score (0–10) for the OAU formula.");
                    return;
                }
                totalAggregate = (jamb / 8) + (mockScore / maxScore * 40) + oLevelVal;
                formulaUsed = `(JAMB/8) + (Post-UTME out of 40) + (O'Level: ${oLevelVal})`;
                break;
            }
            case 'unn':
            case 'uniben':
            case 'abu':
                totalAggregate = ((jamb + (percentageMock * 4)) / 2) / 4;
                formulaUsed = "Average of JAMB (400) and Post-UTME (400), scaled to 100%";
                break;
            default:
                totalAggregate = (jamb / 8) + (mockScore / maxScore * 50);
                formulaUsed = "Standard 50:50 formula: (JAMB/8) + (Post-UTME out of 50)";
                break;
        }
        
        totalAggregate = totalAggregate.toFixed(2);

        resultDiv.style.display = 'block';

        if (cutoffInput) {
            const cutoff = parseFloat(cutoffInput);
            if (totalAggregate >= cutoff) {
                resultDiv.innerHTML = `
                    <h4 style="margin:0 0 10px; color: #10b981; font-size: 1.2rem;"><i class="fas fa-glass-cheers"></i> Highly Likely!</h4>
                    <p style="margin:0; color: var(--oae-dark);">Your projected aggregate is <strong>${totalAggregate}%</strong>. You are currently beating the cutoff mark of ${cutoff}%.</p>
                `;
                resultDiv.style.borderColor = '#10b981';
                resultDiv.style.background = 'rgba(16, 185, 129, 0.05)';
            } else {
                resultDiv.innerHTML = `
                    <h4 style="margin:0 0 10px; color: #ef4444; font-size: 1.2rem;"><i class="fas fa-exclamation-circle"></i> Work Harder!</h4>
                    <p style="margin:0; color: var(--oae-dark);">Your projected aggregate is <strong>${totalAggregate}%</strong>. You are falling short of the ${cutoff}% cutoff mark. Review your corrections and practice more!</p>
                `;
                resultDiv.style.borderColor = '#ef4444';
                resultDiv.style.background = 'rgba(239, 68, 68, 0.05)';
            }
        } else {
            resultDiv.innerHTML = `
                <p style="margin:0; color: var(--oae-dark); font-size: 1.1rem;">Your projected official aggregate score is <strong style="color:var(--green); font-size:1.4rem;">${totalAggregate}%</strong></p>
                <span style="font-size:0.85rem; color:var(--muted);">Calculated using: ${formulaUsed}</span>
            `;
            resultDiv.style.borderColor = 'var(--green)';
            resultDiv.style.background = 'rgba(10,138,47,0.05)';
        }
    }

    startReview() {
        this.reviewMode = true;
        
        // Restore layout structure
        document.querySelector('.arena-layout').innerHTML = `
            <div class="main-panel">
                <div class="subject-tabs"></div>
                <div class="nav-controls">
                    <button class="btn-outline" id="btn-prev"><i class="fas fa-arrow-left"></i> Previous</button>
                    <div style="display:flex; gap:10px;">
                        <button class="btn-primary" id="btn-next">Next <i class="fas fa-arrow-right"></i></button>
                    </div>
                </div>
            </div>
            <div class="side-panel">
                <h4 class="palette-title"><i class="fas fa-th"></i> Corrections Palette</h4>
                <div class="review-board"></div>
                <div class="legend-box">
                    <div class="legend-row">
                        <div class="l-color" style="background: #10b981;"></div>
                        <span>Correct</span>
                    </div>
                    <div class="legend-row">
                        <div class="l-color" style="background: #ef4444;"></div>
                        <span>Wrong</span>
                    </div>
                    <div class="legend-row">
                        <div class="l-color" style="background: #e2e8f0;"></div>
                        <span>Missed</span>
                    </div>
                </div>
                <button class="btn-submit" id="btn-submit-exam" style="background:#0f172a; box-shadow:none;"><i class="fas fa-sign-out-alt"></i> Exit Review</button>
            </div>
        `;

        // Update timer text to show review mode
        const timerObj = document.querySelector('.timer-display');
        if (timerObj) timerObj.innerText = "REVIEW";
        timerObj.classList.remove('warning');
        timerObj.style.color = '#3b82f6';

        this.currentSubjectIndex = 0;
        this.currentQuestionIndex = 0;

        // Re-bind buttons
        document.getElementById('btn-prev').addEventListener('click', () => this.navigate(-1));
        document.getElementById('btn-next').addEventListener('click', () => this.navigate(1));
        document.getElementById('btn-submit-exam').addEventListener('click', () => {
            window.location.href = 'post-utme.html';
        });

        this.renderSubjectTabs();
        this.renderQuestion();
        this.renderPalette();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.timer-display')) {
        window.postUTMEEngine = new PostUTMEEngine();
    }
});
