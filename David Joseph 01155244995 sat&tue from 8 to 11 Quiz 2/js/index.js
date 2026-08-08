/**
 * ============================================
 * MAIN ENTRY POINT (index.js)
 * ============================================
 * Wires up the setup form to the Quiz/Question classes:
 * validation, loading/error states, and starting the game.
 */

import Quiz from "./quiz.js";
import Question from "./question.js";

// ─── DOM References ─────────────────────────────────────────
const quizOptionsForm = document.getElementById("quizOptions");
const playerNameInput = document.getElementById("playerName");
const categoryInput = document.getElementById("categoryMenu");
const difficultyOptions = document.getElementById("difficultyOptions");
const questionsNumber = document.getElementById("questionsNumber");
const startQuizBtn = document.getElementById("startQuiz");
const questionsContainer = document.querySelector(".questions-container");

// ─── State ───────────────────────────────────────────────────
let currentQuiz = null;

// ─── UI State Helpers ────────────────────────────────────────
function showLoading() {
  questionsContainer.innerHTML = `
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading Questions...</p>
    </div>
  `;
}

function hideLoading() {
  const overlay = questionsContainer.querySelector(".loading-overlay");
  if (overlay) overlay.remove();
}

function showError(message) {
  questionsContainer.innerHTML = `
    <div class="game-card error-card">
      <div class="error-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 class="error-title">Oops! Something went wrong</h3>
      <p class="error-message">${message}</p>
      <button class="btn-play retry-btn">
        <i class="fa-solid fa-rotate-right"></i> Try Again
      </button>
    </div>
  `;

  const retryBtn = questionsContainer.querySelector(".retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => resetToStart());
  }
}

// ─── Validation ──────────────────────────────────────────────
function validateForm() {
  const raw = questionsNumber.value.trim();

  if (!raw) {
    return { isValid: false, error: "Please enter the number of questions." };
  }

  const num = parseInt(raw, 10);

  if (isNaN(num) || num < 1) {
    return { isValid: false, error: "Please enter at least 1 question." };
  }

  if (num > 50) {
    return { isValid: false, error: "Maximum 50 questions allowed." };
  }

  return { isValid: true, error: null };
}

function showFormError(message) {
  const existing = quizOptionsForm.querySelector(".form-error");
  if (existing) existing.remove();

  const errorDiv = document.createElement("div");
  errorDiv.className = "form-error";
  errorDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;

  startQuizBtn.insertAdjacentElement("beforebegin", errorDiv);

  setTimeout(() => {
    errorDiv.style.transition = "opacity 0.5s ease";
    errorDiv.style.opacity = "0";
    setTimeout(() => errorDiv.remove(), 500);
  }, 3000);
}

// ─── Reset ───────────────────────────────────────────────────
function resetToStart() {
  questionsContainer.innerHTML = "";
  quizOptionsForm.reset();
  quizOptionsForm.classList.remove("hidden");
  currentQuiz = null;
}

// ─── Start Game ──────────────────────────────────────────────
async function startQuiz() {
  const { isValid, error } = validateForm();
  if (!isValid) {
    showFormError(error);
    return;
  }

  const playerName = playerNameInput.value.trim() || "Player";
  const category = categoryInput.value;
  const difficulty = difficultyOptions.value;
  const numberOfQuestions = parseInt(questionsNumber.value, 10);

  currentQuiz = new Quiz(category, difficulty, numberOfQuestions, playerName);

  quizOptionsForm.classList.add("hidden");
  showLoading();

  try {
    const questions = await currentQuiz.getQuestions();
    hideLoading();

    if (!questions || questions.length === 0) {
      showError("No questions were found for these settings. Try different options.");
      return;
    }

    const firstQuestion = new Question(currentQuiz, questionsContainer, resetToStart);
    firstQuestion.displayQuestion();
  } catch (err) {
    hideLoading();
    showError(err.message || "Failed to load questions. Please try again.");
  }
}

// ─── Event Listeners ─────────────────────────────────────────
startQuizBtn.addEventListener("click", startQuiz);

questionsNumber.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    startQuiz();
  }
});
