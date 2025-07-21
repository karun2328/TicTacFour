//Default starting situation for a 4x4 board
export const defaultGameState = {
    size: 4,
    board: Array.from({ length: 4 }, () => Array(4).fill(0)),
    win: {
        over: false,
        location: null,
        direction: null,
    },
    turn: 0,
    currentPlayer: "O",
    started: false,
    numWindow: 0,
    flipResult: null,

    firstPlayer: null,
    guess: null
};
