/*
UI for Tic Tac Toe accross browsers
Author: Maripi Maluenda
Date: June 29 2025
Description: Simple UI for tic tac toe game in two separate browser instances
*/

import { saveState } from "./states.js";

export function drawBoard(states, handleCellClick, handleClear, messages) {
    function drawWin(htmlElement, states) {

        if (states.game.win.direction == "n") {
            let fullBoard = document.getElementById("board");
            fullBoard.classList.add("tie");
        }
        if (states.game.win.direction == "h") {
            for (let i = 0; i < states.game.size; i++) {
                htmlElement.cells[states.game.win.location][i].classList.add(
                    "winner"
                );
            }
            return;
        }
        if (states.game.win.direction == "v") {
            for (let i = 0; i < states.game.size; i++) {
                htmlElement.cells[i][states.game.win.location].classList.add(
                    "winner"
                );
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
                htmlElement.cells[states.game.size - 1 - i][i].classList.add(
                    "winner"
                );
            }
            return;
        }
    }
    console.log("Drawing board");
    let htmlElement = {
        cells: [],
        msg: document.getElementById("msg"),
        player: document.getElementById("player"),
        btn1: document.getElementById("btn"),
        btn2: document.getElementById("btn2"),
    };
    let numRows = states.game.size;
    htmlElement.cells = Array.from({ length: numRows }, () =>
        Array(numRows).fill(null)
    );
    player.classList.remove("hidden");
    player.innerHTML = `You are playing as: ${states.window.thisPlayer}`;
    const board = document.getElementById("board");
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${numRows}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    const totalCells = numRows * numRows;
    board.classList.remove("tie");

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numRows; j++) {
            const cell = document.createElement("div");
            cell.setAttribute("role", "button");
            cell.addEventListener("click", () => {
                handleCellClick(
                    i,
                    j,
                    states,
                    handleCellClick
                );
            });
            //Find edges
            if (i == 0) cell.classList.add("top");
            if (j == 0) cell.classList.add("left");
            if (j == numRows - 1) cell.classList.add("right");
            if (i == numRows - 1) cell.classList.add("bottom");

            cell.classList.add("cell");
            if (states.game.board[i][j] != 0) {
                cell.innerHTML = states.game.board[i][j];
            } else {
                cell.innerHTML = "";
            }
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
    htmlElement.btn1.onClick = () => handleClear(states)
    htmlElement.btn1.disabled = false;
}

function chooseMessage(states, messages) {

    if (states.game.win.over) {
        if (states.game.win.direction == "n") {
            return messages.tie;
        }
        if (states.game.currentPlayer == states.window.thisPlayer) {
            return messages.oWin;
        } else {
            return messages.pWin;
        }
    }
    if (states.game.currentPlayer == states.window.thisPlayer) {
        return messages.active;
    } else {
        return messages.opponent;
    }
}

export function drawFirstPlayer(handleFlip, handleChoice, states) {
    console.log("Drawing first player");
    let htmlElement = {
        board: document.getElementById("board"),
        player: document.getElementById("player"),
        msg: document.getElementById("msg"),
        btn1: document.getElementById("btn"),
        btn2: document.getElementById("btn2"),
    };
    states.window.html = htmlElement
    player.classList.add('hidden');

    if (states.game.numWindow == 0) {
        drawChooseSide(htmlElement, handleChoice, states);
        states.window.thisWindow = 1;
        states.game.numWindow = 1;
    } else if (states.game.numWindow == 1) {
        drawCoinFlip(htmlElement, handleFlip, states);
        states.game.numWindow = 2;
        states.window.thisWindow = 2;
    } else {
        if (states.window.thisWindow !== 2 && states.window.thisWindow !== 1){

            htmlElement.msg.innerHTML = "Reset game to play on this window";
            htmlElement.msg.classList.remove('hidden');
            htmlElement.btn1.classList.add("hidden");
            htmlElement.board.classList.add("hidden");
            htmlElement.btn2.classList.add("hidden");
        }
    }
    states.window.running = true;
    saveState(states.game);
}
export function drawChooseSide(html, handleChoice, states) {
    console.log("Choose side");
    html.btn2.classList.remove("hidden");
    html.btn2.innerHTML = "Heads";
    html.btn2.onclick = () => handleChoice("Heads", states, html);
    html.btn1.classList.remove("hidden");
    html.btn1.innerHTML = "Tails";
    html.btn1.onclick = () => handleChoice("Tails", states, html);
    html.btn1.disabled = false;
    html.btn2.disabled = false;
    html.msg.innerHTML = "Choose head or tails to decide who goes first";
    board.classList.add("hidden");
}

export function drawCoinFlip(html, handleFlip, states) {
    console.log("Draw Coin Flip")
    html.btn1.innerHTML = "Flip";
    html.btn1.onclick = () => handleFlip(states, html);
}
