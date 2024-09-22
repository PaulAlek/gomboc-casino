import { Request, Response } from "express";
import { createConnection } from "../config/db";

// Function to fetch game history
export const getGameHistory = async (req: Request, res: Response) => {
    try {
        const db = await createConnection();

        // Fetch all games for user_id = 1 and order by time in reverse chronological order
        const games = await db.all(
            "SELECT game_id, time, current_game FROM games WHERE user_id = 1 ORDER BY time DESC"
        );

        if (!games || games.length === 0) {
            return res
                .status(404)
                .json({ error: "No games found for this user." });
        }

        // Organize each game separately
        const gameHistory = await Promise.all(
            games.map(async (game) => {
                // Optionally fetch associated bets for each game
                const bets = await db.all(
                    "SELECT * FROM bets WHERE game_id = ?",
                    [game.game_id]
                );

                return {
                    game_id: game.game_id,
                    time: game.time,
                    current_game: game.current_game,
                    bets: bets.length ? bets : [],
                };
            })
        );

        // Return the organized game history
        return res.status(200).json({
            game_history: gameHistory,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "An error occurred while fetching the game history.",
        });
    }
};
