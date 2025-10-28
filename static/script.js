let questions = [];
let currentIndex = 0;
let correctCount = 0;
const questionText = document.getElementById('questionText');
const optionsDiv = document.getElementById('options');
const resultText = document.getElementById('result');
const scoreText = document.getElementById('scoreText');
const questionNum = document.getElementById('questionNum');

fetch('/api/questions')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function showQuestion() {
  resultText.textContent = '';
  const q = questions[currentIndex];
  questionNum.textContent = `問題${currentIndex + 1}`;
  questionText.textContent = q.question;
  optionsDiv.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.className = 'option-btn';
    btn.onclick = () => checkAnswer(opt);
    optionsDiv.appendChild(btn);
  });
  scoreText.textContent = `正解: ${correctCount} / ${currentIndex}`;
}

function checkAnswer(choice) {
  const correct = questions[currentIndex].correct_answer;
  if (choice === correct) {
    resultText.textContent = '正解！🌸';
    correctCount++;
  } else {
    resultText.textContent = `不正解… 正解は「${correct}」`;
  }
  nextQuestion();
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    endQuiz();
  } else {
    setTimeout(showQuestion, 800);
  }
}

function endQuiz() {
  questionText.textContent = `クイズ終了！ 最終スコア: ${correctCount} / ${questions.length}`;
  optionsDiv.innerHTML = '';
  resultText.textContent = '';
  scoreText.textContent = '';
  // 2秒後に最初の画面に戻る
  setTimeout(() => { window.location.href = '/'; }, 2000);
}


// PASSボタン
document.getElementById('passBtn').onclick = () => {
  currentIndex++;
  if (currentIndex >= questions.length) {
    endQuiz();
  } else {
    showQuestion();
  }
};

// ENDボタン
document.getElementById('endBtn').onclick = () => endQuiz();

