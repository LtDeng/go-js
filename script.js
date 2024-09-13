const canvas = document.getElementById('goBoard');
const ctx = canvas.getContext('2d');
const boardSize = 19;
const cellSize = canvas.width / (boardSize - 1);

function drawBoard() {
  ctx.strokeStyle = 'black';
  for (let i = 0; i < boardSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  // Draw hoshi points
  const hoshiPoints = [
    [3, 3],
    [3, 9],
    [3, 15],
    [9, 3],
    [9, 9],
    [9, 15],
    [15, 3],
    [15, 9],
    [15, 15],
  ];

  hoshiPoints.forEach(([x, y]) => {
    drawHoshi(x, y);
  });
}

function drawHoshi(x, y) {
  ctx.beginPath();
  ctx.arc(x * cellSize, y * cellSize, cellSize / 6, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
}

drawBoard();

let board = Array(boardSize)
  .fill()
  .map(() => Array(boardSize).fill(null));
let currentPlayer = 'black';
let moveStack = [];
let handicapStones = 0;
const maxHandicapStones = 9;
let gameStarted = false;

canvas.addEventListener('click', (event) => {
  const x = Math.round(event.offsetX / cellSize);
  const y = Math.round(event.offsetY / cellSize);

  if (!gameStarted) {
    if (handicapStones < maxHandicapStones && board[y][x] === null) {
      board[y][x] = 'black';
      drawStone(x, y, 'black');
      moveStack.push({ x, y, player: 'black' });
      handicapStones++;
    }
    if (handicapStones === maxHandicapStones) {
      start();
    }
  } else {
    if (board[y][x] === null) {
      board[y][x] = currentPlayer;
      drawStone(x, y, currentPlayer);
      moveStack.push({ x, y, player: currentPlayer });
      currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    }
  }
});

function drawStone(x, y, color) {
  ctx.beginPath();
  ctx.arc(x * cellSize, y * cellSize, cellSize / 2 - 2, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

function undoLastMove() {
  if (moveStack.length > 0) {
    const lastMove = moveStack.pop();
    board[lastMove.y][lastMove.x] = null;
    redrawBoard();
    currentPlayer = lastMove.player;
    if (!gameStarted) {
      handicapStones--;
    }
  }
}

function start() {
  gameStarted = true;
  currentPlayer = 'white';
}

function reset() {
  moveStack = [];
  redrawBoard();
}

function redrawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  moveStack.forEach((move) => {
    drawStone(move.x, move.y, move.player);
  });
}

// Add an undo button to the HTML
const undoButton = document.createElement('button');
undoButton.textContent = 'Undo';
undoButton.addEventListener('click', undoLastMove);
document.body.appendChild(undoButton);

// Add start button to the HTML
const startButton = document.createElement('button');
startButton.textContent = 'Start';
startButton.addEventListener('click', start);
document.body.appendChild(startButton);

// Add reset button to the HTML
const resetButton = document.createElement('button');
resetButton.textContent = 'Reset';
resetButton.addEventListener('click', reset);
document.body.appendChild(resetButton);
