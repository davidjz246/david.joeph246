/**
 * ============================================
 * QUIZ CLASS
 * ============================================
 * Manages the entire quiz game state: fetching questions,
 * tracking score/progress, and producing the results screen.
 */

export default class Quiz {
  constructor(category, difficulty, numberOfQuestions, playerName) {
    this.category = category || "";
    this.difficulty = difficulty || "easy";
    this.numberOfQuestions = numberOfQuestions;
    this.playerName = playerName || "Player";

    this.score = 0;
    this.questions = [];
    this.currentQuestionIndex = 0;
  }

  // Build the OpenTDB API request URL from current settings
  buildApiUrl() {
    const params = new URLSearchParams();
    params.set("amount", this.numberOfQuestions);
    params.set("type", "multiple");
    if (this.category) params.set("category", this.category);
    if (this.difficulty) params.set("difficulty", this.difficulty);
    return `https://opentdb.com/api.php?${params.toString()}`;
  }

  async getQuestions() {
    const url = this.buildApiUrl();
    let response;

    try {
      response = await fetch(url);
    } catch (err) {
      throw new Error("Couldn't reach the trivia server. Check your connection and try again.");
    }

    if (!response.ok) {
      throw new Error("Failed to load questions. Please try again.");
    }

    const data = await response.json();

    if (data.response_code !== 0) {
      throw new Error(this._responseCodeMessage(data.response_code));
    }

    this.questions = data.results;
    return this.questions;
  }

  _responseCodeMessage(code) {
    switch (code) {
      case 1:
        return "Not enough questions available for this category/difficulty. Try different settings.";
      case 2:
        return "Invalid request parameters.";
      case 3:
        return "Session token not found.";
      case 4:
        return "Session token has returned all possible questions.";
      case 5:
        return "Too many requests — please wait a few seconds and try again.";
      default:
        return "Could not load questions. Please try again.";
    }
  }

  incrementScore() {
    this.score += 1;
  }

  getCurrentQuestion() {
    if (this.currentQuestionIndex < 0 || this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  nextQuestion() {
    this.currentQuestionIndex += 1;
    return !this.isComplete();
  }

  isComplete() {
    return this.currentQuestionIndex >= this.questions.length;
  }

  getScorePercentage() {
    if (!this.numberOfQuestions) return 0;
    return Math.round((this.score / this.numberOfQuestions) * 100);
  }

  saveHighScore() {
    const scores = this.getHighScores();

    scores.push({
      name: this.playerName,
      score: this.score,
      total: this.numberOfQuestions,
      percentage: this.getScorePercentage(),
      difficulty: this.difficulty || "mixed",
      date: new Date().toISOString(),
    });

    scores.sort((a, b) => b.percentage - a.percentage);
    const top10 = scores.slice(0, 10);

    localStorage.setItem("quizHighScores", JSON.stringify(top10));
    return top10;
  }

  getHighScores() {
    try {
      const raw = localStorage.getItem("quizHighScores");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  isHighScore() {
    const scores = this.getHighScores();
    if (scores.length < 10) return true;
    const lowest = scores[scores.length - 1];
    return this.getScorePercentage() > lowest.percentage;
  }

  endQuiz() {
    const percentage = this.getScorePercentage();
    const qualifies = this.isHighScore();

    const scores = qualifies ? this.saveHighScore() : this.getHighScores();
    const medalClasses = ["gold", "silver", "bronze"];

    const leaderboardItems = scores
      .map(
        (s, i) => `
        <li class="leaderboard-item ${medalClasses[i] || ""}">
          <span class="leaderboard-rank">#${i + 1}</span>
          <span class="leaderboard-name">${this._escape(s.name)}</span>
          <span class="leaderboard-score">${s.percentage}%</span>
        </li>`
      )
      .join("");

    return `
      <div class="game-card results-card">
        <h2 class="results-title">Quiz Complete!</h2>
        <p class="results-score-display">${this.score}/${this.numberOfQuestions}</p>
        <p class="results-percentage">${percentage}% Accuracy</p>

        ${
          qualifies
            ? `<div class="new-record-badge">
                <i class="fa-solid fa-star"></i> New High Score!
              </div>`
            : ""
        }

        <div class="leaderboard">
          <h4 class="leaderboard-title">
            <i class="fa-solid fa-trophy"></i> Leaderboard
          </h4>
          <ul class="leaderboard-list">
            ${leaderboardItems || '<li class="leaderboard-item">No scores yet</li>'}
          </ul>
        </div>

        <div class="action-buttons">
          <button class="btn-restart">
            <i class="fa-solid fa-rotate-right"></i> Play Again
          </button>
        </div>
      </div>
    `;
  }

  _escape(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
}
