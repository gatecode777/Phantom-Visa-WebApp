import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./lib/db.js";
import applicationsRouter from "./routes/applications.js";
import authRouter from "./routes/auth.js";
import financeRouter from "./routes/finance.js";
import walletRouter from "./routes/wallet.js";
import applicantRouter from "./routes/applicant.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (allow requests with credentials for cookies and production frontend deployments)
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /\.onrender\.com$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static uploads directory for document links
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
app.use("/api/v1/applicant", applicantRouter);

app.listen(PORT, () => {
  console.log(`⚡ Phantom Visa OS Backend running on http://localhost:${PORT}`);
});
