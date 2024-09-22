import express from "express";
import { setupGame, resetGame } from "../controllers/gameController";

const router = express.Router();

// Route to set up the game for the user
router.get("/setup", async (req, res) => {
    try {
        const gameData = await setupGame();
        res.status(200).json(gameData);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Route to reset the game (withdraw and start a new one)
router.patch("/reset", async (req, res) => {
    try {
        const gameData = await resetGame();
        res.status(200).json(gameData);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
