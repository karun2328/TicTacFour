/*
Game Logic for Tic Tac Toe across browsers
Author: Maripi M
Date: June 29, 2025
Description: Game logic for Tic Tac Toe with helper added, functionality untouched
*/

/**
 * Handles a player move
 * @param {Object} states - full states object
 * @param {number} r - row clicked
 * @param {number} c - column clicked
 * @returns {boolean} whether move was successful
 */
export function makeMove(states, r, c) {
    console.log("Making a move");

    if (states.game.currentPlayer !== states.window.thisPlayer) {
        console.log("It's not your turn");
        return false;
    }
    if (states.game.win.over) {
        console.log("Game is over");
        return false;
    }
    if (states.game.board[r][c] !== 0) {
        console.log("That cell is not available");
        return false;
    }

    states.window.forceCheck = true;
    states.game.board[r][c] = states.window.thisPlayer;
    states.game.turn++;
    states.game.currentPlayer = states.game.currentPlayer === "O" ? "X" : "O";

    return true;
}

/**
 * Checks if the current player has won
 * @param {Object} boardSt - current game state
 * @param {string} player - 'X' or 'O'
 * @returns {Object} updated board state with win status
 */
export function checkWin(boardSt, player) {
    console.log("Checking Win");
    const numRows = boardSt.size;
    let complete = true;

    // Check horizontal
    for (let i = 0; i < numRows; i++) {
        complete = boardSt.board[i].every(cell => cell === player);
        if (complete) return setWin(boardSt, "h", i);
    }

    // Check vertical
    for (let i = 0; i < numRows; i++) {
        complete = true;
        for (let j = 0; j < numRows; j++) {
            if (boardSt.board[j][i] !== player) {
                complete = false;
                break;
            }
        }
        if (complete) return setWin(boardSt, "v", i);
    }

    // Check diagonal top-left to bottom-right
    complete = true;
    for (let j = 0; j < numRows; j++) {
        if (boardSt.board[j][j] !== player) {
            complete = false;
            break;
        }
    }
    if (complete) return setWin(boardSt, "d", 0);

    // Check diagonal bottom-left to top-right
    complete = true;
    for (let j = 0; j < numRows; j++) {
        if (boardSt.board[numRows - 1 - j][j] !== player) {
            complete = false;
            break;
        }
    }
    if (complete) return setWin(boardSt, "u", 0);

    // Check for tie
    if (boardSt.turn === numRows * numRows) {
        return setWin(boardSt, "n", 0);
    }

    return boardSt;
}

/**
 * Sets the winning state in the board object
 * @param {Object} boardSt - current board state
 * @param {string} direction - h, v, d, u, n
 * @param {number} location - row or column
 * @returns {Object} updated board state
 */
function setWin(boardSt, direction, location) {
    boardSt.win = { direction, location, over: true };
    return boardSt;
}

/**
 * Coin flip helper for future use
 * @returns {string} "Heads" or "Tails"
 */
export function diceRoll() {
    return Math.random() < 0.5 ? "Heads" : "Tails";
}
