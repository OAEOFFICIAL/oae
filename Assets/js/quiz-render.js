/**
 * OAE Quiz Renderer
 * Handles UI rendering for the quiz interface and results.
 */

const QuizRenderer = (function() {
  let engine = null;
  let container = null;
  let options = {};
  let currentPassageId = null;
  let visitedQuestions = new Set();
  let reviewMode = false;
  let keyListenerAttached = false;

  const letters = ['A', 'B', 'C', 'D', 'E'];

  function setupKeyboardShortcuts() {
    if (keyListenerAttached) return;
    document.addEventListener('keydown', (e) => {
      if (!engine || engine.completed || reviewMode) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const q = engine.getCurrentQuestion();
      if (!q) return;
      
      const key = e.key.toUpperCase();
      const validLetters = ['A', 'B', 'C', 'D', 'E'];
      
      if (validLetters.includes(key)) {
        const idx = validLetters.indexOf(key);
        if (idx < q.options.length) {
          engine.saveAnswer(q.id, idx);
          visitedQuestions.add(q.id);
          renderQuiz();
        }
      } else if (e.key === 'ArrowRight') {
        if (engine.nextQuestion()) {
          visitedQuestions.add(engine.getCurrentQuestion().id);
          renderQuiz();
        }
      } else if (e.key === 'ArrowLeft') {
        if (engine.previousQuestion()) {
          visitedQuestions.add(engine.getCurrentQuestion().id);
          renderQuiz();
        }
      }
    });
    keyListenerAttached = true;
  }

  function render(eng, cont, opts) {
    engine = eng;
    container = cont;
    options = opts || {};
    visitedQuestions.clear();
    currentPassageId = null;
    reviewMode = false;

    // Set up timer callback
    engine.onTimerTick = (sec, fmt) => {
      const timerDisplay = document.getElementById('timer-display');
      if (timerDisplay) timerDisplay.textContent = fmt;
      
      // Warning color when less than 5 minutes remain
      if (sec <= 300 && timerDisplay) {
        timerDisplay.style.color = '#e74c3c';
        timerDisplay.style.fontWeight = '800';
      }
    };

    // Build Calculator once
    buildCalculator();

    // Attach global keyboard shortcuts
    setupKeyboardShortcuts();

    renderQuiz();
  }

  function buildCalculator() {
    if (document.getElementById('oae-calculator')) return;
    const calc = document.createElement('div');
    calc.id = 'oae-calculator';
    calc.style.cssText = 'display:none;position:fixed;top:80px;right:20px;background:#333;color:white;padding:16px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.5);z-index:9999;width:240px;';
    
    calc.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;align-items:center;">
        <strong style="color:var(--green);"><i class="fas fa-calculator"></i> Calculator</strong>
        <i class="fas fa-times" style="cursor:pointer;" onclick="document.getElementById('oae-calculator').style.display='none'"></i>
      </div>
      <input type="text" id="calc-display" readonly style="width:100%;background:#e0e0e0;border:none;padding:12px;border-radius:8px;font-size:1.5rem;text-align:right;margin-bottom:12px;color:black;">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
        <button class="calc-btn" data-val="7">7</button><button class="calc-btn" data-val="8">8</button><button class="calc-btn" data-val="9">9</button><button class="calc-btn calc-op" data-val="/">/</button>
        <button class="calc-btn" data-val="4">4</button><button class="calc-btn" data-val="5">5</button><button class="calc-btn" data-val="6">6</button><button class="calc-btn calc-op" data-val="*">*</button>
        <button class="calc-btn" data-val="1">1</button><button class="calc-btn" data-val="2">2</button><button class="calc-btn" data-val="3">3</button><button class="calc-btn calc-op" data-val="-">-</button>
        <button class="calc-btn" data-val="0">0</button><button class="calc-btn" data-val=".">.</button><button class="calc-btn" data-val="C" style="background:#e74c3c;">C</button><button class="calc-btn calc-op" data-val="+">+</button>
        <button class="calc-btn" data-val="=" style="grid-column:span 4;background:var(--green);">=</button>
      </div>
    `;
    
    if (!document.getElementById('calc-styles')) {
      const style = document.createElement('style');
      style.id = 'calc-styles';
      style.textContent = `
        .calc-btn { padding:12px 0; border:none; border-radius:6px; background:#555; color:white; font-size:1.2rem; cursor:pointer; font-weight:700; transition:0.2s;}
        .calc-btn:hover { background:#666; }
        .calc-op { background:#f39c12; }
        .calc-op:hover { background:#e67e22; }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(calc);
    
    let currentInput = '';
    calc.querySelectorAll('.calc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        const display = document.getElementById('calc-display');
        if (val === 'C') { currentInput = ''; display.value = ''; }
        else if (val === '=') {
          try { 
            currentInput = new Function('return (' + currentInput + ')')() + ''; 
            display.value = currentInput;
          } catch(e) { display.value = 'Error'; currentInput = ''; }
        }
        else {
          currentInput += val;
          display.value = currentInput;
        }
      });
    });
  }

  function renderQuiz() {
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'quiz-interface';
    wrapper.style.cssText = 'background:white;border-radius:16px;padding:24px;box-shadow:var(--shadow);user-select:none;';
    
    // Anti-Cheating: Prevent right-click and copy
    wrapper.oncontextmenu = () => false;
    wrapper.oncopy = () => false;

    if (document.body.classList.contains('dark-mode')) {
      wrapper.style.background = '#1a1a1a';
    }

    const q = engine.getCurrentQuestion();
    if (!q) return;

    // Subject tabs
    wrapper.appendChild(buildSubjectTabs());

    // Header with timer and progress
    wrapper.appendChild(buildHeader());

    // Passage (persistent for same passageId)
    if (q.passageId && q.passageId !== currentPassageId) {
      currentPassageId = q.passageId;
    }
    if (currentPassageId && q.passageText) {
      wrapper.appendChild(buildPassage(q));
    }

    // Question
    wrapper.appendChild(buildQuestion(q));

    // Topic tag (simplified category)
    if (q.topic) {
      const tag = document.createElement('span');
      tag.style.cssText = 'display:inline-block;background:rgba(10,138,47,0.1);color:var(--green);padding:4px 12px;border-radius:16px;font-size:0.8rem;margin-bottom:16px;';
      tag.textContent = q.topic.split(' - ')[0].trim();
      wrapper.appendChild(tag);
    }

    // Options
    wrapper.appendChild(buildOptions(q));

    // Explanation (if answered and allowed)
    const saved = engine.getAnswer(q.id);
    const isAnswered = saved !== undefined;
    const showExplanationNow = (options.mode !== 'exam') && options.showExplanations && isAnswered;
    if (showExplanationNow && q.explanation) {
      wrapper.appendChild(buildExplanation(q));
    }

    // Navigation buttons
    wrapper.appendChild(buildNavigation());

    // Question palette / Review board
    wrapper.appendChild(buildPalette());

    // Legend
    wrapper.appendChild(buildLegend());

    container.appendChild(wrapper);
  }

  function buildSubjectTabs() {
    const tabs = document.createElement('div');
    tabs.style.cssText = 'display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;overflow-x:auto;padding-bottom:4px;';
    
    engine.getSubjects().forEach(subj => {
      const btn = document.createElement('button');
      btn.className = 'subject-tab';
      btn.style.cssText = 'padding:8px 20px;border:1px solid var(--card-border);border-radius:30px;background:transparent;cursor:pointer;font-weight:600;white-space:nowrap;';
      
      if (subj === engine.currentSubject) {
        btn.style.background = 'var(--green)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--green)';
      }
      
      const subjInfo = window.QuizConfig?.subjects?.find(s => s.id === subj);
      btn.textContent = subjInfo ? subjInfo.name : subj.charAt(0).toUpperCase() + subj.slice(1);
      
      btn.addEventListener('click', () => {
        engine.switchSubject(subj);
        currentPassageId = null;
        renderQuiz();
      });
      
      tabs.appendChild(btn);
    });
    
    return tabs;
  }

  function buildHeader() {
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px;';
    
    const timerDiv = document.createElement('div');
    timerDiv.id = 'timer-display';
    timerDiv.style.cssText = 'font-size:1.5rem;font-weight:700;';
    timerDiv.textContent = engine.formatTime(engine.remainingSeconds);
    
    const progress = document.createElement('div');
    progress.style.cssText = 'color:var(--muted);';
    progress.textContent = `${engine.currentIndex + 1}/${engine.getSubjectQuestionCount(engine.currentSubject)}`;
    
    const modeBadge = document.createElement('div');
    modeBadge.style.cssText = 'padding:4px 12px;background:var(--green);color:white;border-radius:20px;font-size:0.9rem;';
    modeBadge.textContent = options.mode.toUpperCase();
    
    const calcBtn = document.createElement('button');
    calcBtn.className = 'btn-outline';
    calcBtn.style.cssText = 'padding:6px 12px;font-size:0.9rem;border-color:var(--card-border);border-radius:20px;';
    calcBtn.innerHTML = '<i class="fas fa-calculator"></i> Calc';
    calcBtn.addEventListener('click', () => {
      const c = document.getElementById('oae-calculator');
      if(c) c.style.display = c.style.display === 'none' ? 'block' : 'none';
    });

    const actionsDiv = document.createElement('div');
    actionsDiv.style.cssText = 'display:flex;gap:8px;align-items:center;';
    actionsDiv.appendChild(modeBadge);
    actionsDiv.appendChild(calcBtn);

    header.appendChild(timerDiv);
    header.appendChild(progress);
    header.appendChild(actionsDiv);
    
    return header;
  }

  function buildPassage(q) {
    const passage = document.createElement('div');
    passage.style.cssText = 'background:rgba(10,138,47,0.05);padding:16px;margin:16px 0;border-left:4px solid var(--green);border-radius:0 8px 8px 0;max-height:200px;overflow-y:auto;';
    passage.innerHTML = `<strong style="color:var(--green);">${q.passageTitle || 'PASSAGE'}</strong><p style="margin-top:8px;line-height:1.6;">${q.passageText}</p>`;
    return passage;
  }

  function buildQuestion(q) {
    const container = document.createElement('div');
    
    const qDiv = document.createElement('h3');
    qDiv.style.cssText = 'margin:0 0 20px;line-height:1.5;color:var(--oae-dark);';
    qDiv.innerHTML = `<span style="color:var(--green);font-weight:700;">Q${engine.currentIndex + 1}.</span> ${q.question}`;
    container.appendChild(qDiv);
    
    // Support for Image/Diagram questions
    if (q.image) {
      const img = document.createElement('img');
      img.src = q.image;
      img.alt = 'Question Diagram';
      img.style.cssText = 'max-width:100%;height:auto;margin-bottom:20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);';
      container.appendChild(img);
    }
    
    return container;
  }

  function buildOptions(q) {
    const optsDiv = document.createElement('div');
    const saved = engine.getAnswer(q.id);
    
    q.options.forEach((opt, idx) => {
      const optDiv = document.createElement('div');
      optDiv.className = 'option-item';
      optDiv.style.cssText = 'padding:12px 16px;margin-bottom:8px;border:1.5px solid var(--card-border);border-radius:12px;cursor:pointer;display:flex;align-items:center;transition:all 0.15s;';
      
      if (saved === idx) {
        optDiv.style.background = 'rgba(10,138,47,0.1)';
        optDiv.style.borderColor = 'var(--green)';
        
        if (options.mode !== 'exam' && options.showExplanations) {
          optDiv.style.background = idx === q.answer ? 'rgba(10,138,47,0.2)' : 'rgba(231,76,60,0.1)';
          optDiv.style.borderColor = idx === q.answer ? 'var(--green)' : '#e74c3c';
        }
      }
      
      optDiv.innerHTML = `
        <span style="width:32px;height:32px;border-radius:50%;background:rgba(10,138,47,0.1);display:flex;align-items:center;justify-content:center;margin-right:16px;font-weight:700;color:var(--green);">${letters[idx]}</span>
        <span style="color:var(--oae-dark);">${opt}</span>
      `;
      
      optDiv.addEventListener('click', () => {
        if (reviewMode || engine.completed) return;
        engine.saveAnswer(q.id, idx);
        visitedQuestions.add(q.id);
        renderQuiz();
      });
      
      optsDiv.appendChild(optDiv);
    });
    
    return optsDiv;
  }

  function buildExplanation(q) {
    const expDiv = document.createElement('div');
    expDiv.style.cssText = 'margin-top:16px;padding:16px;background:rgba(10,138,47,0.05);border-radius:12px;border-left:4px solid var(--green);';
    expDiv.innerHTML = `<i class="fas fa-info-circle" style="color:var(--green);margin-right:8px;"></i> <strong style="color:var(--oae-dark);">Explanation:</strong> <span style="color:var(--muted);">${q.explanation}</span>`;
    return expDiv;
  }

  function buildNavigation() {
    const nav = document.createElement('div');
    nav.style.cssText = 'display:flex;gap:12px;margin:20px 0;flex-wrap:wrap;align-items:center;';
    
    const prev = document.createElement('button');
    prev.className = 'btn-outline';
    prev.style.cssText = 'padding:12px 24px;';
    prev.innerHTML = '<i class="fas fa-arrow-left"></i> Prev';
    prev.disabled = engine.currentIndex === 0;
    prev.addEventListener('click', () => {
      if (engine.previousQuestion()) {
        visitedQuestions.add(engine.getCurrentQuestion().id);
        renderQuiz();
      }
    });
    
    const next = document.createElement('button');
    next.className = 'btn-primary';
    next.style.cssText = 'padding:12px 24px;background:var(--green);';
    next.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    next.disabled = engine.currentIndex === engine.getSubjectQuestionCount(engine.currentSubject) - 1;
    next.addEventListener('click', () => {
      if (engine.nextQuestion()) {
        visitedQuestions.add(engine.getCurrentQuestion().id);
        renderQuiz();
      }
    });
    
    const flagBtn = document.createElement('button');
    flagBtn.className = 'btn-outline';
    const isFlagged = engine.isFlagged(engine.getCurrentQuestion().id);
    flagBtn.style.cssText = isFlagged ? 'padding:12px 24px;border-color:#9b59b6;color:#9b59b6;background:rgba(155,89,182,0.1);' : 'padding:12px 24px;';
    flagBtn.innerHTML = `<i class="fas fa-flag"></i> ${isFlagged ? 'Unflag' : 'Flag'}`;
    flagBtn.addEventListener('click', () => {
      engine.toggleFlag(engine.getCurrentQuestion().id);
      renderQuiz();
    });

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-outline';
    clearBtn.style.cssText = 'padding:12px 24px;color:#e74c3c;border-color:transparent;';
    clearBtn.innerHTML = '<i class="fas fa-eraser"></i> Clear';
    clearBtn.disabled = !engine.isAnswered(engine.getCurrentQuestion().id);
    clearBtn.addEventListener('click', () => {
      engine.clearAnswer(engine.getCurrentQuestion().id);
      renderQuiz();
    });

    const submit = document.createElement('button');
    submit.className = 'btn-primary';
    submit.style.cssText = 'padding:12px 24px;background:#e74c3c;';
    submit.innerHTML = '<i class="fas fa-check"></i> Submit';
    submit.addEventListener('click', () => {
      let totalUnanswered = 0;
      engine.getSubjects().forEach(subj => {
        totalUnanswered += engine.getUnansweredCount(subj);
      });
      
      let msg = 'Submit quiz? You cannot undo this action.';
      if (totalUnanswered > 0) {
        msg = `WARNING: You still have ${totalUnanswered} unanswered question(s)! Are you sure you want to submit?`;
      }
      
      if (confirm(msg)) {
        const results = engine.finishQuiz();
        if (results) renderResults(results);
      }
    });
    
    nav.appendChild(prev);
    nav.appendChild(next);
    
    const spacer = document.createElement('div');
    spacer.style.flex = '1';
    nav.appendChild(spacer);
    
    nav.appendChild(flagBtn);
    nav.appendChild(clearBtn);
    nav.appendChild(submit);
    
    return nav;
  }

  function buildPalette() {
    const wrapper = document.createElement('div');
    wrapper.style.marginTop = '20px';
    
    const title = document.createElement('p');
    title.style.cssText = 'margin-bottom:8px;font-weight:600;color:var(--oae-dark);';
    title.innerHTML = '<i class="fas fa-th"></i> Question Palette';
    wrapper.appendChild(title);
    
    const grid = document.createElement('div');
    grid.className = 'review-board';
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(10,1fr);gap:6px;';
    
    const qs = engine.questionsBySubject[engine.currentSubject];
    qs.forEach((question, idx) => {
      const btn = document.createElement('button');
      btn.style.cssText = 'aspect-ratio:1;border:1px solid var(--card-border);border-radius:6px;background:var(--card);cursor:pointer;font-weight:600;';
      
      if (engine.isFlagged(question.id)) {
        btn.style.background = '#9b59b6';
        btn.style.color = 'white';
        btn.style.borderColor = '#8e44ad';
      } else if (engine.isAnswered(question.id)) {
        btn.style.background = 'var(--green)';
        btn.style.color = 'white';
      } else if (visitedQuestions.has(question.id)) {
        btn.style.background = '#fff3cd';
        btn.style.borderColor = '#ffc107';
      }
      
      if (idx === engine.currentIndex) {
        btn.style.boxShadow = '0 0 0 3px var(--green)';
        btn.style.fontWeight = '800';
      }
      
      btn.textContent = idx + 1;
      btn.addEventListener('click', () => {
        engine.goToQuestion(idx);
        renderQuiz();
      });
      
      grid.appendChild(btn);
    });
    
    wrapper.appendChild(grid);
    return wrapper;
  }

  function buildLegend() {
    const legend = document.createElement('div');
    legend.style.cssText = 'display:flex;gap:16px;margin-top:12px;font-size:0.8rem;flex-wrap:wrap;color:var(--muted);';
    
    const answered = engine.getAnsweredCount(engine.currentSubject);
    const total = engine.getSubjectQuestionCount(engine.currentSubject);
    
    const flagged = engine.flaggedQuestions ? engine.flaggedQuestions.size : 0;
    
    legend.innerHTML = `
      <span><span style="display:inline-block;width:12px;height:12px;background:var(--green);border-radius:3px;margin-right:4px;"></span> Answered (${answered})</span>
      <span><span style="display:inline-block;width:12px;height:12px;background:#fff3cd;border:1px solid #ffc107;border-radius:3px;margin-right:4px;"></span> Visited (${visitedQuestions.size})</span>
      <span><span style="display:inline-block;width:12px;height:12px;background:#9b59b6;border-radius:3px;margin-right:4px;"></span> Flagged (${flagged})</span>
      <span><span style="display:inline-block;width:12px;height:12px;background:var(--card);border:1px solid var(--card-border);border-radius:3px;margin-right:4px;"></span> Unanswered (${total - answered})</span>
    `;
    
    return legend;
  }

  function renderResults(results) {
    const subjectScores = results.subjectScores;
    const pct = results.percentage;
    
    let subjectBreakdownHtml = '';
    Object.entries(subjectScores).forEach(([subj, score]) => {
      subjectBreakdownHtml += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:rgba(10,138,47,0.03);border-radius:8px;margin-bottom:8px;">
          <span><strong style="color:var(--oae-dark);">${score.name}</strong></span>
          <span style="color:var(--muted);">${score.correct}/${score.total} correct</span>
          <span style="font-weight:700;color:var(--green);">${score.marks}/${score.totalMarks}</span>
        </div>
      `;
    });
    
    let questionsReviewHtml = '';
    Object.entries(engine.questionsBySubject).forEach(([subj, qs]) => {
      const subjInfo = window.QuizConfig?.subjects?.find(s => s.id === subj) || { name: subj };
      questionsReviewHtml += `<h4 style="margin:20px 0 12px;color:var(--green);"><i class="fas fa-book"></i> ${subjInfo.name}</h4>`;
      
      qs.forEach((q, idx) => {
        const userAns = engine.getAnswer(q.id);
        const isCorrect = userAns === q.answer;
        const userLetter = userAns !== undefined ? letters[userAns] : 'Not answered';
        const correctLetter = letters[q.answer];
        
        questionsReviewHtml += `
          <div style="padding:16px;border-bottom:1px solid var(--card-border);${isCorrect ? 'background:rgba(10,138,47,0.03);' : 'background:rgba(231,76,60,0.02);'}">
            <div style="display:flex;gap:12px;">
              <span style="font-weight:700;min-width:50px;color:var(--oae-dark);">Q${idx+1}</span>
              <div style="flex:1;">
                <div style="margin-bottom:8px;color:var(--oae-dark);">${q.question}</div>
                <div style="font-size:0.9rem;">
                  <span>Your answer: <strong style="color:${isCorrect ? 'var(--green)' : '#e74c3c'};">${userLetter}</strong></span>
                  ${!isCorrect ? `<span style="margin-left:16px;">Correct: <strong style="color:var(--green);">${correctLetter}</strong></span>` : ''}
                </div>
                ${q.explanation ? `<div style="margin-top:8px;padding:8px;background:rgba(10,138,47,0.05);border-radius:6px;"><i class="fas fa-info-circle" style="color:var(--green);"></i> ${q.explanation}</div>` : ''}
              </div>
            </div>
          </div>
        `;
      });
    });
    
    container.innerHTML = `
      <div class="quiz-interface" id="results-container" style="background:white;border-radius:16px;padding:24px;">
        <h2 style="margin-bottom:20px;color:var(--oae-dark);"><i class="fas fa-trophy" style="color:var(--green);"></i> Quiz Complete!</h2>
        
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;">
          <div style="text-align:center;padding:20px;background:rgba(10,138,47,0.05);border-radius:12px;">
            <div style="font-size:2rem;font-weight:700;color:var(--green);">${results.totalCorrect}</div>
            <div style="color:var(--muted);">Correct</div>
          </div>
          <div style="text-align:center;padding:20px;background:rgba(10,138,47,0.05);border-radius:12px;">
            <div style="font-size:2rem;font-weight:700;color:var(--green);">${results.totalQuestions}</div>
            <div style="color:var(--muted);">Total Questions</div>
          </div>
          <div style="text-align:center;padding:20px;background:rgba(10,138,47,0.05);border-radius:12px;">
            <div style="font-size:2rem;font-weight:700;color:var(--green);">${pct}%</div>
            <div style="color:var(--muted);">Percentage</div>
          </div>
          <div style="text-align:center;padding:20px;background:var(--green);border-radius:12px;">
            <div style="font-size:2rem;font-weight:700;color:white;">${results.totalMarks}/${results.maxMarks}</div>
            <div style="color:rgba(255,255,255,0.9);">Total Score</div>
          </div>
        </div>
        
        <h3 style="margin-bottom:16px;color:var(--oae-dark);">Subject Breakdown</h3>
        ${subjectBreakdownHtml}
        
        <h3 style="margin:24px 0 16px;color:var(--oae-dark);">Question Review</h3>
        <div style="max-height:500px;overflow-y:auto;border:1px solid var(--card-border);border-radius:8px;">
          ${questionsReviewHtml}
        </div>
        
        <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
          <button class="btn-primary" onclick="location.reload()"><i class="fas fa-redo-alt"></i> New Quiz</button>
          <button class="btn-outline" onclick="window.location.href='../Index.htm'"><i class="fas fa-home"></i> Home</button>
          <button class="btn-primary" id="download-pdf-btn" style="background:#e67e22;"><i class="fas fa-download"></i> Download PDF</button>
        </div>
      </div>
    `;
    
    // Attach PDF download handler
    const pdfBtn = document.getElementById('download-pdf-btn');
    if (pdfBtn && typeof QuizPDF !== 'undefined') {
      pdfBtn.addEventListener('click', () => {
        QuizPDF.downloadResults(results, engine.questionsBySubject, engine.userAnswers);
      });
    }
  }

  // Public API
  return {
    render
  };
})();