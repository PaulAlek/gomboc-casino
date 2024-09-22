import express, { Application, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createConnection } from "./config/db";
import gameRoutes from "./routes/gameRoutes";
import betRoutes from "./routes/betRoutes";
import historyRoutes from "./routes/historyRoutes";

const app: Application = express();
const PORT = 5050;

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PATCH,DELETE",
        credentials: true,
    })
);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use the game routes
app.use("/games", gameRoutes);
app.use("/bets", betRoutes);
app.use("/history", historyRoutes);

// Connect to the SQLite database and start the server
createConnection()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
    });
