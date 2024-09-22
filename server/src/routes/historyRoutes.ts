import express from "express";
import { getGameHistory } from "../controllers/getGameHistory";

const router = express.Router();

// GET route to fetch all game histories for the user
router.get("/games", getGameHistory);

export default router;
