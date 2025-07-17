/*
Tic Tac Toe accross browsers
Author: Maripi Maluenda
Date: June 29 2025
Description: Simple  tic tac toe game in two separate browser instances
*/

import { drawBoard, drawDiceRoll, drawStartScreeen } from "./ui.js";
import { makeMove, checkWin } from "./gameLogic.js";
import { saveState, loadState, openFile, createFile } from "./states.js";
import { defaultGameState } from "../TicTacFourcp/startDefault.js";

let gameState = defaultGameState;

const messages = {
    active: "It's your turn",
    opponent: "Opponent is playing",
    oWin: "You lose :(",
    pWin: "You Win!",
    tie: "It's a tie :|",
};
let thisPlayer = null;
gameState = defaultGameState;

console.log(gameState);
let windowState = { fileOpened: false, thisPlayer: null };

drawStartScreeen(openFile, createFile, gameState, windowState);

windowState.forceCheck = true;
setInterval(async () => {
    const loaded = await loadState(defaultGameState);
    //We check if the json has changed

    if (windowState.fileOpened) {
        if (
            JSON.stringify(loaded) !== JSON.stringify(gameState) ||
            windowState.forceCheck
        ) {
            windowState.forceCheck = false;

            gameState = loaded;
            console.log("Something changed");
            console.log("Guess1 : ", gameState.guess1);
            console.log("Guess2 : ", gameState.guess2);
            console.log(windowState);

            //If the game has already started,XS
            if (gameState && gameState.started) {
                //If the player hasn't been assigned a token yet, we assign it
                console.log("The game is happening");
                if (!windowState.thisPlayer) {
                    console.log("We don't have a token!");
                    if (gameState.firstPlayer == windowState.thisWindow) {
                        console.log("We are the first player");
                        windowState.thisPlayer = "O";
                    } else {
                        console.log("We are the second player");
                        windowState.thisPlayer = "X";
                    }
                    console.log(windowState);
                }
                drawBoard(
                    gameState,
                    handleCellClick,
                    handleClear,
                    messages,
                    windowState
                );
            } else {
                drawDiceRoll(handleDiceGuess, windowState, gameState);
                windowState.forceCheck = false;
            }
        }
    } else {
        drawStartScreeen(openFile, createFile, gameState, windowState);
    }
}, 1000);

async function handleCellClick(r, c, gameState, windowState, handleCellClick) {
    console.log("Clicked ", r, c);
    try {
        if (makeMove(gameState, r, c, windowState)) {
            gameState = checkWin(gameState, windowState.thisPlayer);

            drawBoard(
                gameState,
                handleCellClick,
                handleClear,
                messages,
                windowState
            );
            await saveState(gameState);
        }
    } catch (error) {
        console.warn(error.message);
    }
}

async function handleDiceGuess(gameState, windowState, val) {
    console.log("Guessing ");
    console.log(val);
    const btn = document.getElementById("btn");
    const msg = document.getElementById("msg");
    windowState.guessed = true;
    if (gameState.guess1) {
        windowState.thisWindow = 2;
        console.log("Both players have guessed, rolling:");
        gameState.guess2 = val;
        let diceRoll = Math.floor(Math.random() * 6 + 1);
        console.log("dice roll: ", diceRoll);
        let distance1 = Math.abs(gameState.guess1 - diceRoll);
        let distance2 = Math.abs(gameState.guess2 - diceRoll);
        if (distance1 == distance2) {
            console.log("Tie");
            gameState.guess1 = null;
            gameState.guess2 = null;
            windowState.guessed = false;
        } else if (distance1 > distance2) {
            windowState.thisPlayer = "O";
            gameState.firstPlayer = 2;
            gameState.started = true;
        } else {
            windowState.thisPlayer = "X";
            gameState.firstPlayer = 1;
            gameState.started = true;
        }
    } else {
        gameState.guess1 = val;
        msg.innerHTML = "Waiting for opponent";
        btn.disabled = true;
        windowState.thisWindow = 1;
    }
    saveState(gameState);
    windowState.forceCheck = true;
}

async function handleClear() {
    gameState = defaultGameState;
    gameState.fileOpened = true;
    gameState.started = true;
    saveState(gameState);
}
