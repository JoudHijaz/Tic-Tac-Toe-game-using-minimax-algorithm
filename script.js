let currentPlayer = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let gameMode = 'pvp';


function startGame() {
    // Hide the mode selection screen
    const modeSelection = document.getElementById('mode-selection');
    const gameContainer = document.getElementById('game-container');

    // Hide mode selection and show game container
    if (modeSelection) modeSelection.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'flex';


    // Initialize the game
    initializeGame();
}

function initializeGame() {
    console.log(`Game Initialized in ${gameMode} mode`);
    currentPlayer = 'X';
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;

    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((cell, index) => {
        cell.textContent = '';
        cell.classList.remove('highlight');
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);
        newCell.addEventListener('click', () => handleCellClick(index));
    });

    updateMessage();
}

function handleCellClick(index) {
    if (gameOver || boardState[index] !== '') return;

    const cell = document.querySelectorAll('.grid-item')[index];
    cell.textContent = currentPlayer;
    boardState[index] = currentPlayer;

    const result = checkWinner(boardState);
    if (result) {
        if (result === 'draw') {
            displayResult("It's a Draw!");
            const drawScoreElement = document.getElementById('draw-score');
            if (!drawScoreElement) console.error("Draw score element not found!");

            drawScoreElement.textContent = parseInt(drawScoreElement.textContent) + 1;
        } else {
            displayResult(`Player ${result} Wins!`);
            const scoreElement = document.getElementById(result === 'X' ? 'score-player-x' : 'score-player-o');
            if (!scoreElement) console.error("Score element for player not found!");

            scoreElement.textContent = parseInt(scoreElement.textContent) + 1;
        }
        gameOver = true;
        return;
    }

    switchPlayer();
    updateMessage();
    const difficulty = 'medium';
    if (gameMode === 'pvc' && currentPlayer === 'O') {
        setTimeout(() => aiMove('O', 'X', difficulty), 500); // Pass difficulty here
    }
    
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    console.log(`Current Player: ${currentPlayer}`);
}

function updateMessage() {
    const messageElement = document.querySelector('.message');
    if (messageElement) {
        messageElement.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWinner(gameState) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            combination.forEach(index => document.querySelectorAll('.grid-item')[index].classList.add('highlight'));
            return gameState[a];
        }
    }

    if (gameState.every(cell => cell !== '')) { // the cells are not empty so draw
        return 'draw';
    }

    return null;
}

function displayResult(message) {
    const messageElement = document.querySelector('.message');
    if (messageElement) {
        messageElement.textContent = message;
    }
}

function incrementScore(result) {
    if (result === 'draw') {
        const drawScoreElement = document.getElementById('draw-score');
        drawScoreElement.textContent = parseInt(drawScoreElement.textContent) + 1;
    } else {
        const scoreElement = document.getElementById(result === 'X' ? 'score-player-x' : 'score-player-o');
        scoreElement.textContent = parseInt(scoreElement.textContent) + 1;
    }
}
function aiMove(player, opponent, difficulty) {
    const maxDepth = {
        easy: 1,
        medium: 3,
        hard: 8
    }[difficulty];

    const availableMoves = getAvailableMoves(boardState);
    let bestMove = null;

    if (difficulty === 'easy' && Math.random() < 0.5) {
        // 50% chance to make a random move
        bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
        let bestScore = -Infinity;
        for (const move of availableMoves) {
            const newState = getNewState(boardState, move, player);
            const score = minimax(newState, 0, false, player, opponent, maxDepth);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
    }

    if (bestMove !== null) {
        handleCellClick(bestMove);
    }
}



function getAvailableMoves(gameState) { // returns the empty cells in the board 
    return gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
}
//Simulates the state of the board after a specific move.
function getNewState(gameState, move, player) {
    const newState = [...gameState]; // copy the current game state
    newState[move] = player;//Apply the move by setting the player’s symbol ('X' or 'O') in the specified cell.
    return newState;
}
// depth base condition max 8  
// minimax to calculate the outcome for the move
function minimax(gameState, depth, isMaximizing, player, opponent, maxDepth) {
    const result = checkWinner(gameState);
    if (result === player) return 10 - depth;
    if (result === opponent) return depth - 10;
    if (result === 'draw') return 0;

    if (depth >= maxDepth) {
        return heuristicEvaluation(gameState, player, opponent); // Use a heuristic to evaluate the state.
    }

    const availableMoves = getAvailableMoves(gameState);
    if (!availableMoves.length) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const move of availableMoves) {
        const newState = getNewState(gameState, move, isMaximizing ? player : opponent);
        const score = minimax(newState, depth + 1, !isMaximizing, player, opponent, maxDepth);

        bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }

    return bestScore;
}
function heuristicEvaluation(gameState, player, opponent) {
    // Example heuristic: count the number of player's pieces minus opponent's pieces
    const playerCount = gameState.filter(cell => cell === player).length;
    const opponentCount = gameState.filter(cell => cell === opponent).length;

    return playerCount - opponentCount;
}

function resetGame() {
    console.log("New Game Started");
    // Reset game variables
    currentPlayer = 'X';
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;

    // Clear the board UI
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((cell) => {
        cell.textContent = ''; // Clear the cell's content
        cell.classList.remove('highlight'); // Remove any winning highlights
    });
    
    // Reset the score display if needed
    const messageElement = document.querySelector('.message');
    if (messageElement) {
        messageElement.textContent = `Player ${currentPlayer}'s Turn`;
    }
}
document.getElementById('new-game-button').addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("pvp-button").addEventListener('click', () => {
        gameMode = 'pvp';
        startGame();
    });

    document.getElementById("pvc-button").addEventListener('click', () => {
        gameMode = 'pvc';
        startGame();
    });

    document.getElementById('back-button').addEventListener('click', () => {
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) gameContainer.style.display = 'none';

        const modeSelection = document.getElementById('mode-selection');
        if (modeSelection) modeSelection.style.display = 'flex';
        // Reset the score display
        document.getElementById('score-player-x').textContent = '0';
        document.getElementById('score-player-o').textContent = '0';
        document.getElementById('draw-score').textContent = '0';

        resetGame();
    });
});