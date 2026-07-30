import mongoose from "mongoose";
import dns from "node:dns/promises"

dns.setServers(["1.1.1.1"]);

export async function connectDB(): Promise<typeof mongoose | undefined> {
  const uri = process.env.DB_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MongoDB connection error: DB_URI is not defined in environment variables.");
    return undefined;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    // Don't crash process, allow server to log failure
    return undefined;
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB connection lost. Retrying...");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Connection Error:", err);
});
