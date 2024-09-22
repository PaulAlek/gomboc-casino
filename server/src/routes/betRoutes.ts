import express from "express";
import { placeBetController } from "../controllers/betController";

const router = express.Router();

// POST route to place a bet
router.post("/place", placeBetController);

export default router;
