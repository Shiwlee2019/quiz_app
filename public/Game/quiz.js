
const questionText = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-container"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const timerDisplay = document.querySelector(".time-duration");
const progressBoxes = document.getElementById("progress-boxes");
const emojiBox = document.getElementById("emojiFeedback");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const clickSound = document.getElementById("clickSound");

let questions = [];
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timer = null;
let timeLeft = 15;

const QUESTION_BONUS = 10;


const queryParams = new URLSearchParams(window.location.search);
let MAX_QUESTIONS = parseInt(queryParams.get("questions")) || 10;

let reviewLog = [];

function playSound(audioElement) {
  if (!audioElement) return;
  try {
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.log("Audio play failed:", e));
  } catch (e) {
    console.error("Audio error:", e);
  }
}

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

const user = localStorage.getItem("quizAppUserName");
if (!user) {
  alert("Please sign in to play the quiz.");
  window.location.href = "../sigin/signin.html";
}


function loadLocalQuestions() {
  fetch('../questions.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load questions.json');
      return res.json();
    })
    .then(data => {
      questions = data.slice(0, 30).map(q => ({
        question: q.question,
        answer: q.answer.charCodeAt(0) - 64,
        choice1: q.A,
        choice2: q.B,
        choice3: q.C,
        choice4: q.D
      }));
      startGame();
    })
    .catch(() => alert('Failed to load questions.'));
}


fetch(`/api/questions?count=${MAX_QUESTIONS}`)
  .then(res => {
    if (!res.ok) throw new Error('API response not OK');
    return res.json();
  })
  .then(data => {
    questions = data.map(q => {
      const allChoices = [q.correct_answer, ...q.incorrect_answers];
      const shuffled = allChoices.sort(() => Math.random() - 0.5);
      const correctIndex = shuffled.indexOf(q.correct_answer) + 1;
      return {
        question: q.question,
        answer: correctIndex,
        choice1: shuffled[0],
        choice2: shuffled[1],
        choice3: shuffled[2],
        choice4: shuffled[3]
      };
    });
    startGame();
  })
  .catch(() => loadLocalQuestions());

function startGame() {
  questionCounter = 0;
  score = 0;
  reviewLog = [];
  availableQuestions = [...questions];
  scoreText.innerText = score;
  renderProgressBoxes();
  getNewQuestion();
}

function renderProgressBoxes() {
  progressBoxes.innerHTML = "";
  for (let i = 0; i < MAX_QUESTIONS; i++) {
    const box = document.createElement("div");
    box.className = "progress-box";
    box.innerText = i + 1;
    progressBoxes.appendChild(box);
  }
}

function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    saveResults();
    return;
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const qIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[qIndex];
  questionText.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.querySelector(".choice-text").dataset["number"];
    choice.querySelector(".choice-text").innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(qIndex, 1);
  acceptingAnswers = true;
  resetTimer();
  startTimer();
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  if (timerDisplay) timerDisplay.textContent = `${timeLeft}s`;
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    if (timerDisplay) timerDisplay.textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      acceptingAnswers = false;
      playSound(wrongSound);
      showEmoji("😢");
      if (progressBoxes && questionCounter > 0) {
        progressBoxes.children[questionCounter - 1].classList.add("incorrect");
      }
      setTimeout(getNewQuestion, 1000);
    }
  }, 1000);
}

function saveResults() {
  const name = localStorage.getItem("quizAppUserName") || "Anonymous";
  const history = JSON.parse(localStorage.getItem("quizHistory") || "[]");

  const percentage = MAX_QUESTIONS > 0
    ? Math.round((score / (MAX_QUESTIONS * QUESTION_BONUS)) * 100)
    : 0;

  history.push({
    date: new Date().toISOString(),
    score: score,
    total: MAX_QUESTIONS,
    percentage: percentage
  });

  localStorage.setItem("quizHistory", JSON.stringify(history));
  localStorage.setItem("quizReview", JSON.stringify(reviewLog));

  fetch('/submit-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, score })
  }).finally(() => {
    window.location.href = `../Results/results.html?score=${score}&total=${MAX_QUESTIONS}`;
  });
}

choices.forEach(choice => {
  choice.addEventListener("click", () => {
    if (!acceptingAnswers) return;

    playSound(clickSound);
    acceptingAnswers = false;
    clearInterval(timer);

    const selectedChoice = choice;
    const selectedAnswer = selectedChoice.querySelector(".choice-text").dataset["number"];
    const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    reviewLog.push({
      question: currentQuestion,
      chosen: parseInt(selectedAnswer),
      correct: currentQuestion.answer,
      explanation: currentQuestion.explanation || null
    });

    selectedChoice.classList.add(classToApply);

    if (classToApply === "correct") {
      incrementScore(QUESTION_BONUS);
      playSound(correctSound);
      showEmoji("😊");
    } else {
      playSound(wrongSound);
      showEmoji("😢");
    }

    if (progressBoxes && questionCounter > 0) {
      progressBoxes.children[questionCounter - 1].classList.add(classToApply);
    }

    setTimeout(() => {
      selectedChoice.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

function incrementScore(num) {
  score += num;
  if (scoreText) scoreText.innerText = score;
}

function toggleMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

function showEmoji(symbol) {
  if (!emojiBox) return;
  emojiBox.textContent = symbol;
  emojiBox.style.opacity = 1;
  setTimeout(() => {
    emojiBox.style.opacity = 0;
  }, 800);
}