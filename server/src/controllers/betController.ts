import { Request, Response } from "express";
import { createConnection } from "../config/db";

function riggedOdds(odds: number): boolean {
    const randomNumber = Math.random();

    if (randomNumber <= odds) {
        return true;
    } else {
        return false;
    }
}

export const placeBetController = async (req: Request, res: Response) => {
    const { bet_amount, guess } = req.body;

    if (guess < 1 || guess > 6) {
        return res
            .status(400)
            .json({ error: "Guess must be between 1 and 6 inclusive" });
    }

    try {
        const db = await createConnection();

        // Fetch the current game for user_id = 1 (assuming there's only one user)
        const game = await db.get(
            "SELECT * FROM games WHERE user_id = 1 AND current_game = 1"
        );
        if (!game) {
            return res.status(400).json({ error: "No current game found." });
        }

        // Get the user's current balance
        const user = await db.get("SELECT * FROM users WHERE id = 1");
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (bet_amount > user.balance) {
            return res
                .status(400)
                .json({ error: "Bet amount exceeds current balance." });
        }

        // Generate a random dice roll (1-6)
        let diceRoll = Math.floor(Math.random() * 6) + 1;
        console.log(diceRoll);

        // Win or Lose rules
        if (user.balance >= 5000 && user.balance < 10000) {
            const rigged = riggedOdds(0.3);
            console.log("is it riggerd?");
            console.log(rigged);
            if (rigged && guess === diceRoll) {
                diceRoll = Math.floor(Math.random() * 6) + 1;
                console.log("second dice role");
                console.log("diceRoll");
            }
        } else if (user.balance >= 10000) {
            const rigged = riggedOdds(0.5);
            if (rigged && guess === diceRoll) {
                diceRoll = Math.floor(Math.random() * 6) + 1;
            }
        }

        // Determine win or lose
        const win = guess === diceRoll;
        const start_balance = user.balance;
        let end_balance = win
            ? start_balance + bet_amount * 5
            : start_balance - bet_amount;

        if (end_balance <= 0) {
            // Game over
            end_balance = 0;
        }

        // Insert the bet into the bets table
        await db.run(
            "INSERT INTO bets (game_id, time, bet_amount, start_balance, end_balance, win) VALUES (?, ?, ?, ?, ?, ?)",
            [
                game.game_id,
                new Date().toISOString(),
                bet_amount,
                start_balance,
                end_balance,
                win,
            ]
        );

        if (end_balance === 0) {
            // Game over. Reset the game
            await db.run(
                "UPDATE games SET current_game = 0 WHERE user_id = 1 AND current_game = 1"
            );

            await db.run("UPDATE users SET balance = 1000 WHERE id = 1");

            const result = await db.run(
                "INSERT INTO games (user_id, time, current_game) VALUES (?, ?, ?)",
                [1, new Date().toISOString(), true]
            );

            const newGame = await db.get(
                "SELECT * FROM games WHERE game_id = ?",
                [result.lastID]
            );

            return res.status(200).json({
                new_balance: 1000,
                win: win ? true : false,
                game_end: true,
                game_id: newGame.game_id,
                dice_roll: diceRoll,
            });
        } else {
            // Update the user's balance
            await db.run("UPDATE users SET balance = ? WHERE id = 1", [
                end_balance,
            ]);

            // Return the new balance and result (win/lose)
            return res.status(200).json({
                new_balance: end_balance,
                win: win ? true : false,
                game_end: false,
                game_id: game.game_id,
                dice_roll: diceRoll,
            });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while placing the bet." });
    }
};
