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
