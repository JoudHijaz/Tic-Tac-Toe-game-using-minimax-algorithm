let currentPlayer = 'X'; // Track the current player
let boardState = ['', '', '', '', '', '', '', '', '']; // Track the state of the board

let gameOver = false;

// Initialize the game
function initializeGame() {
  console.log('Game Initialized');
  currentPlayer = 'X'; // Reset to Player X
  boardState = ['', '', '', '', '', '', '', '', '']; // Clear board state
  gameOver=false;
  // Clear the visual board
  const gridItems = document.querySelectorAll('.grid-item');
  gridItems.forEach((cell, index) => {
    cell.textContent = ''; // Clear X or O from the cell
    cell.classList.remove('highlight'); // Optional: Remove any highlights
    const newCell = cell.cloneNode(true); // Clone the cell to remove all listeners
    cell.parentNode.replaceChild(newCell, cell);
    newCell.addEventListener('click', (event) => handleCellClick(index));
  });

  // Update the message display
  updateMessage();
}

// Handle a cell click
function handleCellClick(index) {
  
  console.log(gameOver);

  if(gameOver){ // if true will stop the game
    return //ignors clicks beacuse have we found the winner 
  }
  const cellElement = document.getElementById(`cell-${index}`);
  if (boardState[index] !== '' && cellElement) {
      cellElement.disabled = true; // Correct property name
      return; // Ignore clicks on occupied cells
  }
  
    // Update the cell visually and in the board state
    const cell = document.querySelectorAll('.grid-item')[index];
    cell.textContent = currentPlayer;
    boardState[index] = currentPlayer;
  
    // Check for a winner
    const result = checkWinner();

    console.log(result)
    if (result) {
      if (result === 'draw') {
        displayResult("It's a Draw !");
        const drawScoreElement = document.getElementById('draw-score');
        drawScoreElement.textContent = parseInt(drawScoreElement.textContent) + 1;
      } else {
        displayResult(`Player ${result} Wins !`);
        if (result === 'X'){
          const scoreElement =document.getElementById('score-player-x');
          scoreElement.textContent =parseInt(scoreElement.textContent)+1;
        }else{
          const scoreElement =document.getElementById('score-player-o');
          scoreElement.textContent =parseInt(scoreElement.textContent)+1;
        }
        
      }
      gameOver = true;
      return; // Stop further moves
    }
  
    // Switch the player
    switchPlayer();
  
    // Update the display message
    updateMessage();
  }
  

// Switch the current player
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Toggle between X and O
  console.log(`Current Player: ${currentPlayer}`);
}

// Update the turn display message
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
          console.log(boardState[a],boardState[b],boardState[c])
          return boardState[a]; // Return the winner ('X' or 'O')
      }
  }

  if (boardState.every(cell => cell !== '')) {
      return 'draw'; // All cells are filled and no winner
  }

  return null; // No winner yet
}
function displayResult(result) {
  const resultElement = document.querySelector('.message');
  if (resultElement) {
    resultElement.textContent = result;
  }
}


// Set up the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);

// Reset the game 
document.querySelector('.new-game').addEventListener('click', initializeGame);

