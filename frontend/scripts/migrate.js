import dbConnect from "../lib/db.js";
import mongoose from "mongoose";
import Game from "../models/Game.js";

const migrations = async () => {
  await dbConnect();

  // Fetch the latest schema from MongoDB
  const existingFields = Object.keys(Game.schema.paths);
  const newFields = [
    "nbaGameStatus",
    "homeGameQuarter1",
    "homeGameQuarter2",
    "homeGameQuarter3",
    "homeGameQuarter4",
    "awayGameQuarter1",
    "awayGameQuarter2",
    "awayGameQuarter3",
    "awayGameQuarter4",
  ]; // Add any new fields here

  const missingFields = newFields.filter(
    (field) => !existingFields.includes(field)
  );

  if (missingFields.length === 0) {
    console.log("✅ No migrations needed.");
    process.exit();
  }

  console.log("🚀 Running migrations...");

  // Update only missing fields
  for (const field of missingFields) {
    console.log(`Updating field: ${field}`);
    await Game.updateMany(
      { [field]: { $exists: false } },
      { $set: { [field]: null } }
    );
  }

  console.log("✅ Migration complete.");
  process.exit();
};

migrations();
