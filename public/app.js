/*
Tic Tac Toe accross browsers
Author: Maripi Maluenda
Date: June 29 2025
Description: Simple  tic tac toe game in two separate browser instances
*/

import { drawBoard, drawCoinFlip, drawFirstPlayer } from "./ui.js";
import { makeMove, checkWin } from "./gameLogic.js";
import { saveState, loadState} from "./states.js";
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
let states = {window: windowState, game: gameState};




windowState.forceCheck = true;
setInterval(async () => {
    const loaded = await loadState(defaultGameState);
    //We check if the json has changed

    
    gameState = loaded;
    if (
            JSON.stringify(loaded) !== JSON.stringify(gameState) ||
            windowState.forceCheck
        ){
            states.game = gameState
            console.log("Something changed");
            console.log(gameState)
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
                
                // drawBoard(s
                //     states,
                //     handleCellClick,
                //     handleClear,
                //     messages,
                // );
            }else if(gameState){
                console.log("Here")

                if(!windowState.thisWindow){
                    console.log(windowState)
                    drawFirstPlayer(handleFlip, handleChoice, fullReset, states)
                    windowState.forceCheck = false
                }
            }
        }
       
        
    
}, 5000);

async function handleCellClick(r, c, states, handleCellClick) {
    console.log("Clicked ", r, c);
    try {
        if (makeMove(gameState, r, c, states.window)) {
            gameState = checkWin(gameState, states.window.thisPlayer);

            drawBoard(
                states,
                handleCellClick,
                handleClear,
                messages,
                
            );
            await saveState(states.game);
        }
    } catch (error) {
        console.warn(error.message);
    }
}



async function handleClear() {
    gameState = structuredClone(defaultGameState);
    gameState.started = true;
    saveState(gameState);
}

async function handleFlip(states) {
    states.game.flipResult = Math.round(Math.random()) == 1 ? "Heads" : "Tails"
    console.log(gameState.flipResult);
    console.log(states.game)
    if(states.game.choice){
        console.log('choice ${states.game.choice}');
        if(states.game.flipResult == states.game.choice){
            states.window.thisPlayer = 'X';
            states.game.firstPlayer = 1;
        } else {
            states.window.thisPlayer = 'O';
            states.game.firstPlayer = 2;
        }
        states.game.started = true;
    } 
    saveState(states.game)

}
async function handleChoice(choice, states) {
    console.log(choice);
    console.log(states);
    states.game.guess = choice;
    if(states.game.flipResult){
        console.log('flip ${states.game.flipResult}');
        if(states.game.flipResult == choice){
            states.window.thisPlayer = 'O';
            states.game.firstPlayer = 1;
        } else {
            states.window.thisPlayer = 'X';
            states.game.firstPlayer = 2;
        }
        states.game.started = true;
    } 
    saveState(states.game)


}
async function fullReset(states){
    states.game = structuredClone(defaultGameState);
    states.window = {thisPlayer: null};
    saveState(states.game);
    drawFirstPlayer(handleFlip, handleChoice, fullReset, states)
}