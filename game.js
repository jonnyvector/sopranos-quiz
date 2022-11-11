const game = document.getElementById("game");
const question = document.getElementById("question");
const questionCounterText = document.getElementById("questionCounterText");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const loader = document.getElementById("loader");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
const MAX_QUESTIONS = 10;
const BONUS = 10;

let correctAudio = [
  new Audio("Audio/Tony-Capable.wav"),
  new Audio("Audio/Silvio-Gabagool.wav"),
];

let incorrectAudio = [
  new Audio("Audio/Paulie-Pleased.wav"),
  new Audio("Audio/Paulie-Classic.wav"),
  new Audio("Audio/Tony-Wackadoo.wav"),
  new Audio("Audio/Tony-Heated.wav"),
  new Audio("Audio/Tony-Calm.wav"),
];

// let questions = [];

fetch("questions.json")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    console.log(loadedQuestions);
    questions = loadedQuestions;
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

startGame = () => {
  questionCounter = 0;
  availableQuestions = [...questions];
  // console.log(availableQuestions);
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("/end.html");
  }
  questionCounter++;
  questionCounterText.innerText = `Question  ${questionCounter} / ${MAX_QUESTIONS}`;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);

  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;
    const incorrectAudioIndex = Math.floor(
      Math.random() * incorrectAudio.length
    );
    const correctAudioIndex = Math.floor(Math.random() * correctAudio.length);

    let selectedChoice = e.target;
    let selectedAnswer = e.target.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(BONUS);
      correctAudio[correctAudioIndex].play();
    } else {
      incorrectAudio[incorrectAudioIndex].play();
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

startGame();
