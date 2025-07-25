// startDefault.js
// Default starting state for a 4x4 Tic Tac Toe game with coin flip logic

export const defaultGameState = {
    size: 4,
    board: Array.from({ length: 4 }, () => Array(4).fill(0)),
    win: {
        over: false,
        location: null,
        direction: null,
    },
    turn: 0,
    currentPlayer: null,       // Will be set to 'X' or 'O' after coin flip
    started: false,            // Game begins after coin flip resolves
    coinResult: null,          // 'heads' or 'tails'
    playerX: null,             // UUID of player assigned X
    playerO: null,             // UUID of player assigned O
    activePlayers: [],         // Stores UUIDs of connected browsers
    firstPlayer: null,         // Tracks who goes first
    fileOpened: 0              // Tracks file open count (if needed)
};

//  Add this function to create a fresh state copy
export function getInitialState() {
    return JSON.parse(JSON.stringify(defaultGameState));
}
