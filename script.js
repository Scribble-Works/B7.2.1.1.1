// ======================
// CONFIGURATION
// ======================
const TOTAL_QUESTIONS = 10;
const FEEDBACK_DELAY_MS = 2500; // Time before auto-advancing

// ======================
// GAME STATE
// ======================
let gameState = {
    currentQuestion: 0,
    score: 0,
    sequence: [],
    correctNextTerm: 0,
    correctDifference: 0
};

// ======================
// DOM ELEMENTS
// ======================
const elements = {
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultsScreen: document.getElementById('results-screen'),
    questionCounter: document.getElementById('question-counter'),
    sequenceDisplay: document.getElementById('sequence-display'),
    nextTermInput: document.getElementById('next-term'),
    differenceInput: document.getElementById('difference'),
    feedback: document.getElementById('feedback'),
    finalScore: document.getElementById('final-score')
};

// ======================
// SOUND HELPER
// ======================
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {
            // Silently ignore autoplay errors (safe after user interaction)
        });
    }
}

// ======================
// SCREEN MANAGEMENT
// ======================
function showScreen(screenId) {
    elements.startScreen.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.resultsScreen.classList.add('hidden');

    document.getElementById(screenId).classList.remove('hidden');
}

// ======================
// GAME LOGIC
// ======================
function generateSequence() {
    const { currentQuestion } = gameState;

    // End game if all questions are done
    if (currentQuestion >= TOTAL_QUESTIONS) {
        endGame();
        return;
    }

    // Update UI
    elements.questionCounter.textContent = `Question ${currentQuestion + 1} of ${TOTAL_QUESTIONS}`;

    // Generate random difference: ±2 to ±10
    const baseDiff = Math.floor(Math.random() * 9) + 2;
    const difference = Math.random() < 0.5 ? -baseDiff : baseDiff;

    // Generate random start: 5 to 54
    const startTerm = Math.floor(Math.random() * 50) + 5;

    // Build 4-term sequence
    const sequence = [];
    let current = startTerm;
    for (let i = 0; i < 4; i++) {
        sequence.push(current);
        current += difference;
    }

    // Save state
    gameState.sequence = sequence;
    gameState.correctNextTerm = current;
    gameState.correctDifference = difference;

    // Update UI
    elements.sequenceDisplay.textContent = sequence.join(', ');
    elements.nextTermInput.value = '';
    elements.differenceInput.value = '';
    elements.feedback.textContent = 'Enter your answers and click Submit.';
    elements.feedback.className = 'feedback';
}

function checkAnswer() {
    const userNext = parseFloat(elements.nextTermInput.value);
    const userDiff = parseFloat(elements.differenceInput.value);

    if (isNaN(userNext) || isNaN(userDiff)) {
        elements.feedback.textContent = 'Please enter numbers in both fields.';
        elements.feedback.className = 'feedback incorrect';
        return;
    }

    const isNextCorrect = userNext === gameState.correctNextTerm;
    const isDiffCorrect = userDiff === gameState.correctDifference;

    if (isNextCorrect && isDiffCorrect) {
        // ✅ Fully correct
        elements.feedback.textContent = `🎉 Correct! The next term is ${gameState.correctNextTerm} and the rule is to add ${gameState.correctDifference}.`;
        elements.feedback.className = 'feedback correct';
        gameState.score++;
        playSound('correct-sound');
    } else {
        // ❌ Partial or fully wrong
        const errors = [];
        if (!isNextCorrect) errors.push(`Next term should be ${gameState.correctNextTerm}`);
        if (!isDiffCorrect) errors.push(`Difference should be ${gameState.correctDifference}`);
        elements.feedback.textContent = `❌ Incorrect! ${errors.join(' | ')}`;
        elements.feedback.className = 'feedback incorrect';
        playSound('wrong-sound');
    }

    // Auto-advance after delay
    setTimeout(() => {
        gameState.currentQuestion++;
        generateSequence();
    }, FEEDBACK_DELAY_MS);
}

function startGame() {
    gameState.currentQuestion = 0;
    gameState.score = 0;
    showScreen('game-screen');
    generateSequence();
}

function endGame() {
    elements.finalScore.textContent = `Your final score: ${gameState.score}/${TOTAL_QUESTIONS}`;
    showScreen('results-screen');
}

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', () => {
    showScreen('start-screen');
});