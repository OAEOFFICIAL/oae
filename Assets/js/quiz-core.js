/**
 * OAE Quiz Core Engine
 * Supports subject grouping and passage handling.
 */
class QuizEngine {
  constructor(config) {
    this.config = {
      mode: config.mode || 'exam',
      subjects: config.subjects || [],
      timeLimit: config.timeLimit || 105,
      shuffleOptions: config.shuffleOptions !== false,
      allowHints: config.allowHints || false,
      examType: config.examType || 'JAMB'
    };

    this.questionsBySubject = {}; // subjectId -> array of questions
    this.currentSubject = null;
    this.currentIndex = 0;
    this.userAnswers = new Map();
    this.visitedQuestions = new Set();
    this.startTime = null;
    this.remainingSeconds = this.config.timeLimit * 60;
    this.timerInterval = null;
    this.completed = false;

    this.onTimerTick = null;
    this.onTimerEnd = null;
    this.onQuestionChange = null;
    this.onQuizComplete = null;
  }

  initialize(questionsBySubject) {
    this.questionsBySubject = questionsBySubject;
    // Set first subject as current
    const firstSubject = Object.keys(questionsBySubject)[0];
    this.currentSubject = firstSubject;
    this.currentIndex = 0;
    this.userAnswers.clear();
    this.visitedQuestions.clear();
    this.completed = false;
    this.remainingSeconds = this.config.timeLimit * 60;
  }

  prepareQuestions(questions) {
    return questions.map((q, idx) => {
      const originalOptions = [...q.options];
      let shuffledOptions = [...originalOptions];
      let correctAnswerIndex = q.answer;

      if (this.config.shuffleOptions) {
        const indexed = originalOptions.map((opt, i) => ({ opt, originalIndex: i }));
        for (let i = indexed.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
        }
        shuffledOptions = indexed.map(item => item.opt);
        correctAnswerIndex = indexed.findIndex(item => item.originalIndex === q.answer);
      }

      return {
        ...q,
        options: shuffledOptions,
        answer: correctAnswerIndex,
        originalAnswer: q.answer,
        questionNumber: idx + 1
      };
    });
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      if (this.completed) return;
      this.remainingSeconds--;
      if (this.onTimerTick) {
        this.onTimerTick(this.remainingSeconds, this.formatTime(this.remainingSeconds));
      }
      if (this.remainingSeconds <= 0) {
        this.remainingSeconds = 0;
        this.finishQuiz();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` 
                 : `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }

  getCurrentQuestion() {
    if (!this.currentSubject) return null;
    const qs = this.questionsBySubject[this.currentSubject];
    return qs ? qs[this.currentIndex] : null;
  }

  getSubjects() {
    return Object.keys(this.questionsBySubject);
  }

  switchSubject(subjectId) {
    if (this.questionsBySubject[subjectId]) {
      this.currentSubject = subjectId;
      this.currentIndex = 0;
      if (this.onQuestionChange) {
        this.onQuestionChange(this.getCurrentQuestion(), 0, this.getSubjectQuestionCount(subjectId), subjectId);
      }
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
      this.visitedQuestions.add(`${this.currentSubject}-${index}`);
      if (this.onQuestionChange) {
        this.onQuestionChange(qs[index], index, qs.length, this.currentSubject);
      }
      return true;
    }
    return false;
  }

  nextQuestion() {
    const qs = this.questionsBySubject[this.currentSubject];
    if (qs && this.currentIndex < qs.length - 1) {
      return this.goToQuestion(this.currentIndex + 1);
    }
    return false;
  }

  previousQuestion() {
    if (this.currentIndex > 0) {
      return this.goToQuestion(this.currentIndex - 1);
    }
    return false;
  }

  saveAnswer(questionId, selectedIndex) {
    this.userAnswers.set(questionId, selectedIndex);
  }

  getAnswer(questionId) {
    return this.userAnswers.get(questionId);
  }

  isCurrentQuestionAnswered() {
    const q = this.getCurrentQuestion();
    return q ? this.userAnswers.has(q.id) : false;
  }

  calculateResults() {
    const subjectStats = {};
    let totalCorrect = 0, totalQuestions = 0, obtainedMarks = 0, totalMarks = 0;

    for (const [subj, qs] of Object.entries(this.questionsBySubject)) {
      subjectStats[subj] = { total: 0, correct: 0, marksObtained: 0, marksTotal: 0 };
      qs.forEach(q => {
        subjectStats[subj].total++;
        subjectStats[subj].marksTotal += q.marks || 1;
        totalMarks += q.marks || 1;
        totalQuestions++;
        const selected = this.userAnswers.get(q.id);
        if (selected === q.answer) {
          subjectStats[subj].correct++;
          subjectStats[subj].marksObtained += q.marks || 1;
          totalCorrect++;
          obtainedMarks += q.marks || 1;
        }
      });
      subjectStats[subj].percentage = subjectStats[subj].total > 0 
        ? (subjectStats[subj].correct / subjectStats[subj].total) * 100 : 0;
    }

    return {
      mode: this.config.mode,
      totalQuestions,
      totalCorrect,
      totalPercentage: totalQuestions ? (totalCorrect/totalQuestions*100).toFixed(1) : 0,
      totalMarks,
      obtainedMarks,
      timeTaken: this.startTime ? Math.floor((Date.now() - this.startTime)/1000) : 0,
      subjectStats,
      questionsBySubject: this.questionsBySubject,
      userAnswers: Object.fromEntries(this.userAnswers)
    };
  }

  finishQuiz() {
    if (this.completed) return;
    this.completed = true;
    this.stopTimer();
    const results = this.calculateResults();
    if (this.onQuizComplete) this.onQuizComplete(results);
    return results;
  }

  getAnsweredCount(subjectId = null) {
    if (subjectId) {
      const qs = this.questionsBySubject[subjectId] || [];
      return qs.filter(q => this.userAnswers.has(q.id)).length;
    }
    return this.userAnswers.size;
  }
}

window.QuizEngine = QuizEngine;