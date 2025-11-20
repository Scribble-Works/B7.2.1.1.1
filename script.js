const TOTAL_QUESTIONS = 10;
let currentQuestion = 0;
let score = 0;
let currentSequence = [];
let correctNextTerm = 0;
let correctDifference = 0;

// --- SCREEN MANAGEMENT ---

function showScreen(id) {
    // Hide all screens
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    
    // Show the requested screen
    document.getElementById(id).classList.remove('hidden');
}

function startGame() {
    currentQuestion = 0;
    score = 0;
    generateNewSequence();
    showScreen('game-screen');
}

function endGame() {
    document.getElementById('final-score').textContent = `Your final score: ${score}/${TOTAL_QUESTIONS}`;
    showScreen('results-screen');
}

// --- GAME LOGIC ---

function generateNewSequence() {
    // Increment question counter and check if the game is over
    currentQuestion++;
    if (currentQuestion > TOTAL_QUESTIONS) {
        endGame();
        return;
    }
    
    // Update question display
    document.getElementById('question-counter').textContent = `Question ${currentQuestion} of ${TOTAL_QUESTIONS}`;
    
    // 1. Determine the difference (the rule)
    // Random difference between 2 and 10, positive or negative
    let difference = Math.floor(Math.random() * 9) + 2; 
    if (Math.random() < 0.5) {
        difference = -difference; 
    }
    
    // 2. Determine the starting number
    let startTerm = Math.floor(Math.random() * 50) + 5; 

    // 3. Generate the first 4 terms of the sequence
    currentSequence = [];
    let term = startTerm;
    for (let i = 0; i < 4; i++) {
        currentSequence.push(term);
        term += difference;
    }

    // 4. Calculate the correct answers
    correctNextTerm = term;
    correctDifference = difference;
    
    // 5. Display the sequence
    document.getElementById('sequence-display').textContent = currentSequence.join(', ');

    // 6. Reset input fields and feedback
    document.getElementById('next-term').value = '';
    document.getElementById('difference').value = '';
    document.getElementById('feedback').textContent = 'Enter your answers and click Submit.';
    document.getElementById('feedback').className = 'feedback';
}

function checkAnswer() {
    const userNextTerm = parseFloat(document.getElementById('next-term').value);
    const userDifference = parseFloat(document.getElementById('difference').value);
    const feedbackElement = document.getElementById('feedback');
    
    if (isNaN(userNextTerm) || isNaN(userDifference)) {
        feedbackElement.textContent = 'Please enter numbers in both fields before submitting.';
        feedbackElement.className = 'feedback incorrect';
        return;
    }

    const isNextTermCorrect = userNextTerm === correctNextTerm;
    const isDifferenceCorrect = userDifference === correctDifference;
    
    let message = '';
    let isCorrect = false;

    if (isNextTermCorrect && isDifferenceCorrect) {
        message = `🎉 Correct! The next term is ${correctNextTerm} and the rule is to add ${correctDifference} to the preceding term.`;
        feedbackElement.className = 'feedback correct';
        score++;
        isCorrect = true;
    } else {
        let errorParts = [];
        if (!isNextTermCorrect) {
            errorParts.push(`Next Term is incorrect (Should be ${correctNextTerm})`);
        }
        if (!isDifferenceCorrect) {
            errorParts.push(`Rule/Difference is incorrect (Should be ${correctDifference})`);
        }
        
        message = `❌ Incorrect! ${errorParts.join(' | ')}`;
        feedbackElement.className = 'feedback incorrect';
    }
    
    // Display feedback
    feedbackElement.textContent = message;

    // Wait a moment before moving to the next question
    setTimeout(generateNewSequence, 2500); // 2.5 second delay
}

// Initialize to the start screen when the page loads
window.onload = () => showScreen('start-screen');