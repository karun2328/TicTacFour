import { saveState } from "./states.js";

// Karun's UI helpers
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

// 🟣 Maripi's Original UI Game Rendering
export function drawBoard(states, handleCellClick, handleClear, messages) {
  function drawWin(htmlElement, states) {
    if (states.game.win.direction == "n") {
      let fullBoard = document.getElementById("board");
      fullBoard.classList.add("tie");
    }
    if (states.game.win.direction == "h") {
      for (let i = 0; i < states.game.size; i++) {
        htmlElement.cells[states.game.win.location][i].classList.add("winner");
      }
      return;
    }
    if (states.game.win.direction == "v") {
      for (let i = 0; i < states.game.size; i++) {
        htmlElement.cells[i][states.game.win.location].classList.add("winner");
      }
      return;
    }
    if (states.game.win.direction == "d") {
      for (let i = 0; i < states.game.size; i++) {
        htmlElement.cells[i][i].classList.add("winner");
      }
      return;
    }
    if (states.game.win.direction == "u") {
      for (let i = 0; i < states.game.size; i++) {
        htmlElement.cells[states.game.size - 1 - i][i].classList.add("winner");
      }
      return;
    }
  }

  let htmlElement = {
    cells: [],
    msg: document.getElementById("msg"),
    player: document.getElementById("player"),
    btn1: document.getElementById("btn"),
    btn2: document.getElementById("btn2"),
  };

  const numRows = states.game.size;
  htmlElement.cells = Array.from({ length: numRows }, () =>
    Array(numRows).fill(null)
  );

  player.classList.remove("hidden");
  player.innerHTML = `You are playing as: ${states.window.thisPlayer}`;

  const board = document.getElementById("board");
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${numRows}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
  board.classList.remove("tie");

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numRows; j++) {
      const cell = document.createElement("div");
      cell.setAttribute("role", "button");
      cell.addEventListener("click", () => {
        handleCellClick(i, j, states, handleCellClick);
      });

      if (i == 0) cell.classList.add("top");
      if (j == 0) cell.classList.add("left");
      if (j == numRows - 1) cell.classList.add("right");
      if (i == numRows - 1) cell.classList.add("bottom");

      cell.classList.add("cell");
      cell.innerHTML = states.game.board[i][j] != 0 ? states.game.board[i][j] : "";
      cell.gridX = i;
      cell.gridY = j;

      board.appendChild(cell);
      htmlElement.cells[i][j] = cell;
    }
  }

  htmlElement.msg.innerHTML = chooseMessage(states, messages);

  if (states.game.win.over) {
    drawWin(htmlElement, states);
  }

  htmlElement.btn1.innerHTML = "Clear";
  htmlElement.btn1.onclick = () => handleClear(states);
  htmlElement.btn1.disabled = false;
}

function chooseMessage(states, messages) {
  if (states.game.win.over) {
    if (states.game.win.direction == "n") return messages.tie;
    return states.game.currentPlayer === states.window.thisPlayer
      ? messages.oWin
      : messages.pWin;
  }
  return states.game.currentPlayer === states.window.thisPlayer
    ? messages.active
    : messages.opponent;
}

export function drawFirstPlayer(handleFlip, handleChoice, states) {
  let htmlElement = {
    board: document.getElementById("board"),
    player: document.getElementById("player"),
    msg: document.getElementById("msg"),
    btn1: document.getElementById("btn"),
    btn2: document.getElementById("btn2"),
  };

  states.window.html = htmlElement;
  player.classList.add("hidden");

  if (states.game.numWindow == 0) {
    drawChooseSide(htmlElement, handleChoice, states);
    states.window.thisWindow = 1;
    states.game.numWindow = 1;
  } else if (states.game.numWindow == 1) {
    drawCoinFlip(htmlElement, handleFlip, states);
    states.game.numWindow = 2;
    states.window.thisWindow = 2;
  } else {
    if (![1, 2].includes(states.window.thisWindow)) {
      htmlElement.msg.innerHTML = "Reset game to play on this window";
      htmlElement.msg.classList.remove("hidden");
      htmlElement.btn1.classList.add("hidden");
      htmlElement.board.classList.add("hidden");
      htmlElement.btn2.classList.add("hidden");
    }
  }

  states.window.running = true;
  saveState(states.game);
}

export function drawChooseSide(html, handleChoice, states) {
  html.btn2.classList.remove("hidden");
  html.btn2.innerHTML = "Heads";
  html.btn2.onclick = () => handleChoice("Heads", states, html);

  html.btn1.classList.remove("hidden");
  html.btn1.innerHTML = "Tails";
  html.btn1.onclick = () => handleChoice("Tails", states, html);

  html.btn1.disabled = false;
  html.btn2.disabled = false;
  html.msg.innerHTML = "Choose head or tails to decide who goes first";

  document.getElementById("board").classList.add("hidden");
}

export function drawCoinFlip(html, handleFlip, states) {
  html.btn1.innerHTML = "Flip";
  html.btn1.onclick = () => handleFlip(states, html);
}
