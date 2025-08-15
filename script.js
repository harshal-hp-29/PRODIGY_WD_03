const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const modeRadios = document.getElementsByName("mode");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let mode = "pvp"; // 'pvp' or 'ai'

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, idx) => {
    const cellDiv = document.createElement("div");
    cellDiv.className = "cell";
    cellDiv.dataset.index = idx;
    cellDiv.textContent = cell;
    cellDiv.addEventListener("click", handleCellClick);
    boardElement.appendChild(cellDiv);
  });
}

function handleCellClick(e) {
  const idx = e.target.dataset.index;
  if (!gameActive || board[idx]) return;
  makeMove(idx, currentPlayer);
  if (mode === "ai" && gameActive && currentPlayer === "O") {
    setTimeout(aiMove, 400); // AI move after short delay
  }
}

function makeMove(idx, player) {
  if (!gameActive || board[idx]) return;
  board[idx] = player;
  renderBoard();
  const winInfo = checkWin();
  if (winInfo) {
    gameActive = false;
    highlightWinner(winInfo.line);
    statusElement.textContent = `Player ${winInfo.player} wins!`;
  } else if (board.every((cell) => cell)) {
    gameActive = false;
    statusElement.textContent = "It's a draw!";
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWin() {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line };
    }
  }
  return null;
}

function highlightWinner(line) {
  const cells = boardElement.children;
  line.forEach((idx) => {
    cells[idx].classList.add("winner");
  });
}

function restartGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  statusElement.textContent = `Player X's turn`;
  renderBoard();
}

function aiMove() {
  // Simple AI: pick random empty cell
  const empty = board
    .map((cell, idx) => (cell ? null : idx))
    .filter((idx) => idx !== null);
  if (empty.length === 0) return;
  // Try to win or block
  let move =
    findBestMove("O") ||
    findBestMove("X") ||
    empty[Math.floor(Math.random() * empty.length)];
  makeMove(move, "O");
}

function findBestMove(player) {
  // Check if player can win in next move
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    const vals = [board[a], board[b], board[c]];
    if (vals.filter((v) => v === player).length === 2 && vals.includes("")) {
      return line[vals.indexOf("")];
    }
  }
  return null;
}

function handleModeChange() {
  mode = Array.from(modeRadios).find((r) => r.checked).value;
  restartGame();
}

modeRadios.forEach((radio) =>
  radio.addEventListener("change", handleModeChange)
);
restartBtn.addEventListener("click", restartGame);

// Initial render
renderBoard();
statusElement.textContent = `Player X's turn`;

