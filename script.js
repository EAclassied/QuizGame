// script.js

// Retrieve selected category and difficulty from localStorage
var selectedCategory = localStorage.getItem('category');
var selectedDifficulty = localStorage.getItem('difficulty');
var SelectedNumberOfQuestions = localStorage.getItem('number');
const _checkBtn = document.getElementById('check-awnser');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');

// Get references to HTML elements
const _question = document.querySelector('#question');
const _options = document.querySelector('#le-option');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-questions');

// Initialize variables
let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = SelectedNumberOfQuestions;

// Function to save values and redirect to game.html
function saveValues() {
  // Get values from form
  var selectedCategory = document.getElementById("quiz-category").value;
  var selectedDifficulty = document.getElementById("quiz-difficulty").value;
  var SelectedNumberOfQuestions = document.getElementById("quiz-number").value;

  // Store values in localStorage
  localStorage.setItem("category", selectedCategory);
  localStorage.setItem("difficulty", selectedDifficulty);
  localStorage.setItem("number", SelectedNumberOfQuestions);

  // Redirect to game.html
  window.location.href = "./game.html";
}

// Function to set up event listeners
function setupEventListener(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

// Execute code after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load the question and update total questions and correct score
  loadQuestion();
  setupEventListener();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

// Function to fetch and load a new question
async function loadQuestion() {
    const APIUrl = `https://opentdb.com/api.php?amount=${SelectedNumberOfQuestions}&category=${selectedCategory}&difficulty=${selectedDifficulty}`;
    try {
        const result = await fetch(APIUrl);
        const data = await result.json();

        if (data.results.length > 0) {
            _result.innerHTML = "";
            showQuestion(data.results[0]);
            _checkBtn.disabled = false; // Enable the check button after loading a question
        } else {
            console.error('No questions available for the selected category and difficulty.');
        }
    } catch (error) {
        console.error('Error fetching question:', error);
    }
  console.log(correctAnswer)
}


// Function to display a question and its options
function showQuestion(data) {
    _checkBtn.disabled = false;
    // Extract correct and incorrect answers
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;

    // Insert the correct answer at a random position among incorrect answers
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

    // Display the question and options in the HTML
    _question.innerHTML = `${data.question} <br> <span class="category"> ${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
        <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}

// Function to handle option selection
function selectOption() {
    _options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if (option.classList.contains('selected')) {
                option.classList.remove('selected');
            } else {
                if (_options.querySelector('.selected')) {
                    const activeOption = _options.querySelector('.selected');
                    activeOption.classList.remove('selected');
                }
                option.classList.add('selected');
            }
        });
    });
}

// Function to check the selected answer
function checkAnswer() {
    _checkBtn.disabled = true;
    if (_options.querySelector('.selected')) {
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
            correctScore++;
            _result.innerHTML = `<p><i class="fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class="fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
            // Introduce a delay (3000 milliseconds) after displaying the correct answer for incorrect responses
            setTimeout(() => {
                checkCount();
            }, 3000);
        }
        // Introduce a delay (e.g., 3000 milliseconds) after displaying the result
        setTimeout(() => {
            checkCount();
        }, 3000);
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please Select an option! </p>`;
        _checkBtn.disabled = false;
    }
}

// Function to decode HTML entities
function HTMLDecode(textString){
    let doc = new DOMParser().parseFromString(textString,"text/html");
    return doc.documentElement.textContent;
}

// Function to check the question count and update the UI
function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        // Introduce a delay (e.g., 1000 milliseconds) before showing the final score
        setTimeout(() => {
            _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
            _playAgainBtn.style.display = "block";
            _checkBtn.style.display = "none";
        }, 1000);
    } else {
        // Introduce a delay (3000 milliseconds) before loading the next question
        setTimeout(() => {
            loadQuestion();
        }, 3000);
    }
}

// Function to set the total question and correct score in the UI
function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

// Function to restart the quiz
function restartQuiz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
   
    
    // Delay the redirect to index.html by 3 seconds (3000 milliseconds)
    setTimeout(() => {
        window.location.href = "./index.html"; // Redirect to index.html
    }, 1000);
}
