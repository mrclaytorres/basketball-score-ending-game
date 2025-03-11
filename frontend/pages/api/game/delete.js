// pages/api/game/create.js
import dbConnect from "@/lib/db";
import Game from "@/models/Game";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("Received request to delete game:", req.body);

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.error("Unauthorized access attempt");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const {
    gameId
  } = req.body;

  if (!gameId) {
    console.error("Missing gameId");
    return res
      .status(400)
      .json({ message: "Game ID is required" });
  }

  await dbConnect();

  try {
    const deletedGame = await Game.findByIdAndDelete(gameId);

    if (!deletedGame) {
      return res.status(404).json({ message: "Game not found" });
    }

    console.log("Game successfully deleted:", deletedGame);
    res.status(201).json({ message: "Game deleted", game: deletedGame });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Failed to delete game" });
  }
}
