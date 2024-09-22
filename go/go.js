const canvas = document.getElementById('goBoard');
const ctx = canvas.getContext('2d');
const boardSize = 19;
const margin = 10; // Margin around the board
const cellSize = (canvas.width - 2 * margin) / (boardSize - 1);
let board = Array(boardSize)
  .fill()
  .map(() => Array(boardSize).fill(null));
let currentPlayer = 'black';
let moveHistory = [];
let prePlacementMode = true;
let blackStonesPlaced = 0;

// Star points (hoshi) positions
const starPoints = [
  { x: 3, y: 3 },
  { x: 3, y: 9 },
  { x: 3, y: 15 },
  { x: 9, y: 3 },
  { x: 9, y: 9 },
  { x: 9, y: 15 },
  { x: 15, y: 3 },
  { x: 15, y: 9 },
  { x: 15, y: 15 },
];

function drawBoard() {
  ctx.fillStyle = '#D2B48C'; // Tan color for the board background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'black';
  for (let i = 0; i < boardSize; i++) {
    ctx.beginPath();
    ctx.moveTo(margin + i * cellSize, margin);
    ctx.lineTo(margin + i * cellSize, canvas.height - margin);
    ctx.moveTo(margin, margin + i * cellSize);
    ctx.lineTo(canvas.width - margin, margin + i * cellSize);
    ctx.stroke();
  }

  // Draw star points
  ctx.fillStyle = 'black';
  starPoints.forEach((point) => {
    ctx.beginPath();
    ctx.arc(
      margin + point.x * cellSize,
      margin + point.y * cellSize,
      cellSize / 6,
      0,
      2 * Math.PI
    );
    ctx.fill();
  });
}

function drawStone(x, y, color) {
  ctx.beginPath();
  ctx.arc(
    margin + x * cellSize,
    margin + y * cellSize,
    cellSize / 2 - 2,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round((event.clientX - rect.left - margin) / cellSize);
  const y = Math.round((event.clientY - rect.top - margin) / cellSize);

  if (board[x][y] === null) {
    if (prePlacementMode) {
      if (blackStonesPlaced < 9) {
        board[x][y] = 'black';
        drawStone(x, y, 'black');
        moveHistory.push({ x, y, player: 'black' });
        blackStonesPlaced++;
        if (blackStonesPlaced === 9) {
          prePlacementMode = false;
          currentPlayer = 'black';
        }
      }
    } else {
      board[x][y] = currentPlayer;
      drawStone(x, y, currentPlayer);
      moveHistory.push({ x, y, player: currentPlayer });
      currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    }
  }
});

document.getElementById('resetButton').addEventListener('click', () => {
  board = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill(null));
  moveHistory = [];
  currentPlayer = 'black';
  prePlacementMode = true;
  blackStonesPlaced = 0;
  drawBoard();
});

document.getElementById('undoButton').addEventListener('click', () => {
  const lastMove = moveHistory.pop();
  if (lastMove) {
    board[lastMove.x][lastMove.y] = null;
    if (prePlacementMode) {
      blackStonesPlaced--;
    } else {
      currentPlayer = lastMove.player;
    }
    drawBoard();
    moveHistory.forEach((move) => drawStone(move.x, move.y, move.player));
  }
});

document.getElementById('startButton').addEventListener('click', () => {
  prePlacementMode = false;
  currentPlayer = 'white';
});

drawBoard();
