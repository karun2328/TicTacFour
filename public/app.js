/*
Tic Tac Toe accross browsers
Author: Maripi Maluenda
Date: June 29 2025
Description: Simple  tic tac toe game in two separate browser instances
*/

import { drawBoard, drawCoinFlip, drawFirstPlayer } from "./ui.js";
import { makeMove, checkWin } from "./gameLogic.js";
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

let windowState = { fileOpened: false, thisPlayer: null };
let states = { window: windowState, game: gameState };

setInterval(async () => {
    const loaded = await loadState(defaultGameState, states.window);
    //We check if the json has changed
    const stateChanged = JSON.stringify(loaded) !== JSON.stringify(states.game);
    if (
        stateChanged ||
        windowState.forceCheck ||
        states.window.waitingForFlip
    ) {
        console.log("Something changed");
        windowState.forceCheck = false;
        states.game = loaded;
        if (
            loaded.windowToClear > 0 &&
            loaded.windowToClear == states.window.thisWindow
        ) {
            console.log("Clearing window");
            states.window.thisPlayer =
                states.game.firstPlayer == states.window.thisWindow ? "O" : "X";
        }
        if (states.window.waitingForFlip && states.game.started) {
            states.window.waitingForFlip = false;
            await startGame(states, states.window.html);
        }

        //If the game has already started,XS
        if (states.game && states.game.started) {
            //If the player hasn't been assigned a token yet, we assign it
            console.log("The game is happening");

            if (!states.window.thisPlayer) {
                console.log("We don't have a token!");
                if (states.game.firstPlayer == states.window.thisWindow) {
                    console.log("We are the first player");
                    states.window.thisPlayer = "O";
                } else {
                    console.log("We are the second player");
                    states.window.thisPlayer = "X";
                }
            }
            if (states.window.thisWindow) {
                drawBoard(states, handleCellClick, handleClear, messages);
            }
        } else if (states.game) {
            if (!states.window.running) {
                console.log("Not running yet");
                states.window.running = true;
                if (!states.window.doneStart) {
                    drawFirstPlayer(handleFlip, handleChoice, states);
                }
            }
        }
    }
}, 1000);

async function handleCellClick(r, c, states, handleCellClick) {
    console.log("Clicked ", r, c);
    // try {
    if (makeMove(states, r, c)) {
        states.game = checkWin(states.game, states.window.thisPlayer);
        console.log(states.game);
        drawBoard(states, handleCellClick, handleClear, messages);
        await saveState(states.game);
    }
    // } catch (error) {
    //     console.warn(error.message);
    // }
}

async function handleClear(states) {
    console.log("Clear");

    let gameState = structuredClone(defaultGameState);
    let thisWindow = states.window.thisWindow;
    gameState.started = true;
    gameState.numWindow = 2;

    if (
        states.game.win.over &&
        states.game.currentPlayer == states.window.thisPlayer
    ) {

        gameState.firstPlayer = thisWindow == 1 ? 2 : 1;
        states.window.thisPlayer = "X";
    } else {

        gameState.firstPlayer = thisWindow == 1 ? 1 : 2;
        states.window.thisPlayer = "O";
    }
    gameState.windowToClear = thisWindow == 1 ? 2 : 1;
    gameState.started = true;
    await saveState(gameState);
    states.window.forceCheck = true;
}

async function handleFlip(states, html) {
    states.window.doneStart = true;
    states.game.flipResult = Math.round(Math.random()) == 1 ? "Heads" : "Tails";

    html.msg.innerHTML = `Flipped a ${states.game.flipResult}. Waiting for oponent`;
    html.btn1.disabled = true;
    if (states.game.guess) {
        await startGame(states, html);
    }
    await saveState(states.game);
}
async function handleChoice(choice, states, html) {

    states.game.guess = choice;
    states.window.doneStart = true;
    html.msg.innerHTML = "Waiting for oponent";
    html.btn1.disabled = true;
    html.btn2.disabled = true;
    if (states.game.flipResult) {
        startGame(states, html);
    } else {
        states.window.waitingForFlip = true;
    }
    await saveState(states.game);
}
async function fullReset() {
    console.log("FULL RESET");
    states.game = structuredClone(defaultGameState);
    states.window = { thisPlayer: null, running: false };
    await saveState(states.game);
    drawFirstPlayer(handleFlip, handleChoice, states);
}
async function startGame(states, html) {
    console.log("Start game");
    let correctGuess = states.game.flipResult == states.game.guess;
    let thisWindow = states.window.thisWindow;
    if (correctGuess) {
        states.game.firstPlayer = 1;
    } else {
        states.game.firstPlayer = 2;
    }
    states.window.thisPlayer =
        states.game.firstPlayer == thisWindow ? "O" : "X";

    states.game.started = true;
    html.btn1.onclick = () => handleClear(states);
    html.btn2.classList.add("hidden");
    html.board.classList.remove("hidden");
    drawBoard(states, handleCellClick, handleClear, messages);
}

window.fullReset = fullReset;
window.states = states;
