// Pick random number
function randomNumber(min = 0, max = 1) {
  if (min >= max) throw "Inavlid min value"; max -= min;
  return Math.round(Math.random() * max) + min;
}

// Create random basic(+,-) question
function randomBasicQuestion() {
  let firstNumber = randomNumber(1, 200),
    secondNumber = randomNumber(1, 100),
    operation = ["+", "-"][randomNumber()];
  if (operation === "+") {
    var answer = firstNumber + secondNumber;
  } else if (operation == "-") {
    var answer = firstNumber - secondNumber;
  }
  return {
    question: `${firstNumber} ${operation} ${secondNumber}`,
    answer: answer
  };
}

// Create random multiplication question
function randomComplexQuestion() {
  let firstNumber = randomNumber(3, 12),
    secondNumber = randomNumber(3, 12);
  return {
    question: `${firstNumber} x ${secondNumber}`,
    answer: firstNumber * secondNumber
  };
}

// Return random (basic or multiplication) question
function randomRandomQuestion() {
  return [randomBasicQuestion(), randomComplexQuestion()][randomNumber()];
}

var userQuestion = randomRandomQuestion(),
  questionHTML = document.querySelector("span.question"),
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

// Give some Haptic feedback
function vibrate(time) {
  window.navigator.vibrate(time);
}

// Format to human readable (today, yesterday, n days before)
function formatDay(day) {
  if(day==0) return "Today";
  if(day==1) return "Yesterday";
  if(day>1) return (day + " days ago");
}

// Move to next question
function updateQestion() {
  userQuestion = randomRandomQuestion();
  questionHTML.innerHTML = userQuestion.question;
}

// Change info after record have been manupilate
function updateInfo() {
  var msg = "No record";
  correctHTML.innerHTML = records.correct || msg;
  wrongHTML.innerHTML = records.wrong || msg;
  streakHTML.innerHTML = records.streak || msg;
  bestStreakHTML.innerHTML = records.bestStreak || msg;
  answeredHTML.innerHTML = records.answered || msg;
  scoreHTML.innerHTML = (records.score || 0) + "%";
}

// Extract (pass) records from localStorage to records
function updateRecords() {
  Object.keys(records).forEach((record) => {
    records[record] = Number(storage.getItem(record));
  });
}

// Save updated records to localStorage
function saveRecords() {
  Object.keys(records).forEach((record) => {
    window.localStorage.setItem(record, records[record]);
  });
}

updateRecords(); 
updateInfo();
updateQestion();

answerHTML.onchange = () => {
  var isCorrect = answerHTML.value == userQuestion.answer;
  if (isCorrect) {
    updateQestion(); answerHTML.value = "";
    container.style.animation = "correct .6s 1";
    records.correct++; records.streak++; vibrate(100);
    if (records.streak > records.bestStreak)
      records.bestStreak = records.streak;
  } else {
    container.style.animation = "shake .8s 1";
    records.wrong++; records.streak = 0; vibrate(800);
  }
  records.answered = records.correct + records.wrong;
  records.score = Math.round((records.correct / records.answered) * 100);
  saveRecords(); updateInfo();
};
container.onanimationend = () => {
  container.style.animation = "";
};
allButtonsHTML.forEach((button) => {
  button.onclick = () => vibrate(100);
});
deleteButtonHTML.onclick = () => {
  window.localStorage.clear();
  updateRecords(); updateInfo();
};
