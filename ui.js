/*
UI for Tic Tac Toe accross browsers
Author: Maripi Maluenda
Date: June 29 2025
Description: Simple UI for tic tac toe game in two separate browser instances
*/

export function drawBoard(
    boardState,
    handleCellClick,
    handleClear,
    messages,
    windowState
) {
    function drawWin(htmlElement, boardState) {
        if (boardState.win.direction == "n") {
            let fullBoard = document.getElementById("board");
            fullBoard.classList.add("tie");
        }
        if (boardState.win.direction == "h") {
            for (let i = 0; i < boardState.size; i++) {
                htmlElement.cells[boardState.win.location][i].classList.add(
                    "winner"
                );
            }
            return;
        }
        if (boardState.win.direction == "v") {
            for (let i = 0; i < boardState.size; i++) {
                htmlElement.cells[i][boardState.win.location].classList.add(
                    "winner"
                );
            }
            return;
        }
        if (boardState.win.direction == "d") {
            for (let i = 0; i < boardState.size; i++) {
                htmlElement.cells[i][i].classList.add("winner");
            }
            return;
        }
        if (boardState.win.direction == "u") {
            for (let i = 0; i < boardState.size; i++) {
                htmlElement.cells[boardState.size - 1 - i][i].classList.add(
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

export function drawDiceRoll(handleDiceGuess, windowState, gameState) {
    if (windowState.guessed) {
        if (gameState.guess1) {
            return;
        } else {
            windowState.guessed = false;
        }
    }
    const board = document.getElementById("board");
    let btn = document.getElementById("btn");
    btn.remove();
    btn = document.createElement("button");
    btn.setAttribute("id", "btn");
    const inp = document.createElement("input");
    document.body.appendChild(btn);

    board.innerHTML = "";
    inp.setAttribute("type", "number");
    inp.min = "1";
    inp.max = "6";
    inp.placeholder = "1-6";
    inp.classList.add("inpBox");
    board.appendChild(inp);
    board.classList.remove("hidden");
    btn.innerHTML = "Roll Dice";
    btn.addEventListener("click", () =>
        handleDiceGuess(gameState, windowState, inp.value)
    );
    inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleDiceGuess(gameState, windowState, inp.value);
        }
    });
    msg.innerHTML = "Enter your guess for the dice roll";
}

export function drawStartScreeen(openFile, createFile, gameState, windowState) {
    const msg = document.getElementById("msg");
    const btn = document.getElementById("btn");
    const btn2 = document.getElementById("btn2");
    btn2.classList.remove("hidden");

    btn2.innerHTML = "Join Game";
    const board = document.getElementById("board");
    board.classList.add("hidden");
    msg.innerHTML = "In order to play. Please create or join a game";
    btn.innerHTML = "Create Game";
    btn.addEventListener("click", async () => {
        await createFile(gameState, windowState);
    });
    btn2.addEventListener("click", async () => {
        await openFile(gameState, windowState);
    });
}

function chooseMessage(boardState, windowState, messages) {
    console.log(messages);
    if (boardState.win.over) {
        if (boardState.win.direction == "n") {
            return messages.tie;
        }
        if (boardState.currentPlayer == windowState.thisPlayer) {
            return messages.oWin;
        } else {
            return messages.pWin;
        }
    }
    if (boardState.currentPlayer == windowState.thisPlayer) {
        return messages.active;
    } else {
        return messages.opponent;
    }
}
