let currentPlayer = 'X'; // Track the current player
let boardState = ['', '', '', '', '', '', '', '', '']; // Track the state of the board


const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6]  // Diagonal from top-right to bottom-left
  ];

// Initialize the game
function initializeGame() {
  console.log('Game Initialized');
  currentPlayer = 'X'; // Reset to Player X
  boardState = ['', '', '', '', '', '', '', '', '']; // Clear board state

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
    if (boardState[index] !== '') {
      console.log('Cell already taken!');
      return; // Ignore clicks on occupied cells
    }
  
    // Update the cell visually and in the board state
    const cell = document.querySelectorAll('.grid-item')[index];
    cell.textContent = currentPlayer;
    boardState[index] = currentPlayer;
  
    // Check for a winner
    const result = checkWinner();
    if (result) {
      if (result === 'draw') {
        displayResult("It's a Draw!");
      } else {
        displayResult(`Player ${result} Wins!`);
      }
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
    for (const combination of winningCombinations) {
      const [a, b, c] = combination; // Destructure the indices
      if (
        boardState[a] && // Check if the cell is not empty
        boardState[a] === boardState[b] && // Check if all three are the same
        boardState[a] === boardState[c]
      ) {
        return boardState[a]; // Return 'X' or 'O'
      }
    }
  
    // If no winner but the board is full, it's a draw
    if (!boardState.includes('')) {
      return 'draw';
    }
  
    // Otherwise, no winner yet
    return null;
  }
function displayResult(message) {
  const messageElement = document.querySelector('.message');
  if (messageElement) {
    messageElement.textContent = message;
  }

  
}


// Set up the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);

// Reset the game 
document.querySelector('.new-game').addEventListener('click', initializeGame);
