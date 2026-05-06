/**
 * OAE Quiz Engine
 * Core logic: timer, state, scoring, question handling.
 */

class SimpleQuizEngine {
  constructor(config) {
    this.config = {
      mode: config.mode || 'exam',
      timeLimit: config.timeLimit || 105,
      ...config
    };
    
    this.questionsBySubject = {};
    this.currentSubject = null;
    this.currentIndex = 0;
    this.userAnswers = new Map();
    this.flaggedQuestions = new Set();
    this.remainingSeconds = this.config.timeLimit * 60;
    this.completed = false;
    this.timerInterval = null;
    this.timerEndTime = null;
    this.onTimerTick = null;
  }

  startTimer() {
    if (this.completed) return;
    
    // Set end time based on absolute system clock to prevent throttling drift
    if (!this.timerEndTime) {
      this.timerEndTime = Date.now() + (this.remainingSeconds * 1000);
    }
    
    this.timerInterval = setInterval(() => {
      if (this.completed) return;
      
      const now = Date.now();
      this.remainingSeconds = Math.max(0, Math.floor((this.timerEndTime - now) / 1000));
      
      if (this.onTimerTick) {
        this.onTimerTick(this.remainingSeconds, this.formatTime(this.remainingSeconds));
      }
      
      // Save state roughly every 5 seconds
      if (this.remainingSeconds % 5 === 0) {
        this.saveState();
      }

      if (this.remainingSeconds <= 0) {
        this.remainingSeconds = 0;
        this.finishQuiz();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      // Also update end time when stopped so it can be resumed correctly
      this.timerEndTime = null; 
    }
  }

  formatTime(sec) {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getCurrentQuestion() {
    if (!this.currentSubject) return null;
    const qs = this.questionsBySubject[this.currentSubject];
    return qs ? qs[this.currentIndex] : null;
  }

  getSubjects() {
    return Object.keys(this.questionsBySubject);
  }

  switchSubject(subj) {
    if (this.questionsBySubject[subj]) {
      this.currentSubject = subj;
      this.currentIndex = 0;
      return true;
    }
    return false;
  }

  getSubjectQuestionCount(subjectId) {
    return this.questionsBySubject[subjectId]?.length || 0;
  }

  goToQuestion(index) {
    const qs = this.questionsBySubject[this.currentSubject];
    if (qs && index >= 0 && index < qs.length) {
      this.currentIndex = index;
      return true;
    }
    return false;
  }

  nextQuestion() {
    const qs = this.questionsBySubject[this.currentSubject];
    if (qs && this.currentIndex < qs.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  previousQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }

  saveAnswer(questionId, selectedIndex) {
    this.userAnswers.set(questionId, selectedIndex);
    this.saveState();
  }

  clearAnswer(questionId) {
    this.userAnswers.delete(questionId);
    this.saveState();
  }

  toggleFlag(questionId) {
    if (this.flaggedQuestions.has(questionId)) {
      this.flaggedQuestions.delete(questionId);
    } else {
      this.flaggedQuestions.add(questionId);
    }
    this.saveState();
  }

  isFlagged(questionId) {
    return this.flaggedQuestions.has(questionId);
  }

  getAnswer(questionId) {
    return this.userAnswers.get(questionId);
  }

  isAnswered(questionId) {
    return this.userAnswers.has(questionId);
  }

  getAnsweredCount(subjectId) {
    if (subjectId) {
      const qs = this.questionsBySubject[subjectId] || [];
      return qs.filter(q => this.userAnswers.has(q.id)).length;
    }
    return this.userAnswers.size;
  }

  getUnansweredCount(subjectId) {
    const total = this.getSubjectQuestionCount(subjectId);
    const answered = this.getAnsweredCount(subjectId);
    return total - answered;
  }

  calculateResults() {
    const subjectScores = {};
    let totalCorrect = 0;
    let totalQuestions = 0;

    Object.entries(this.questionsBySubject).forEach(([subj, qs]) => {
      const subjInfo = window.QuizConfig?.subjects?.find(s => s.id === subj) || { marks: 100, cap: qs.length };
      const marksPerQuestion = subjInfo.marks / subjInfo.cap;
      let correct = 0;

      qs.forEach(q => {
        totalQuestions++;
        if (this.userAnswers.get(q.id) === q.answer) {
          correct++;
          totalCorrect++;
        }
      });

      subjectScores[subj] = {
        name: subjInfo.name || subj,
        correct,
        total: qs.length,
        marks: Math.round(correct * marksPerQuestion * 10) / 10,
        totalMarks: subjInfo.marks
      };
    });

    const totalMarks = Object.values(subjectScores).reduce((sum, s) => sum + s.marks, 0);
    const maxMarks = Object.values(subjectScores).reduce((sum, s) => sum + s.totalMarks, 0);

    return {
      totalCorrect,
      totalQuestions,
      totalMarks: Math.round(totalMarks * 10) / 10,
      maxMarks,
      percentage: totalQuestions ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : '0.0',
      subjectScores
    };
  }

  finishQuiz() {
    if (this.completed) return null;
    this.completed = true;
    this.stopTimer();
    this.clearState();
    return this.calculateResults();
  }

  // --- Persistence Methods ---
  saveState() {
    if (this.completed) return;
    try {
      const state = {
        config: this.config,
        questionsBySubject: this.questionsBySubject,
        currentSubject: this.currentSubject,
        currentIndex: this.currentIndex,
        remainingSeconds: this.remainingSeconds,
        userAnswers: Array.from(this.userAnswers.entries()),
        flaggedQuestions: Array.from(this.flaggedQuestions)
      };
      localStorage.setItem('oae_quiz_state', JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }

  clearState() {
    try {
      localStorage.removeItem('oae_quiz_state');
    } catch (e) {}
  }

  static loadState() {
    try {
      const saved = localStorage.getItem('oae_quiz_state');
      if (!saved) return null;
      
      const parsed = JSON.parse(saved);
      const engine = new SimpleQuizEngine(parsed.config);
      engine.questionsBySubject = parsed.questionsBySubject;
      engine.currentSubject = parsed.currentSubject;
      engine.currentIndex = parsed.currentIndex;
      engine.remainingSeconds = parsed.remainingSeconds;
      engine.userAnswers = new Map(parsed.userAnswers);
      engine.flaggedQuestions = new Set(parsed.flaggedQuestions || []);
      
      return engine;
    } catch (e) {
      console.warn('Could not load saved state', e);
      return null;
    }
  }
}

// Export for use in other modules
window.SimpleQuizEngine = SimpleQuizEngine;