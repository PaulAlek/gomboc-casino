import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open the database connection
export const createConnection = async () => {
    const db = await open({
        filename: "./database.db", // SQLite database file
        driver: sqlite3.Database,
    });

    // Create the User table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      balance REAL NOT NULL
    )
  `);

    // Create the Game table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      game_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      time TEXT NOT NULL,
      current_game BOOLEAN NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

    // Create the Bet table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS bets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      time TEXT NOT NULL,
      bet_amount REAL NOT NULL,
      start_balance REAL NOT NULL,
      end_balance REAL NOT NULL,
      win BOOLEAN NOT NULL,
      FOREIGN KEY (game_id) REFERENCES games(game_id)
    )
  `);

    // Insert default user if not already exists
    let user = await db.get("SELECT * FROM users WHERE id = 1");
    if (!user) {
        await db.run("INSERT INTO users (balance) VALUES (?)", [1000.0]); // Default balance of 1000.0
        user = await db.get("SELECT * FROM users WHERE id = 1"); // Fetch the newly created user
    }

    // Check if a game with current_game = true exists for the default user
    const currentGame = await db.get(
        "SELECT * FROM games WHERE user_id = 1 AND current_game = 1"
    );
    if (!currentGame) {
        // Insert a default game for the default user with current_game = true
        await db.run(
            "INSERT INTO games (user_id, time, current_game) VALUES (?, ?, ?)",
            [1, new Date().toISOString(), true]
        );
    }

    return db;
};
