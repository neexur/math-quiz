if (typeof(Storage) !== "undefined")  window.location = "./v"

function randomNumber(min=0,max=1){
  if(min>=max) throw "Inavlid min value"; max -= min;
  return Math.round(Math.random()*max)+min;
}
function randomBasicQuestion() {
  let firstNumber = randomNumber(1,200),
    secondNumber = randomNumber(1,100),
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
function randomComplexQuestion() {
  let firstNumber = randomNumber(3,12),
    secondNumber = randomNumber(3,12);
  return {
    question: `${firstNumber} x ${secondNumber}`,
    answer: firstNumber * secondNumber
  };
}
function randomRandomQuestion() {
  return [randomBasicQuestion(), randomComplexQuestion()][randomNumber()];
}

var 
userQuestion = randomRandomQuestion(),
questionHTML = document.querySelector("span.question"),
answerHTML = document.querySelector("input[type=number]"),
correctHTML = document.querySelector("span.correct"),
wrongHTML = document.querySelector("span.wrong"),
streakHTML = document.querySelector("span.streak"),
bestStreakHTML = document.querySelector("span.best-streak"),
answeredHTML = document.querySelector("span.answered"),
allButtonsHTML = document.querySelectorAll("a,button"),
deleteButtonHTML = document.querySelector("div.record button"),
scoreHTML = document.querySelector("span.score"),
container = document.querySelector("div.container"),
records = {
  score: 0,streak: 0,bestStreak: 0,
  correct: 0,wrong: 0,answered: 0,
};

function vibrate(time) {
  window.navigator.vibrate(time)
}
function updateQestion() {
  userQuestion = randomRandomQuestion();
  questionHTML.innerHTML = userQuestion.question;
}
function updateInfo() {
  var savedrecords = window.localStorage;
  var msg = "No record"
  if(savedrecords) {
    correctHTML.innerHTML = savedrecords.correct || msg;
    wrongHTML.innerHTML = savedrecords.wrong || msg;
    streakHTML.innerHTML = savedrecords.streak || msg;
    bestStreakHTML.innerHTML = savedrecords.bestStreak || msg;
    answeredHTML.innerHTML = savedrecords.answered || msg;
    scoreHTML.innerHTML = (Math.round(savedrecords.score) || 0)+"%";
    return
  }
}
function saveRecords () {
  Object.keys(records).forEach(record => {
    window.localStorage.setItem(record,records[record])
  })
}

updateQestion(); updateInfo();

answerHTML.onchange = () => {
  var isCorrect = answerHTML.value == userQuestion.answer;
  if(isCorrect){
    updateQestion(); answerHTML.value = ""; 
    container.style.animation = "correct .6s 1";
    records.correct++; records.streak++; vibrate(100)
    if(records.streak>records.bestStreak) 
      records.bestStreak=records.streak
  } else {
    container.style.animation = "shake .8s 1";
    records.streak = 0; records.wrong++; vibrate(400)
  };
  records.answered = records.correct+records.wrong; 
  records.score=records.correct/records.answered*100;
  saveRecords(); updateInfo(); 
}
container.onanimationend = () => {
  container.style.animation = ""
}
allButtonsHTML.forEach( button => {
  button.onclick = () => vibrate(100)
})
deleteButtonHTML.onclick = () => {
  window.localStorage.clear()
  updateInfo()
}
