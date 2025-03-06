'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdateSelectedSchedule({ gameSelected }) {
  const [game, setGame] = useState(gameSelected);
  const router = useRouter();

  useEffect(() => {
    setGame(gameSelected);
  }
  , [gameSelected]);

  return(
    <div key={game?.nbaGameId}>
      <p className="text-green-400">Game Date: {game.gameDate}</p>
      <p className="text-green-400">{game.homeTeam} vs {game.awayTeam}</p>
    </div>
  )
}