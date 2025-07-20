export function createBoard(board, handleCellClick) {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${board.length}, 1fr)`;
  boardEl.style.gridTemplateRows = `repeat(${board.length}, 1fr)`;

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      const div = document.createElement("div");
      div.className = "cell";
      div.innerText = cell === 0 ? "" : cell;
      div.addEventListener("click", () => handleCellClick(i * board.length + j));
      boardEl.appendChild(div);
    });
  });
}

export function updateBoard(board) {
  const cells = document.querySelectorAll(".cell");
  board.flat().forEach((val, i) => {
    cells[i].innerText = val === 0 ? "" : val;
  });
}

export function updateMessage(msg) {
  const messageEl = document.getElementById("message");
  if (messageEl) messageEl.innerText = msg;
}

export function updatePlayerText(role) {
  const playerTextEl = document.getElementById("player-role");
  if (playerTextEl) playerTextEl.innerText = `You are playing as: ${role}`;
}

export function showPlayerNumber(num) {
  const roleBox = document.getElementById("player-number");
  if (roleBox) {
    roleBox.innerText = `You are Player ${num + 1}`;
  }
}

export function setFlipButtonState(enabled) {
  const btn = document.getElementById("btn");
  if (btn) {
    btn.disabled = !enabled;
  }
}
