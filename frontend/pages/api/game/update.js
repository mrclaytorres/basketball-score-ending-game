// pages/api/game/update.js
import dbConnect from "@/lib/db";
import Game from "@/models/Game";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();

  try {
    const {
      gameId,
      nbaGameId,
      homeTeam,
      homeTeamName,
      homeTeamCity,
      homeTeamSlug,
      awayTeam,
      awayTeamName,
      awayTeamCity,
      awayTeamSlug,
      gameDate,
      gameTime,
      nbaGameStatus,
      homeGameQuarter1,
      homeGameQuarter2,
      homeGameQuarter3,
      homeGameQuarter4,
      awayGameQuarter1,
      awayGameQuarter2,
      awayGameQuarter3,
      awayGameQuarter4,
    } = req.body;

    if (!gameId) {
      return res.status(400).json({ message: "Missing gameId" });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (game.createdBy.toString() !== session.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // If an NBA game is being associated, ensure necessary fields are provided
    if (nbaGameId && homeTeam && awayTeam && gameDate) {
      game.nbaGameId = nbaGameId;
      game.homeTeam = homeTeam;
      game.homeTeamName = homeTeamName;
      game.homeTeamCity = homeTeamCity;
      game.homeTeamSlug = homeTeamSlug;
      game.awayTeam = awayTeam;
      game.awayTeamName = awayTeamName;
      game.awayTeamCity = awayTeamCity;
      game.awayTeamSlug = awayTeamSlug;
      game.gameDate = gameDate;
      game.gameTime = gameTime;
      game.nbaGameStatus = nbaGameStatus;
      game.homeGameQuarter1 = homeGameQuarter1;
      game.homeGameQuarter2 = homeGameQuarter2;
      game.homeGameQuarter3 = homeGameQuarter3;
      game.homeGameQuarter4 = homeGameQuarter4;
      game.awayGameQuarter1 = awayGameQuarter1;
      game.awayGameQuarter2 = awayGameQuarter2;
      game.awayGameQuarter3 = awayGameQuarter3;
      game.awayGameQuarter4 = awayGameQuarter4;
    }

    await game.save();
    res.status(200).json({ message: "Game updated successfully", game });
  } catch (error) {
    res.status(500).json({ message: "Failed to update game", error });
  }
}
