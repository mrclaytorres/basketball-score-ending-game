import dbConnect from "../lib/db.js";
import mongoose from "mongoose";
import User from "../models/User.js";

const migrations = async () => {
  await dbConnect();

  // Fetch the latest schema from MongoDB
  const existingFields = Object.keys(User.schema.paths);
  const newFields = [
    "resetPasswordToken",
    "resetPasswordExpires",
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
    await User.updateMany(
      { [field]: { $exists: false } },
      { $set: { [field]: null } }
    );
  }

  console.log("✅ Migration complete.");
  process.exit();
};

migrations();
