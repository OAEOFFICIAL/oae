/**
 * OAE Quiz Configuration Module
 * Handles mode selection, subject choices, filters, and quiz initialization.
 */

const QuizConfig = (function() {
  // Subject definitions
  const subjects = [
    { id: 'english', name: 'English', cap: 60, marks: 100 },
    { id: 'mathematics', name: 'Mathematics', cap: 40, marks: 100 },
    { id: 'physics', name: 'Physics', cap: 40, marks: 100 },
    { id: 'chemistry', name: 'Chemistry', cap: 40, marks: 100 },
    { id: 'biology', name: 'Biology', cap: 40, marks: 100 },
    { id: 'economics', name: 'Economics', cap: 40, marks: 100 },
    { id: 'accounting', name: 'Accounting', cap: 40, marks: 100 },
    { id: 'government', name: 'Government', cap: 40, marks: 100 },
    { id: 'literature', name: 'Literature', cap: 40, marks: 100 },
    { id: 'crs', name: 'CRS', cap: 40, marks: 100 }
  ];

  // State
  let currentMode = 'exam';
  let selectedSubjects = new Set(['english']);
  let loader = null;

  // DOM elements
  let subjectContainer, subjectMessage, timeLimitInput;
  let selectedSubjectsText, questionCountDisplay, startBtn;
  let studyFilters, filterSubject, topicFilter, yearFilter;
  let container;

  // Initialize the module
  function init() {
    loader = new QuizDataLoader();
    
    // Get DOM references
    subjectContainer = document.getElementById('subject-container');
    subjectMessage = document.getElementById('subject-message');
    timeLimitInput = document.getElementById('time-limit');
    selectedSubjectsText = document.getElementById('selected-subjects-text');
    questionCountDisplay = document.getElementById('question-count-display');
    startBtn = document.getElementById('start-quiz-btn');
    container = document.getElementById('quiz-container');
    studyFilters = document.getElementById('study-filters');
    filterSubject = document.getElementById('filter-subject');
    topicFilter = document.getElementById('topic-filter');
    yearFilter = document.getElementById('year-filter');

    // Attach event listeners
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => switchMode(card.dataset.mode));
    });

    filterSubject.addEventListener('change', () => {
      loadFiltersForSubject(filterSubject.value);
    });

    startBtn.addEventListener('click', startQuiz);

    // Initial render
    updateUIForMode();

    // Check for saved session
    checkSavedSession();
  }

  function checkSavedSession() {
    try {
      const saved = localStorage.getItem('oae_quiz_state');
      if (saved) {
        if (confirm('You have an unfinished quiz session. Would you like to resume?')) {
          resumeSession();
        } else {
          localStorage.removeItem('oae_quiz_state');
        }
      }
    } catch (e) { console.warn(e); }
  }

  function resumeSession() {
    container.innerHTML = `<div style="text-align:center;padding:40px;"><i class="fas fa-spinner fa-spin"></i> Resuming your quiz...</div>`;
    
    setTimeout(() => {
      try {
        const engine = SimpleQuizEngine.loadState();
        if (!engine) throw new Error("Could not restore saved state.");

        window.QuizConfig = window.QuizConfig || {};
        window.QuizConfig.subjects = subjects;
        window.QuizConfig.currentMode = engine.config.mode;
        window.QuizConfig.showExplanations = engine.config.showExplanations || false;

        engine.startTimer();
        
        // Hide config UI for immersive mode
        const nav = document.querySelector('.quiz-navbar');
        const footer = document.querySelector('footer');
        const header = document.querySelector('.quiz-header');
        const cards = document.querySelectorAll('.config-card');
        const summary = document.querySelector('.summary-bar');
        
        if (nav) nav.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (header) header.style.display = 'none';
        if (summary) summary.style.display = 'none';
        cards.forEach(c => c.style.display = 'none');
        window.scrollTo(0, 0);

        if (typeof QuizRenderer !== 'undefined') {
          QuizRenderer.render(engine, container, {
            mode: engine.config.mode,
            showExplanations: window.QuizConfig.showExplanations
          });
        }
      } catch (e) {
        console.error(e);
        container.innerHTML = `<div style="color:red;padding:20px;"><i class="fas fa-exclamation-triangle"></i> Error resuming quiz: ${e.message}</div>`;
      }
    }, 500);
  }

  function switchMode(mode) {
    currentMode = mode;
    
    // Update active card styling
    document.querySelectorAll('.mode-card').forEach(card => {
      card.classList.toggle('active', card.dataset.mode === mode);
    });

    if (mode === 'exam') {
      selectedSubjects.add('english');
    }

    updateUIForMode();
  }

  function updateUIForMode() {
    if (currentMode === 'exam') {
      timeLimitInput.value = 105;
      timeLimitInput.disabled = true;
      subjectMessage.textContent = 'English is required. Select exactly 3 more subjects.';
      studyFilters.style.display = 'none';
    } else if (currentMode === 'quiz') {
      timeLimitInput.disabled = false;
      timeLimitInput.value = 30;
      subjectMessage.textContent = 'Select any combination of subjects.';
      studyFilters.style.display = 'none';
    } else {
      timeLimitInput.disabled = false;
      timeLimitInput.value = 30;
      subjectMessage.textContent = 'Select subjects and optionally filter by topic/year.';
      studyFilters.style.display = 'block';
      updateFilterSubjectDropdown();
    }
    
    renderSubjects();
    updateSummary();
  }

  function updateFilterSubjectDropdown() {
    filterSubject.innerHTML = '<option value="">Select subject first</option>';
    Array.from(selectedSubjects).forEach(subjId => {
      const subj = subjects.find(s => s.id === subjId);
      filterSubject.add(new Option(subj.name, subjId));
    });
  }

  async function loadFiltersForSubject(subjId) {
    if (!subjId) {
      topicFilter.disabled = true;
      yearFilter.disabled = true;
      topicFilter.innerHTML = '<option value="">All Topics</option>';
      yearFilter.innerHTML = '<option value="">All Years</option>';
      return;
    }

    topicFilter.disabled = false;
    yearFilter.disabled = false;

    try {
      const raw = await loader.loadSubject(subjId);
      let questions = Array.isArray(raw) ? raw : (raw.questions || []);

      // Extract categories from topics (split by " - ")
      const topics = new Set();
      questions.forEach(q => {
        if (q.topic) {
          const category = q.topic.split(' - ')[0].trim();
          topics.add(category);
        }
      });

      topicFilter.innerHTML = '<option value="">All Topics</option>';
      Array.from(topics).sort().forEach(t => topicFilter.add(new Option(t, t)));

      const years = [...new Set(questions.map(q => q.year).filter(y => y))];
      yearFilter.innerHTML = '<option value="">All Years</option>';
      years.sort((a, b) => b - a).forEach(y => yearFilter.add(new Option(y, y)));
    } catch (e) {
      console.warn('Could not load filters', e);
    }
  }

  function renderSubjects() {
    subjectContainer.innerHTML = '';
    const selectedArray = Array.from(selectedSubjects);

    subjects.forEach(subj => {
      const isEnglishExam = (currentMode === 'exam' && subj.id === 'english');
      const isDisabled = (currentMode === 'exam' && !isEnglishExam && selectedArray.length >= 4 && !selectedSubjects.has(subj.id));

      const card = document.createElement('div');
      card.className = 'subject-card' + (selectedSubjects.has(subj.id) ? ' selected' : '') + (isDisabled ? ' disabled' : '');
      card.innerHTML = `<i class="fas fa-book"></i> ${subj.name} (${subj.cap} Qs)`;

      card.addEventListener('click', () => {
        if (isDisabled) return;
        if (isEnglishExam) return;

        if (selectedSubjects.has(subj.id)) {
          selectedSubjects.delete(subj.id);
        } else {
          if (currentMode === 'exam' && selectedSubjects.size >= 4) {
            alert('Exam mode allows maximum 4 subjects.');
            return;
          }
          selectedSubjects.add(subj.id);
        }

        renderSubjects();
        updateSummary();
        if (currentMode === 'study') {
          updateFilterSubjectDropdown();
        }
      });

      subjectContainer.appendChild(card);
    });
  }

  function updateSummary() {
    const selectedArray = Array.from(selectedSubjects);
    let totalQ = 0;
    selectedArray.forEach(id => {
      const subj = subjects.find(s => s.id === id);
      if (subj) totalQ += subj.cap;
    });

    const names = selectedArray.map(id => subjects.find(s => s.id === id).name).join(', ');
    selectedSubjectsText.textContent = names || 'None';
    questionCountDisplay.textContent = `${totalQ} questions`;
  }

  async function startQuiz() {
    const selected = Array.from(selectedSubjects);
    if (selected.length === 0) return alert('Select at least one subject.');
    if (currentMode === 'exam' && selected.length !== 4) {
      return alert('Exam mode requires exactly 4 subjects (English + 3 others).');
    }

    container.innerHTML = `<div style="text-align:center;padding:40px;"><i class="fas fa-spinner fa-spin"></i> Loading questions...</div>`;

    const timeLimit = parseInt(timeLimitInput.value);
    const shuffle = document.getElementById('shuffle-options').checked;
    const showExplanations = document.getElementById('show-explanations').checked;

    try {
      const questionsBySubject = {};

      for (const subjId of selected) {
        const raw = await loader.loadSubject(subjId);
        const cap = subjects.find(s => s.id === subjId).cap;

        let questions = Array.isArray(raw) ? raw : (raw.questions || []);

        // Apply study mode filters
        if (currentMode === 'study') {
          const filterSubj = filterSubject.value;
          const filterTopic = topicFilter.value;
          const filterYear = yearFilter.value;

          if (filterSubj && filterSubj === subjId) {
            if (filterTopic) {
              questions = questions.filter(q => q.topic && q.topic.startsWith(filterTopic));
            }
            if (filterYear) {
              questions = questions.filter(q => q.year == filterYear);
            }
          }
        }

        // Ensure valid questions
        questions = questions.filter(q => q.options && Array.isArray(q.options));

        // Cap questions
        while (questions.length > cap) {
          const idx = Math.floor(Math.random() * questions.length);
          questions.splice(idx, 1);
        }

        // Shuffle options if requested
        questions = questions.map((q, i) => {
          const opts = [...q.options];
          const correct = opts[q.answer];
          if (shuffle) {
            for (let j = opts.length - 1; j > 0; j--) {
              const k = Math.floor(Math.random() * (j + 1));
              [opts[j], opts[k]] = [opts[k], opts[j]];
            }
          }
          return {
            ...q,
            options: opts,
            answer: opts.indexOf(correct),
            questionNumber: i + 1,
            subject: subjId
          };
        });

        questionsBySubject[subjId] = questions;
      }

      // Create engine and start
      const engine = new SimpleQuizEngine({
        mode: currentMode,
        timeLimit: timeLimit
      });
      engine.questionsBySubject = questionsBySubject;
      engine.currentSubject = Object.keys(questionsBySubject)[0];

      // Store subjects metadata globally for scoring
      window.QuizConfig = window.QuizConfig || {};
      window.QuizConfig.subjects = subjects;
      window.QuizConfig.currentMode = currentMode;
      window.QuizConfig.showExplanations = showExplanations;

      // Start timer and render
      engine.startTimer();

      // Enhance CBT Experience: Enter Distraction-Free Fullscreen Mode
      try {
        const nav = document.querySelector('.quiz-navbar');
        const footer = document.querySelector('footer');
        const header = document.querySelector('.quiz-header');
        const cards = document.querySelectorAll('.config-card');
        const summary = document.querySelector('.summary-bar');
        
        if (nav) nav.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (header) header.style.display = 'none';
        if (summary) summary.style.display = 'none';
        cards.forEach(c => c.style.display = 'none');
        
        window.scrollTo(0, 0);

        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(err => console.log('Fullscreen API: ' + err.message));
        }
      } catch (e) { console.warn('Could not enter fullscreen mode', e); }
      
      // Use renderer (defined in quiz-render.js)
      if (typeof QuizRenderer !== 'undefined') {
        QuizRenderer.render(engine, container, {
          mode: currentMode,
          showExplanations: showExplanations
        });
      } else {
        throw new Error('QuizRenderer module not loaded');
      }

    } catch (e) {
      console.error(e);
      container.innerHTML = `<div style="color:red;padding:20px;"><i class="fas fa-exclamation-triangle"></i> Error: ${e.message}</div>`;
    }
  }

  // Public API
  return {
    init,
    subjects,
    getCurrentMode: () => currentMode,
    getSelectedSubjects: () => Array.from(selectedSubjects)
  };
})();