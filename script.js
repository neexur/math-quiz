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
scoreHTML = document.querySelector("h1"),
container = document.querySelector("div.container"),
score = 0;

function updateQestion() {
  userQuestion = randomRandomQuestion();
  questionHTML.innerHTML = userQuestion.question;
}

updateQestion()

answerHTML.onchange = () => {
  var isCorrect = answerHTML.value == userQuestion.answer;
  if(isCorrect){
    updateQestion(); answerHTML.value = ""; 
    container.style.animation = "correct .6s 1";
    score++;
  } else {
    container.style.animation = "shake .8s 1";
    score--;
  };
  scoreHTML.innerHTML = "Score: " + score
}
container.onanimationend = () => {
  container.style.animation = ""
}
