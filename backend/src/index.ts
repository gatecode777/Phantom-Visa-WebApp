import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "./lib/db.js";
import applicationsRouter from "./routes/applications.js";
import authRouter from "./routes/auth.js";
import financeRouter from "./routes/finance.js";
import walletRouter from "./routes/wallet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize MongoDB Connection
connectDB();

// Healthcheck endpoint
app.get("/api/health", (req, res) => {
  const dbStatusMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  res.status(200).json({
    status: "healthy",
    database: dbStatusMap[mongoose.connection.readyState] || "unknown",
    timestamp: new Date().toISOString()
  });
});

// API v1 Routes
app.use("/api/v1/applications", applicationsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/finance", financeRouter);
app.use("/api/v1/wallet", walletRouter);

app.listen(PORT, () => {
  console.log(`⚡ Phantom Visa OS Backend running on http://localhost:${PORT}`);
});
