/**
 * OAE Quiz Main
 * Initializes quiz from the configuration form and orchestrates the flow.
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Override the global startFromForm function (called by the "Start Quiz" button)
  window.startFromForm = async function() {
    // Get form values
    const examType = document.querySelector('input[name="examType"]:checked')?.value || 'JAMB';
    const quizType = document.querySelector('input[name="quizType"]:checked')?.value || 'exam';
    const mode = document.querySelector('input[name="mode"]:checked')?.value || 'exam';
    const customMinutes = parseInt(document.getElementById('study-minutes')?.value || '30', 10);
    
    // Get selected subjects
    const selectedSubjectCheckboxes = Array.from(document.querySelectorAll('.subject-checkbox:checked'));
    const selectedSubjects = selectedSubjectCheckboxes.map(cb => cb.value);
    
    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject.');
      return;
    }
    
    // Get selected topics per subject
    const topicFilters = {};
    selectedSubjects.forEach(subject => {
      const topicChecks = Array.from(document.querySelectorAll(`.topic-checkbox[data-subject="${subject}"] input:checked`));
      if (topicChecks.length > 0) {
        topicFilters[subject] = topicChecks.map(input => input.value);
      }
    });
    
    // Determine time limit based on mode
    let timeLimit;
    if (mode === 'exam') {
      timeLimit = 105; // 1 hour 45 minutes
    } else {
      timeLimit = customMinutes || 30;
    }
    
    // Allow hints/explanations only in non-exam modes
    const allowHints = mode !== 'exam';
    
    // Show loading
    const container = document.getElementById('quiz-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="margin-bottom: 20px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: var(--green);"></i>
          </div>
          <h3 style="color: var(--oae-dark); margin-bottom: 8px;">Loading Questions...</h3>
          <p class="small" style="color: var(--muted);">Preparing your personalized quiz from ${selectedSubjects.length} subject(s).</p>
        </div>
      `;
    }
    
    try {
      // Initialize data loader
      const loader = new QuizDataLoader();
      
      // Build question set with filters
      const filters = {
        examType: examType,
        topics: topicFilters // This is subject-specific; loader will handle per subject
      };
      
      // Custom per-subject filtering
      let allQuestions = [];
      
      for (const subjectId of selectedSubjects) {
        const questions = await loader.loadSubject(subjectId);
        const subjectFilters = { examType: examType };
        
        // Apply topic filters for this subject
        if (topicFilters[subjectId] && topicFilters[subjectId].length > 0) {
          subjectFilters.topics = topicFilters[subjectId];
        }
        
        let filtered = loader.filterQuestions(questions, subjectFilters);
        
        // Determine question count cap
        const subjectConfig = loader.subjects.find(s => s.id === subjectId);
        let questionCap = subjectConfig?.questionCap || 40;
        if (subjectId === 'english') questionCap = 60;
        
        // For study/quiz modes, allow custom caps? For now stick to caps.
        const selected = loader.selectRandomQuestions(filtered, questionCap);
        allQuestions.push(...selected);
      }
      
      if (allQuestions.length === 0) {
        throw new Error('No questions found matching your criteria.');
      }
      
      // Shuffle final set
      allQuestions = loader.shuffleArray(allQuestions);
      
      // Initialize engine
      const engine = new QuizEngine({
        mode: mode,
        subjects: selectedSubjects,
        timeLimit: timeLimit,
        allowHints: allowHints,
        examType: examType
      });
      
      engine.initialize(allQuestions);
      
      // Initialize renderer
      const renderer = new QuizRenderer(engine, 'quiz-container');
      
      // Set up callback for quiz completion
      engine.onQuizComplete = (results) => {
        renderer.renderResults(results);
      };
      
      // Start timer and render
      engine.startTimer();
      renderer.renderQuiz();
      
    } catch (error) {
      console.error('Quiz initialization error:', error);
      const container = document.getElementById('quiz-container');
      if (container) {
        container.innerHTML = `
          <div style="text-align: center; padding: 60px 20px;">
            <div style="margin-bottom: 20px;">
              <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #e74c3c;"></i>
            </div>
            <h3 style="color: var(--oae-dark); margin-bottom: 8px;">Oops! Something went wrong</h3>
            <p class="small" style="color: var(--muted); margin-bottom: 24px;">${error.message}</p>
            <button class="btn" onclick="location.reload()">
              <i class="fas fa-redo-alt"></i> Try Again
            </button>
          </div>
        `;
      }
    }
  };
  
  // Attach event listeners to update selection summary when form changes
  const formInputs = document.querySelectorAll('input[name="mode"], .subject-checkbox, .topic-checkbox input');
  formInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (typeof updateSelectionSummary === 'function') {
        updateSelectionSummary();
      }
    });
  });
  
  console.log('OAE Quiz Main initialized. Ready to start!');
});