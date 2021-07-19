// Pick random number (in default, only pick 0 or 1) #helper
function randomNumber(min=0,max=1) {
  if (min >= max) throw "Inavlid min value"; max -= min;
  return Math.round(Math.random() * max) + min;
}

// Create random basic(+,-) question #script
function randomBasicQuestion(min=1,max=100) {
  let firstNumber = randomNumber(min, max),
      secondNumber = randomNumber(min, max),
      operation = ["+", "-"][randomNumber()];
  return {
    question: `${firstNumber} ${operation} ${secondNumber}`,
    answer: operation == "+" ? firstNumber + secondNumber : 
    firstNumber - secondNumber
  };
}

// Create random complex(x,÷) question #script
function randomComplexQuestion(min=3,max=12) {
  let firstNumber = randomNumber(min, max),
      secondNumber = randomNumber(min, max),
      operation = ["x","÷"][randomNumber()]
  if(operation === "÷") return {
    question: `${firstNumber * secondNumber} ÷ ${firstNumber}`,
    answer: secondNumber
  }
  return {
    question: `${firstNumber} x ${secondNumber}`,
    answer: firstNumber * secondNumber
  };
}

// Return random (basic or multiplication) question #script
function randomRandomQuestion() {
  return [randomBasicQuestion(), randomComplexQuestion()][randomNumber()]
}

// Give some Haptic feedback #script#UI
function vibrate(time) {
  window.navigator.vibrate(time);
}

// Format day to text (today, yesterday, <n> days before) #helper
function formatDay(day) {
  return day == 1 ? "Yesterday" : 
  day == 0 ? "Today" : 
  day > 1 ? day + " days ago" : null;
}

// Get how many date between two dates #helper
function daysBetween(date) {
  return !!date ?
  Math.floor((new Date().getTime()-new Date(date||new Date()).getTime())/86400000) :
  null
}

// Move to next question #DOM
function updateQestion() {
  userQuestion = randomRandomQuestion();
  questionHTML.innerHTML = userQuestion.question;
}

// Change info after record have been manupilate #DOM
function updateInfo() {
  var msg = "_____";
  correctHTML.innerHTML = records.correct || msg;
  wrongHTML.innerHTML = records.wrong || msg;
  streakHTML.innerHTML = records.streak || msg;
  bestStreakHTML.innerHTML = records.bestStreak || msg;
  answeredHTML.innerHTML = records.answered || msg;
  scoreHTML.innerHTML = (records.score || 0) + "%";
  daysHTML.innerHTML = formatDay(daysBetween(storage.getItem("days")))||msg;
}

// Extract (pass) records from localStorage to records #script
function updateRecords() {
  Object.keys(records).forEach((record) => {
    records[record] = Number(storage.getItem(record));
  });
}

// Save updated records to localStorage #script
function saveRecords() {
  Object.keys(records).forEach((record) => {
    window.localStorage.setItem(record, records[record]);
  });
}

// All massive HTML declaration here... 
var questionHTML = document.querySelector("span.question"),
    answerHTML = document.querySelector("input[type=number]"),
    correctHTML = document.querySelector("span.correct"),
    wrongHTML = document.querySelector("span.wrong"),
    streakHTML = document.querySelector("span.streak"),
    bestStreakHTML = document.querySelector("span.best-streak"),
    answeredHTML = document.querySelector("span.answered"),
    daysHTML = document.querySelector("span.days"),
    allButtonsHTML = document.querySelectorAll("a,button"),
    deleteButtonHTML = document.querySelector("div.record button"),
    scoreHTML = document.querySelector("span.score"),
    container = document.querySelector("div.container"),
    storage = window.localStorage,
    records = {
      score: 0, streak: 0, bestStreak: 0,
      correct: 0, wrong: 0, answered: 0
    };

updateQestion(); updateRecords(); updateInfo();

questionHTML.ondblclick = updateQestion;

answerHTML.onchange = () => {
  if (answerHTML.value == userQuestion.answer) {
    updateQestion(); answerHTML.value = "";
    container.style.animation = "correct .6s 1";
    records.correct++; records.streak++; vibrate(100);
    if (records.streak > records.bestStreak)
      records.bestStreak = records.streak;
  } else {
    container.style.animation = "shake .8s 1";
    records.wrong++; records.streak = 0; vibrate(800);
  }
  if (records.answered===1) storage.setItem("days",new Date().toLocaleString());
  records.answered = records.correct + records.wrong;
  records.score = Math.round((records.correct / records.answered) * 100);
  saveRecords(); updateInfo();
};
container.onanimationend = () => {
  container.style.animation = null;
};
allButtonsHTML.forEach((button) => {
  button.onclick = () => vibrate(100);
});
deleteButtonHTML.onclick = () => {
  deleteButtonHTML.innerHTML = "Double click to confirm";
  setTimeout(
    () => deleteButtonHTML.innerHTML = "Delete record",
    2000)
}
deleteButtonHTML.ondblclick = () => {
  window.localStorage.clear();
  updateRecords(); updateInfo();
};
