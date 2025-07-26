/**
 * UI for Tic Tac Toe across browsers
 * Author: Maripi Maluenda
 * Date: June 29, 2025
 * Description: Refined UI file with helper functions to reduce app.js clutter
 */

import { saveState } from "./states.js";

export function drawBoard(states, handleCellClick, handleClear, messages) {
    function drawWin(htmlElement, states) {
        if (states.game.win.direction === "n") {
            document.getElementById("board").classList.add("tie");
        }
        if (states.game.win.direction === "h") {
            for (let i = 0; i < states.game.size; i++) {
                htmlElement.cells[states.game.win.location][i].classList.add("winner");
            }
            return;
        }
        if (states.game.win.direction === "v") {
            for (let i = 0; i < states.game.size; i++) {
                htmlElement.cells[i][states.game.win.location].classList.add("winner");
            }
            return;
        }
        if (states.game.win.direction === "d") {
            for (let i = 0; i < states.game.size; i++) {
                htmlElement.cells[i][i].classList.add("winner");
            }
            return;
        }
        if (states.game.win.direction === "u") {
            for (let i = 0; i < states.game.size; i++) {
                htmlElement.cells[states.game.size - 1 - i][i].classList.add("winner");
            }
            return;
        }
    }

    console.log("Drawing board");
    const htmlElement = {
        cells: [],
        msg: document.getElementById("msg"),
        player: document.getElementById("player"),
        btn1: document.getElementById("btn"),
        btn2: document.getElementById("btn2"),
    };

    const numRows = states.game.size;
    htmlElement.cells = Array.from({ length: numRows }, () => Array(numRows).fill(null));
    htmlElement.player.classList.remove("hidden");
    htmlElement.player.innerHTML = `You are playing as: ${states.window.thisPlayer}`;

    const board = document.getElementById("board");
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${numRows}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    board.classList.remove("tie");

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numRows; j++) {
            const cell = document.createElement("div");
            cell.setAttribute("role", "button");
            cell.addEventListener("click", () => handleCellClick(i, j, states, handleCellClick));

            // Cell border styling
            if (i === 0) cell.classList.add("top");
            if (j === 0) cell.classList.add("left");
            if (j === numRows - 1) cell.classList.add("right");
            if (i === numRows - 1) cell.classList.add("bottom");

            cell.classList.add("cell");
            cell.innerHTML = states.game.board[i][j] !== 0 ? states.game.board[i][j] : "";
            cell.gridX = i;
            cell.gridY = j;

            board.appendChild(cell);
            htmlElement.cells[i][j] = cell;
        }
    }

    htmlElement.msg.innerHTML = chooseMessage(states, messages);
    if (states.game.win.over) drawWin(htmlElement, states);

    updateButton(htmlElement.btn1, "Clear", () => handleClear(states), false);
}

function chooseMessage(states, messages) {
    if (states.game.win.over) {
        if (states.game.win.direction === "n") return messages.tie;
        return states.game.currentPlayer === states.window.thisPlayer ? messages.oWin : messages.pWin;
    }
    return states.game.currentPlayer === states.window.thisPlayer ? messages.active : messages.opponent;
}

export function drawFirstPlayer(handleFlip, handleChoice, states) {
    console.log("Drawing first player");
    const htmlElement = {
        board: document.getElementById("board"),
        player: document.getElementById("player"),
        msg: document.getElementById("msg"),
        btn1: document.getElementById("btn"),
        btn2: document.getElementById("btn2"),
    };

    states.window.html = htmlElement;
    htmlElement.player.classList.add("hidden");

    if (states.game.numWindow === 0) {
        drawChooseSide(htmlElement, handleChoice, states);
        states.window.thisWindow = 1;
        states.game.numWindow = 1;
    } else if (states.game.numWindow === 1) {
        drawCoinFlip(htmlElement, handleFlip, states);
        states.game.numWindow = 2;
        states.window.thisWindow = 2;
    } else {
        if (![1, 2].includes(states.window.thisWindow)) {
            htmlElement.msg.innerHTML = "Reset game to play on this window";
            htmlElement.msg.classList.remove("hidden");
            htmlElement.board.classList.add("hidden");
            htmlElement.btn1.classList.add("hidden");
            htmlElement.btn2.classList.add("hidden");
        }
    }

    states.window.running = true;
    saveState(states.game);
}

export function drawChooseSide(html, handleChoice, states) {
    console.log("Choose side");
    board.classList.add("hidden");
    updateButton(html.btn1, "Tails", () => handleChoice("Tails", states, html), false);
    updateButton(html.btn2, "Heads", () => handleChoice("Heads", states, html), false);
    html.msg.innerHTML = "Choose head or tails to decide who goes first";
    html.btn2.classList.remove("hidden");
    html.btn1.classList.remove("hidden");
}

export function drawCoinFlip(html, handleFlip, states) {
    console.log("Draw Coin Flip");
    updateButton(html.btn1, "Flip", () => handleFlip(states, html), false);
}

/**
 * UI helper function to configure any button
 * @param {HTMLElement} button - the button element
 * @param {string} label - the text to show on button
 * @param {Function} callback - function to run when clicked
 * @param {boolean} disable - whether to disable button
 */
export function updateButton(button, label, callback, disable) {
    button.innerHTML = label;
    button.disabled = disable;
    button.onclick = callback;
}