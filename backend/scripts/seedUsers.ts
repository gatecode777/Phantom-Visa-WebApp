import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/models/User.js";

dotenv.config();

const uri = process.env.DB_URI || process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ DB_URI missing from environment!");
  process.exit(1);
}

const usersToSeed = [
  {
    phone: "+919876543210",
    role: "Admin",
    name: "System Administrator"
  },
  {
    phone: "9876543210",
    role: "Admin",
    name: "System Administrator (Raw)"
  },
  {
    phone: "+910123456789",
    role: "Applicant",
    name: "Default Applicant"
  },
  {
    phone: "0123456789",
    role: "Applicant",
    name: "Default Applicant (Raw)"
  }
];

async function seed() {
  try {
    console.log("🍃 Connecting to MongoDB Atlas...");
    await mongoose.connect(uri);
    console.log("✅ Connected! Seeding Admin & Applicant accounts...");

    for (const u of usersToSeed) {
      await User.findOneAndUpdate(
        { phone: u.phone },
        { ...u },
        { upsert: true, new: true }
      );
      console.log(`👤 Upserted user: ${u.phone} (${u.role})`);
    }

    console.log("🎉 User seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
