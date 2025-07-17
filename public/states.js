import { defaultGameState } from "./startDefault.js";

/*
API managment for Tic Tac Toe accross browsers
Author: Maripi Maluenda
Date: June 29 2025
Description: File System Access API for tic tac toe game in two separate browser instances
*/

export async function loadState(gameState) {
    try {
            const response = await fetch("/gameState");
            if (!response.ok) throw new Error("fetch failed");
            const gameState = await response.json();
            // console.log("gameState received from server:", gameState);
            return gameState;
        } catch (error) {
            console.error("Error fetching gameState:", error);
            return null
    }
}

export async function saveState(gameState) {
    try {
        await fetch("/gameState", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameState),
        });
        console.log("gameState sent to server:", gameState);
    } catch (error) {
        console.error("Error sending gameState:", error);
    }
}

