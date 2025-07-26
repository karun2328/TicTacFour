/*
Tic Tac Toe across browsers
Author: Maripi Maluenda + Updated by Karun
Date: July 2025
Description: Two-player synchronized game using shared game state and coin flip logic
*/

import { drawBoard, drawCoinFlip, drawFirstPlayer } from "./ui.js";
import { makeMove, checkWin, diceRoll } from "./gameLogic.js";
import { saveState, loadState } from "./states.js";
import { defaultGameState } from "./startDefault.js";

let gameState;

const messages = {
  active: "It's your turn",
  opponent: "Opponent is playing",
  oWin: "You lose :(",
  pWin: "You Win!",
  tie: "It's a tie :|",
};

let windowState = { thisPlayer: null };
let states = { window: windowState, game: gameState };

// Polling for shared state updates
setInterval(async () => {
  const loaded = await loadState(defaultGameState, states.window);
  const stateChanged = JSON.stringify(loaded) !== JSON.stringify(states.game);

  if (stateChanged || windowState.forceCheck || states.window.waitingForFlip) {
    windowState.forceCheck = false;
    states.game = loaded;

    if (
      loaded.windowToClear > 0 &&
      loaded.windowToClear === states.window.thisWindow
    ) {
      states.window.thisPlayer =
        states.game.firstPlayer === states.window.thisWindow ? "O" : "X";
    }

    if (states.window.waitingForFlip && states.game.started) {
      states.window.waitingForFlip = false;
      await startGame(states, states.window.html);
    }

    if (states.game && states.game.started) {
      if (!states.window.thisPlayer) {
        states.window.thisPlayer =
          states.game.firstPlayer === states.window.thisWindow ? "O" : "X";
      }
      if (states.window.thisWindow) {
        drawBoard(states, handleCellClick, handleClear, messages);
      }
    } else if (states.game && !states.window.running) {
      states.window.running = true;
      if (!states.window.doneStart) {
        drawFirstPlayer(handleFlip, handleChoice, states);
      }
    }
  }
}, 1000);

// Handle board cell clicks
async function handleCellClick(r, c, states, handleCellClick) {
  if (makeMove(states, r, c)) {
    states.game = checkWin(states.game, states.window.thisPlayer);
    drawBoard(states, handleCellClick, handleClear, messages);
    await saveState(states.game);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.onclick = () => fullReset();
  }
});

// Clear board and assign turn for new round
async function handleClear(states) {
  let gameState = structuredClone(defaultGameState);
  let thisWindow = states.window.thisWindow;

  if (
    states.game.win.over &&
    states.game.currentPlayer === states.window.thisPlayer
  ) {
    gameState.firstPlayer = thisWindow === 1 ? 2 : 1;
    states.window.thisPlayer = "X";
  } else {
    gameState.firstPlayer = thisWindow === 1 ? 1 : 2;
    states.window.thisPlayer = "O";
  }

  gameState.windowToClear = thisWindow === 1 ? 2 : 1;
  gameState.started = true;

  await saveState(gameState);
  states.window.forceCheck = true;
}

// Handle coin flip by Player 2
async function handleFlip(states, html) {
  states.window.doneStart = true;
  states.game.flipResult = diceRoll(); // Use helper instead of inline logic
  html.msg.innerHTML = `Flipped a ${states.game.flipResult}. Waiting for opponent`;
  html.btn1.disabled = true;

  if (states.game.guess) {
    await startGame(states, html);
  }

  await saveState(states.game);
}

// Handle guess by Player 1
async function handleChoice(choice, states, html) {
  states.game.guess = choice;
  states.window.doneStart = true;

  html.msg.innerHTML = "Waiting for opponent";
  html.btn1.disabled = true;
  html.btn2.disabled = true;

  if (states.game.flipResult) {
    startGame(states, html);
  } else {
    states.window.waitingForFlip = true;
  }

  await saveState(states.game);
}

// Completely reset shared state
async function fullReset() {
  states.game = structuredClone(defaultGameState);
  states.window = { thisPlayer: null, running: false };
  await saveState(states.game);
  drawFirstPlayer(handleFlip, handleChoice, states);
}

// Begin game after coin flip + guess
async function startGame(states, html) {
  const correctGuess = states.game.flipResult === states.game.guess;
  const thisWindow = states.window.thisWindow;

  states.game.firstPlayer = correctGuess ? 1 : 2;
  states.window.thisPlayer =
    states.game.firstPlayer === thisWindow ? "O" : "X";

  states.game.started = true;
  html.btn1.onclick = () => handleClear(states);
  html.btn2.classList.add("hidden");
  html.board.classList.remove("hidden");

  drawBoard(states, handleCellClick, handleClear, messages);
}

window.fullReset = fullReset;
window.states = states;
