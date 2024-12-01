let currentPlayer = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

function initializeGame() {
    console.log('Game Initialized');
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

    const result = checkWinner();
    if (result) {
        if (result === 'draw') {
            displayResult("It's a Draw!");
            const drawScoreElement = document.getElementById('draw-score');
            drawScoreElement.textContent = parseInt(drawScoreElement.textContent) + 1;
        } else {
            displayResult(`Player ${result} Wins!`);
            const scoreElement = document.getElementById(result === 'X' ? 'score-player-x' : 'score-player-o');
            scoreElement.textContent = parseInt(scoreElement.textContent) + 1;
        }
        gameOver = true;
        return;
    }

    switchPlayer();
    updateMessage();

    if (currentPlayer === 'O') {
        setTimeout(() => aiMove('O', 'X'), 500); // Delay for AI move
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

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            combination.forEach(index => document.querySelectorAll('.grid-item')[index].classList.add('highlight'));
            return boardState[a];
        }
    }

    if (boardState.every(cell => cell !== '')) {
        return 'draw';
    }

    return null;
}

function displayResult(message) {
    const resultElement = document.querySelector('.message');
    if (resultElement) {
        resultElement.textContent = message;
    }
}

function getAvailableMoves() {
    return boardState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
}

function getNewState(move, player) {
    const newBoardState = [...boardState];
    newBoardState[move] = player;
    return newBoardState;
}

function minimax(gameState, depth, isMaximizing, player, opponent) {
    const result = checkWinner();
    if (result === player) return 10 - depth;
    if (result === opponent) return depth - 10;
    if (result === 'draw') return 0;

    const availableMoves = getAvailableMoves();
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const move of availableMoves) {
        const newState = getNewState(move, isMaximizing ? player : opponent);
        const score = minimax(newState, depth + 1, !isMaximizing, player, opponent);

        bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }

    return bestScore;
}

function aiMove(player, opponent) {
    const availableMoves = getAvailableMoves();
    let bestScore = -Infinity;
    let bestMove = null;

    for (const move of availableMoves) {
        const newState = getNewState(move, player);
        const score = minimax(newState, 0, false, player, opponent);

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    if (bestMove !== null) {
        handleCellClick(bestMove);
    }
}

document.addEventListener('DOMContentLoaded', initializeGame);
document.querySelector('.new-game').addEventListener('click', initializeGame);
