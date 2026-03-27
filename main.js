const inputs = document.querySelector('.inputs');
const startBtn = document.querySelector('.start-btn');
const arg1 = document.querySelector('.arg1');
const operator = document.querySelector('.operator');
const arg2 = document.querySelector('.arg2');
const answer = document.querySelector('.answer');
const timer = document.querySelector('.timer');
const playAgain = document.querySelector('.play-again');

const myrng = new Math.seedrandom(new Date().toDateString());

let nextAnswer;
let startTime = false;
let score = 0;
let totalTime = 30;

// if (localStorage.getItem('date') === new Date().toDateString() && localStorage.getItem('score')) {
//   timer.toggleAttribute('hidden');
//   playAgain.toggleAttribute('hidden');

//   score = localStorage.getItem('score');
//   timer.innerText = `Score: ${score}`;
// } else {
  startBtn.toggleAttribute('hidden');
  inputs.toggleAttribute('hidden');
// }

const getOperationIndex = () => {
  return Math.ceil(myrng() * 4);
}

const getInt = (limit) => {
  return Math.ceil(myrng() * limit);
}

const generateQuestion = () => {
  const operation = getOperationIndex();

  let randomNums;

  switch (operation) {
    case 1:
      randomNums = [getInt(100), getInt(100)];
      arg1.textContent = randomNums[0];
      arg2.textContent = randomNums[1];
      operator.textContent = '+';
      nextAnswer = randomNums[0] + randomNums[1];
      break;
    case 2:
      randomNums = [getInt(100), getInt(100)];
      randomNums.sort((a, b) => b - a);
      arg1.textContent = randomNums[0];
      arg2.textContent = randomNums[1];
      operator.textContent = '-';
      nextAnswer = randomNums[0] - randomNums[1];
      break;
    case 3:
      randomNums = [getInt(25), getInt(25)];
      arg1.textContent = randomNums[0];
      arg2.textContent = randomNums[1];
      operator.textContent = 'X';
      nextAnswer = randomNums[0] * randomNums[1];
      break;
    case 4:
      randomNums = [getInt(25), getInt(25)];
      randomNums.sort((a, b) => a - b);
      arg1.textContent = randomNums[0] * randomNums[1];
      arg2.textContent = randomNums[0];
      operator.textContent = '/';
      nextAnswer = randomNums[1];
      break;
    default:
      break;
  }
}

const handleEnd = () => {
  startTime = true;

  nextAnswer = null;
  arg1.textContent = '';
  arg2.textContent = '';
  operator.textContent = '';
  inputs.toggleAttribute('hidden');
  playAgain.toggleAttribute('hidden');

  timer.innerText = `Score: ${score}`;
  localStorage.setItem('score', score);
  localStorage.setItem('date', new Date().toDateString());
}

const handleStart = () => {
  if (!startTime) {
    startBtn.toggleAttribute('hidden');
    timer.toggleAttribute('hidden');

    generateQuestion();

    startTime = Date.now();

    answer.focus();

    requestAnimationFrame(updateTimer);
  }
}

const updateTimer = () => {
  const timeOffset = Math.ceil(totalTime - (Date.now() - startTime) / 1000);

  if (timeOffset <= 0) {
    handleEnd();

    return;
  }

  timer.innerText = timeOffset;

  requestAnimationFrame(updateTimer);
}

startBtn.addEventListener('click', handleStart);

answer.addEventListener('input', (e) => {
  if (parseInt(e.target.value) === nextAnswer) {
    e.target.value = '';
    totalTime += 200 / totalTime;

    generateQuestion();

    score++;
  }
});