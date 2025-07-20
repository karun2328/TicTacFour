// app.js
import {
  createBoard,
  updateBoard,
  updateMessage,
  updatePlayerText,
  showPlayerNumber,
  setFlipButtonState
} from './ui.js';

import { saveState, loadState } from './states.js';
import { getInitialState } from './startDefault.js';
import { checkWin, isBoardFull } from './gameLogic.js';

let state = await loadState() || getInitialState();
let myId = sessionStorage.getItem('myId');

if (!myId) {
  myId = crypto.randomUUID();
  sessionStorage.setItem('myId', myId);
}

if (!localStorage.getItem('playerOrder')) {
  localStorage.setItem('playerOrder', JSON.stringify([myId]));
} else {
  const order = JSON.parse(localStorage.getItem('playerOrder'));
  if (!order.includes(myId) && order.length < 2) {
    order.push(myId);
    localStorage.setItem('playerOrder', JSON.stringify(order));
  }
}

function getPlayerNumber() {
  const order = JSON.parse(localStorage.getItem('playerOrder'));
  return order.indexOf(myId);
}

function isMyTurn() {
  return state.currentTurn === state.playerRole;
}

function assignRoles(coinResult) {
  const playerOrder = JSON.parse(localStorage.getItem('playerOrder'));
  const player1 = playerOrder[0];
  const player2 = playerOrder[1];

  const assignToPlayer1 = coinResult === 'heads' ? 'X' : 'O';
  const assignToPlayer2 = assignToPlayer1 === 'X' ? 'O' : 'X';

  state.players[player1] = assignToPlayer1;
  state.players[player2] = assignToPlayer2;

  state.playerRole = myId === player1 ? assignToPlayer1 : assignToPlayer2;
  state.currentTurn = 'X';
  state.flipped = true;

  saveState(state);
  updateUI();
}

function updateUI() {
  createBoard(state.board, handleMove);
  updateBoard(state.board);
  updatePlayerText(state.playerRole || '-');

  const myPos = getPlayerNumber();
  showPlayerNumber(myPos);

  const btn = document.getElementById("btn");

  if (!state.flipped) {
    if (myPos === 0) {
      updateMessage("Click Flip Coin to start.");
      setFlipButtonState(true);
    } else {
      updateMessage("Waiting for opponent to flip the coin...");
      setFlipButtonState(false);
    }
    return;
  }

  if (state.winner) {
    updateMessage(state.winner === 'draw' ? "It's a draw!" : `${state.winner} wins!`);
  } else {
    updateMessage(isMyTurn() ? "Your turn" : "Opponent's turn");
  }

  setFlipButtonState(false);
}

function handleMove(index) {
  if (!state.flipped || !isMyTurn() || state.board[index] !== 0 || state.winner) return;

  state.board[index] = state.playerRole;

  const updated = checkWin({ board: state.board, turn: state.turn, win: { over: false } }, state.playerRole);
  if (updated.win.over) {
    state.winner = state.playerRole;
  } else if (isBoardFull(state.board)) {
    state.winner = 'draw';
  } else {
    state.currentTurn = state.currentTurn === 'X' ? 'O' : 'X';
  }

  saveState(state);
  localStorage.setItem('syncUpdate', Date.now());
  updateUI();
}

window.handleCoinFlip = () => {
  const result = Math.random() < 0.5 ? 'heads' : 'tails';
  assignRoles(result);
};

window.handleClear = () => {
  state = getInitialState();
  localStorage.removeItem('playerOrder');
  sessionStorage.removeItem('myId');
  saveState(state);
  localStorage.setItem('syncUpdate', Date.now());
  location.reload();
};

window.addEventListener("storage", async () => {
  state = await loadState();
  updateUI();
});

updateUI();
