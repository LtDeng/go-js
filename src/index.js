import './style.css';

const canvas = document.getElementById('goBoard');
const ctx = canvas.getContext('2d');
const boardSize = 19;
const cellSize = canvas.width / (boardSize - 1);
const startButton = document.getElementById('startButton');
const undoButton = document.getElementById('undoButton');
const joinButton = document.getElementById('joinButton');
const sessionIdInput = document.getElementById('sessionId');
const sessionDisplay = document.getElementById('sessionDisplay');

let board = Array(boardSize)
  .fill()
  .map(() => Array(boardSize).fill(null));
let currentPlayer = 'black';
let moveStack = [];
let handicapStones = 0;
const maxHandicapStones = 9;
let gameStarted = false;
let peerConnection;
let dataChannel;
let signalingSocket;

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

function redrawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  moveStack.forEach((move) => {
    drawStone(move.x, move.y, move.player);
  });
}

function setupWebRTC() {
  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };
  peerConnection = new RTCPeerConnection(configuration);

  dataChannel = peerConnection.createDataChannel('game');
  dataChannel.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'move') {
      board[message.y][message.x] = message.player;
      drawStone(message.x, message.y, message.player);
      moveStack.push({ x: message.x, y: message.y, player: message.player });
      currentPlayer = message.player === 'black' ? 'white' : 'black';
    }
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      signalingSocket.send(
        JSON.stringify({ type: 'candidate', candidate: event.candidate })
      );
    }
  };

  peerConnection.ondatachannel = (event) => {
    dataChannel = event.channel;
    dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'move') {
        board[message.y][message.x] = message.player;
        drawStone(message.x, message.y, message.player);
        moveStack.push({ x: message.x, y: message.y, player: message.player });
        currentPlayer = message.player === 'black' ? 'white' : 'black';
      }
    };
  };
}

function generateSessionId() {
  return Math.random().toString(36).substr(2, 9);
}

function startGame() {
  setupWebRTC();
  const sessionId = generateSessionId();
  sessionDisplay.textContent = `Session ID: ${sessionId}`;
  peerConnection
    .createOffer()
    .then((offer) => {
      return peerConnection.setLocalDescription(offer);
    })
    .then(() => {
      signalingSocket.send(
        JSON.stringify({
          type: 'offer',
          offer: peerConnection.localDescription,
          sessionId,
        })
      );
    });
}

function joinGame(sessionId) {
  setupWebRTC();
  signalingSocket.send(JSON.stringify({ type: 'join', sessionId }));
}

function handleSignalingMessage(message) {
  console.log(message);
  const data = JSON.parse(message.data);
  if (data.type === 'offer') {
    peerConnection
      .setRemoteDescription(new RTCSessionDescription(data.offer))
      .then(() => {
        return peerConnection.createAnswer();
      })
      .then((answer) => {
        return peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        signalingSocket.send(
          JSON.stringify({
            type: 'answer',
            answer: peerConnection.localDescription,
          })
        );
      });
  } else if (data.type === 'answer') {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  } else if (data.type === 'candidate') {
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

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
      gameStarted = true;
      currentPlayer = 'white';
    }
  } else {
    if (board[y][x] === null) {
      board[y][x] = currentPlayer;
      drawStone(x, y, currentPlayer);
      moveStack.push({ x, y, player: currentPlayer });
      currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
      dataChannel.send(
        JSON.stringify({ type: 'move', x, y, player: currentPlayer })
      );
    }
  }
});

startButton.addEventListener('click', startGame);
undoButton.addEventListener('click', undoLastMove);
joinButton.addEventListener('click', () => {
  const sessionId = sessionIdInput.value;
  joinGame(sessionId);
});

signalingSocket = new WebSocket('ws://localhost:8080');
signalingSocket.onopen = () => {
  console.log('WebSocket connection established');
};
signalingSocket.onmessage = handleSignalingMessage;
signalingSocket.onerror = (error) => {
  console.error('WebSocket error:', error);
};
signalingSocket.onclose = () => {
  console.log('WebSocket connection closed');
};

drawBoard();
