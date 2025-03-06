import dbConnect from "../lib/db.js";
import mongoose from "mongoose";
import Game from "../models/Game.js";

const migrations = async () => {
  await dbConnect();

  console.log("🚀 Running migrations...");

  // Convert old slots format (array of strings) to new format (array of objects)
  // const games = await Game.find({});
  
  // for (const game of games) {
  //   if (Array.isArray(game.slots) && game.slots.every(s => typeof s === "string")) {
  //     console.log(`Updating game: ${game._id}`);
      
  //     // Convert slot array from ["", "", ""] → [{ slot: 0, userId: null }, { slot: 1, userId: null }, ...]
  //     const newSlots = game.slots.map((_, i) => ({ slot: i, userId: null }));

  //     await Game.updateOne({ _id: game._id }, { $set: { slots: newSlots } });
  //   }
  // }

  // Fetch the latest schema from MongoDB
  const existingFields = Object.keys(Game.schema.paths);
  const newFields = ["locked"]; // Add any new fields here

  const missingFields = newFields.filter((field) => !existingFields.includes(field));

  if (missingFields.length === 0) {
    console.log("✅ No missing fields, migrations not needed.");
    process.exit();
  }

  // Update only missing fields
  for (const field of missingFields) {
    console.log(`Updating field: ${field}`);
    await Game.updateMany({ [field]: { $exists: false } }, { $set: { [field]: null } });
  }

  console.log("✅ Migration complete.");
  process.exit();
};

migrations();
