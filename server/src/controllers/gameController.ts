import { createConnection } from "../config/db";

// Function to set up the game
export const setupGame = async () => {
    const db = await createConnection();

    // Check if a default user exists
    let user = await db.get("SELECT * FROM users WHERE id = 1");
    if (!user) {
        throw new Error("User not found");
    }

    // Check if a current game exists for the user
    let game = await db.get(
        "SELECT * FROM games WHERE user_id = 1 AND current_game = 1"
    );

    // If no current game exists, create a new game
    if (!game) {
        const result = await db.run(
            "INSERT INTO games (user_id, time, current_game) VALUES (?, ?, ?)",
            [1, new Date().toISOString(), true]
        );
        game = await db.get("SELECT * FROM games WHERE game_id = ?", [
            result.lastID,
        ]);
    }

    // Return the game_id, user_id, and balance
    return {
        game_id: game.game_id,
        user_id: user.id,
        balance: user.balance,
    };
};

// Withdraw reset the game
export const resetGame = async () => {
    const db = await createConnection();

    // Mark the current game as inactive
    await db.run(
        "UPDATE games SET current_game = 0 WHERE user_id = 1 AND current_game = 1"
    );
    // Create a new game and set it as active
    const result = await db.run(
        "INSERT INTO games (user_id, time, current_game) VALUES (?, ?, ?)",
        [1, new Date().toISOString(), true]
    );
    // Update the user's balance to 1000
    await db.run("UPDATE users SET balance = (?) WHERE id = 1", [1000.0]);

    // Fetch the user's updated balance
    const user = await db.get("SELECT * FROM users WHERE id = 1");
    if (!user) {
        throw new Error("User not found.");
    }

    // Fetch the new game
    const newGame = await db.get("SELECT * FROM games WHERE game_id = ?", [
        result.lastID,
    ]);

    // Return the new game_id and user's balance
    return {
        new_game_id: newGame.game_id,
        balance: user.balance,
    };
};
