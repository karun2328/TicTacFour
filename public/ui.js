/*
UI for Tic Tac Toe accross browsers
Author: Maripi Maluenda
Date: June 29 2025
Description: Simple UI for tic tac toe game in two separate browser instances
*/

import { saveState } from "./states.js";

export function drawBoard(
    states,
    handleCellClick,
    handleClear,
    messages,
) {
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
    };
    let numRows = boardState.size;
    htmlElement.cells = Array.from({ length: numRows }, () =>
        Array(numRows).fill(null)
    );
    player.innerHTML = `You are playing as: ${windowState.thisPlayer}`;
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
                handleCellClick(i, j, boardState, windowState, handleCellClick);
            });
            //Find edges
            if (i == 0) cell.classList.add("top");
            if (j == 0) cell.classList.add("left");
            if (j == numRows - 1) cell.classList.add("right");
            if (i == numRows - 1) cell.classList.add("bottom");

            cell.classList.add("cell");
            if (boardState.board[i][j] != 0) {
                cell.innerHTML = boardState.board[i][j];
            } else {
                cell.innerHTML = "";
            }
            cell.gridX = i;
            cell.gridY = j;
            board.appendChild(cell);
            htmlElement.cells[i][j] = cell;
        }
    }
    htmlElement.msg.innerHTML = chooseMessage(
        boardState,
        windowState,
        messages
    );
    if (boardState.win.over) {
        drawWin(htmlElement, boardState);
    }
    btn.innerHTML = "Clear";
    btn.onClick = handleClear;
    btn.disabled = false;
}



function chooseMessage(states, messages) {
    console.log(messages);
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

export function drawFirstPlayer(handleFlip, handleChoice, fullReset, states) {
    console.log("Drawing first player")
    let htmlElement = {
        msg: document.getElementById("msg"),
        btn1: document.getElementById("btn"),
        btn2: document.getElementById("btn2"),
        board: document.getElementById("board")
    };

    console.log(states.game)
    if (states.game.numWindow==0){
        drawChooseSide(htmlElement, handleChoice, states)
        states.window.thisWindow =1
        states.game.numWindow=1;
    } else if (states.game.numWindow==1){
        drawCoinFlip(htmlElement, handleFlip, states)
        states.game.numWindow=2;
        states.window.thisWindow =2
    } else{
        htmlElement.msg.innerHTML = "There's already two players playing. Click to clear";
        htmlElement.btn1.addEventListener("click", ()=> fullReset(states))
    }
    saveState(states.game)

}
export function drawChooseSide(html, handleChoice, states){
    console.log("Choose side")
    html.btn2.classList.remove("hidden");
    html.btn2.innerHTML = "Heads";
    html.btn2.addEventListener("click", () => handleChoice("Heads", states))
    html.btn1.innerHTML = "Tails";
    html.btn1.addEventListener("click", () => handleChoice("Tails", states))
    html.msg.innerHTML="Choose head or tails to decide who goes first";
    board.classList.add("hidden");
    
}

export function drawCoinFlip(html, handleFlip, states){
    html.btn1.innerHTML = "Flip";
    html.btn1.addEventListener("click", () => handleFlip(states))
}
