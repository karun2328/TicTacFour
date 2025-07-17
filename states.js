import { defaultGameState } from "./startDefault.js";

/*
API managment for Tic Tac Toe accross browsers
Author: Maripi Maluenda
Date: June 29 2025
Description: File System Access API for tic tac toe game in two separate browser instances
*/
let fileHandle = null;
const GAME_FILE_TYPE = {
    description: "Game State",
    accept: {
        "application/json": [".json"],
    },
};
export async function loadState(gameState) {
    if (!fileHandle) {
        return gameState;
    }
    const file = await fileHandle.getFile();
    const content = await file.text();
    try {
        return content.trim() ? JSON.parse(content) : gameState;
    } catch {
        console.warn("failed parse");
        return gameState;
    }
}
export async function saveState(gameState) {
    if (!fileHandle) {
        return gameState;
    }
    console.log("saving");
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(gameState, null, 2));
    await writable.close();
    return gameState;
}

export async function createFile(gameState, windowState) {
    //https://developer.chrome.com/docs/capabilities/web-apis/file-system-access
    console.log("Creating a file");
    fileHandle = await window.showSaveFilePicker({
        suggestedName: "gameState.json",
        types: [GAME_FILE_TYPE],
    });
    await saveState(defaultGameState);

    gameState.fileOpened = gameState.fileOpened + 1;
    windowState.thisWindow = 2;
    const writable = await fileHandle.createWritable();
    await writable.write({
        type: "write",
        data: JSON.stringify(gameState, null, 2),
        position: 0,
    });
    await writable.close();

    const file = await fileHandle.getFile();
    const content = await file.text();
    console.log(content);
    windowState.fileOpened = true;
    console.log(windowState);
    let btn2 = document.getElementById("btn2");
    btn2.classList.add("hidden");
}

export async function openFile(gameState, windowState) {
    //https://developer.chrome.com/docs/capabilities/web-apis/file-system-access

    [fileHandle] = await window.showOpenFilePicker({
        types: [GAME_FILE_TYPE],
    });
    loadState(gameState);
    gameState.fileOpened = gameState.fileOpened + 1;
    windowState.thisWindow = 1;
    const writable = await fileHandle.createWritable();
    await writable.write({
        type: "write",
        data: JSON.stringify(gameState, null, 2),
        position: 0,
    });
    await writable.close();

    const file = await fileHandle.getFile();
    const content = await file.text();
    console.log(content);
    windowState.fileOpened = true;
    console.log(windowState);
    let btn2 = document.getElementById("btn2");
    btn2.classList.add("hidden");
}
