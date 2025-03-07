'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      <p className="text-green-400 flex gap-3 items-center"><Image src={`/assets/logo/${game.homeTeam}.svg`} width={50} height={50} alt={`${game.homeTeam}`}/>{game.homeTeam} vs {game.awayTeam}<Image src={`/assets/logo/${game.awayTeam}.svg`} width={50} height={50} alt={`${game.awayTeam}`}/></p>
    </div>
  )
}