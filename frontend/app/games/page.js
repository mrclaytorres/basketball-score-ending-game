
'use client';

import React, { useEffect, useState } from "react";
import RightSidebar from "../components/RightSidebar";
import Image from "next/image";
import { formatToEST } from "../utils/dateUtils";

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("/api/games");
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <p className="text-center text-white">Loading games...</p>;

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-[#252422] text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Available Games</h2>
        {games.length === 0 ? (
          <p className="text-center text-gray-400">No games available.</p>
        ) : (
          <ul className="space-y-4">
            {games.map((game) => (
              <li key={game._id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold">{game.name}</h3>
                    <p className="text-right">Host: {game.createdBy?.name}</p>
                  </div>
                  <p className="text-gray-300 flex gap-2 items-center py-5 font-semibold justify-center sm:justify-normal"><Image src={`/assets/logo/${game.homeTeam}.svg`} width={50} height={50} alt={`${game.homeTeam}`}/>{game.homeTeam} vs {game.awayTeam}<Image src={`/assets/logo/${game.awayTeam}.svg`} width={50} height={50} alt={`${game.awayTeam}`}/></p>
                  <p className="text-gray-300 flex gap-2 items-center pb-3 justify-center sm:justify-normal">{game.gameDate} {game.gameTime ? `- ${formatToEST(game.gameTime)}` : null}</p>
                  <a href={`/game/playing/${game._id}`} 
                    className="mt-2 bg-[#eb5e28] hover:bg-[#e2501b] text-white px-4 py-2 rounded transition flex justify-center sm:inline-block sm:justify-normal"
                  >
                    Join Game
                    </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <RightSidebar />
    </>
  );
};

export default GamesList;
