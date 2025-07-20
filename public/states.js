// states.js
// Handles saving and loading the game state to/from localStorage

const STORAGE_KEY = "tic-tac-two-state";

/**
 * Save game state to storage
 * @param {Object} state - Game state object to be saved
 */
export async function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save state:", e);
    }
}

/**
 * Load game state from storage
 * @returns {Object|null} - Loaded game state or null if not found
 */
export async function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.error("Failed to load state:", e);
        return null;
    }
}
