// A script to lock all games that have already started.
// This script is intended to be run in a Cron Job.
// It will lock all games that have a gameDate earlier than the current date.
// This will prevent any further updates to the game.
// To run this script, you can use the following command:
// node frontend/scripts/lockGames.js
// Make sure to update the path to the script based on your project structure.
import dbConnect from "../lib/db";
import Game from "../models/Game";

const lockGames = async () => {
  await dbConnect();
  const currentDate = new Date().toISOString().split("T")[0];

  try {
    await Game.updateMany({ gameDate: { $lt: currentDate } }, { $set: { locked: true } });
    console.log("✅ Locked all started games.");
  } catch (error) {
    console.error("❌ Failed to lock games:", error);
  }
};

lockGames();