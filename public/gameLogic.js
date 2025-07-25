/*
Game Logic for Tic Tac Toe across browsers
Author: Maripi Maluenda | Updated by Karun
Description: Handles move validation and win detection
*/

export function makeMove(boardState, r, c, windowState) {
    if (boardState.currentPlayer !== windowState.thisPlayer) {
        console.log("It's not your turn.");
        return false;
    }
    if (boardState.win.over) {
        console.log("Game is already over.");
        return false;
    }
    if (boardState.board[r][c] !== 0) {
        console.log("Cell is already occupied.");
        return false;
    }

    boardState.board[r][c] = windowState.thisPlayer;
    boardState.turn += 1;
    boardState.currentPlayer = boardState.currentPlayer === "X" ? "O" : "X";
    windowState.forceCheck = true;

    return true;
}

export function checkWin(boardState, player) {
    const size = boardState.size;
    const board = boardState.board;

    // Check horizontal rows
    for (let row = 0; row < size; row++) {
        if (board[row].every(cell => cell === player)) {
            boardState.win = { direction: "h", location: row, over: true };
            return boardState;
        }
    }

    // Check vertical columns
    for (let col = 0; col < size; col++) {
        let winCol = true;
        for (let row = 0; row < size; row++) {
            if (board[row][col] !== player) {
                winCol = false;
                break;
            }
        }
        if (winCol) {
            boardState.win = { direction: "v", location: col, over: true };
            return boardState;
        }
    }

    // Check main diagonal
    let diag1 = true;
    for (let i = 0; i < size; i++) {
        if (board[i][i] !== player) {
            diag1 = false;
            break;
        }
    }
    if (diag1) {
        boardState.win = { direction: "d", location: 0, over: true };
        return boardState;
    }

    // Check anti-diagonal
    let diag2 = true;
    for (let i = 0; i < size; i++) {
        if (board[i][size - 1 - i] !== player) {
            diag2 = false;
            break;
        }
    }
    if (diag2) {
        boardState.win = { direction: "u", location: 0, over: true };
        return boardState;
    }

    // Check for tie
    if (boardState.turn >= size * size) {
        boardState.win = { direction: "n", location: 0, over: true };
    }

    return boardState;
}

export function isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== 0));
}
