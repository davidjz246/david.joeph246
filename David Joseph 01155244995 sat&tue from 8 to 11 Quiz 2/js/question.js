/**
 * ============================================
 * QUESTION CLASS
 * ============================================
 * Handles displaying and interacting with a single question:
 * rendering the card, the countdown timer, answer checking,
 * and transitioning to the next question or the results screen.
 */

export default class Question {
  constructor(quiz, container, onQuizEnd) {
    this.quiz = quiz;
    this.container = container;
    this.onQuizEnd = onQuizEnd;

    this.questionData = quiz.getCurrentQuestion();
    this.index = quiz.currentQuestionIndex;

    this.question = this.decodeHtml(this.questionData.question);
    this.correctAnswer = this.decodeHtml(this.questionData.correct_answer);
    this.category = this.decodeHtml(this.questionData.category);
    this.wrongAnswers = this.questionData.incorrect_answers.map((a) => this.decodeHtml(a));

    this.allAnswers = this.shuffleAnswers();

    this.answered = false;
    this.timerInterval = null;
    this.timeRemaining = 30;

    // Bound reference so we can add/remove the same listener instance
    this._keyHandler = this._handleKeydown.bind(this);
  }

  decodeHtml(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.documentElement.textContent;
  }

  shuffleAnswers() {
    const arr = [...this.wrongAnswers, this.correctAnswer];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  getProgress() {
    return Math.round(((this.index + 1) / this.quiz.numberOfQuestions) * 100);
  }

  displayQuestion() {
    const difficulty = this.quiz.difficulty || "easy";
    const difficultyIcon =
      { easy: "fa-face-smile", medium: "fa-face-meh", hard: "fa-skull" }[difficulty] ||
      "fa-face-smile";

    const answersHtml = this.allAnswers
      .map(
        (answer, i) => `
        <button class="answer-btn" data-answer="${this._escapeAttr(answer)}">
          <span class="answer-key">${i + 1}</span>
          <span class="answer-text">${this._escapeHtml(answer)}</span>
        </button>`
      )
      .join("");

    this.container.innerHTML = `
      <div class="game-card question-card">
        <div class="xp-bar-container">
          <div class="xp-bar-header">
            <span class="xp-label"><i class="fa-solid fa-bolt"></i> Progress</span>
            <span class="xp-value">Question ${this.index + 1}/${this.quiz.numberOfQuestions}</span>
          </div>
          <div class="xp-bar">
            <div class="xp-bar-fill" style="width: ${this.getProgress()}%"></div>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-badge category">
            <i class="fa-solid fa-bookmark"></i>
            <span>${this._escapeHtml(this.category)}</span>
          </div>
          <div class="stat-badge difficulty ${difficulty}">
            <i class="fa-solid ${difficultyIcon}"></i>
            <span>${difficulty}</span>
          </div>
          <div class="stat-badge timer">
            <i class="fa-solid fa-stopwatch"></i>
            <span class="timer-value">${this.timeRemaining}</span>s
          </div>
          <div class="stat-badge counter">
            <i class="fa-solid fa-gamepad"></i>
            <span>${this.index + 1}/${this.quiz.numberOfQuestions}</span>
          </div>
        </div>

        <h2 class="question-text">${this._escapeHtml(this.question)}</h2>

        <div class="answers-grid">
          ${answersHtml}
        </div>

        <p class="keyboard-hint">
          <i class="fa-regular fa-keyboard"></i> Press 1-${this.allAnswers.length} to select
        </p>

        <div class="score-panel">
          <div class="score-item">
            <div class="score-item-label">Score</div>
            <div class="score-item-value">${this.quiz.score}</div>
          </div>
        </div>
      </div>
    `;

    this.addEventListeners();
    this.startTimer();
  }

  addEventListeners() {
    const buttons = this.container.querySelectorAll(".answer-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => this.checkAnswer(btn));
    });
    document.addEventListener("keydown", this._keyHandler);
  }

  removeEventListeners() {
    document.removeEventListener("keydown", this._keyHandler);
  }

  _handleKeydown(e) {
    const validKeys = ["1", "2", "3", "4"];
    if (!validKeys.includes(e.key)) return;

    const idx = parseInt(e.key, 10) - 1;
    const buttons = this.container.querySelectorAll(".answer-btn");
    if (buttons[idx]) this.checkAnswer(buttons[idx]);
  }

  startTimer() {
    const timerValueEl = this.container.querySelector(".timer-value");
    const timerBadge = this.container.querySelector(".stat-badge.timer");

    this.timerInterval = setInterval(() => {
      this.timeRemaining -= 1;
      if (timerValueEl) timerValueEl.textContent = this.timeRemaining;

      if (this.timeRemaining <= 10 && timerBadge) {
        timerBadge.classList.add("warning");
      }

      if (this.timeRemaining <= 0) {
        this.stopTimer();
        this.handleTimeUp();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  handleTimeUp() {
    if (this.answered) return;
    this.answered = true;
    this.removeEventListeners();
    this.highlightCorrectAnswer();

    this.container.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.classList.add("disabled");
    });

    const questionCard = this.container.querySelector(".question-card");
    if (questionCard) {
      const timeUpEl = document.createElement("div");
      timeUpEl.className = "time-up-message";
      timeUpEl.innerHTML = `<i class="fa-solid fa-clock"></i> TIME'S UP!`;
      questionCard.appendChild(timeUpEl);
    }

    this.animateQuestion(500);
  }

  checkAnswer(choiceElement) {
    if (this.answered) return;
    this.answered = true;
    this.stopTimer();

    const selected = choiceElement.dataset.answer;
    const isCorrect = selected.toLowerCase() === this.correctAnswer.toLowerCase();

    if (isCorrect) {
      choiceElement.classList.add("correct");
      this.quiz.incrementScore();
    } else {
      choiceElement.classList.add("wrong");
      this.highlightCorrectAnswer();
    }

    this.container.querySelectorAll(".answer-btn").forEach((btn) => {
      if (btn !== choiceElement) btn.classList.add("disabled");
    });

    this.removeEventListeners();
    this.animateQuestion(500);
  }

  highlightCorrectAnswer() {
    const buttons = this.container.querySelectorAll(".answer-btn");
    buttons.forEach((btn) => {
      if (btn.dataset.answer.toLowerCase() === this.correctAnswer.toLowerCase()) {
        btn.classList.add("correct-reveal");
      }
    });
  }

  getNextQuestion() {
    const hasMore = this.quiz.nextQuestion();

    if (hasMore) {
      const nextQuestion = new Question(this.quiz, this.container, this.onQuizEnd);
      nextQuestion.displayQuestion();
    } else {
      this.container.innerHTML = this.quiz.endQuiz();
      const restartBtn = this.container.querySelector(".btn-restart");
      if (restartBtn && this.onQuizEnd) {
        restartBtn.addEventListener("click", () => this.onQuizEnd());
      }
    }
  }

  animateQuestion(duration = 500) {
    // Brief pause so the player can see the correct/wrong highlight,
    // then play an exit transition before loading the next question.
    setTimeout(() => {
      const card = this.container.querySelector(".question-card");
      if (card) card.classList.add("exit");

      setTimeout(() => {
        this.getNextQuestion();
      }, duration);
    }, 1500);
  }

  _escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  _escapeAttr(str) {
    return str.replace(/"/g, "&quot;");
  }
}
