"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssociateGamePage({ params }) {
  const { gameId } = params;
  const router = useRouter();
  const [nbaGameId, setNbaGameId] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [game, setGame] = useState(null);

  // Fetch game data when the page loads
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/game/${gameId}`);
        if (res.ok) {
          const data = await res.json();
          setGame(data);
        } else {
          console.error("Game not found");
        }
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };

    if (gameId) {
      fetchGame();
    }
  }, [gameId]);

  const handleAssociate = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/game/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, nbaGameId, homeTeam, awayTeam }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to associate NBA game.");
    }
  };
  
  if (!game) return <p className="text-center text-white">Loading game...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Associate NBA Game</h2>
      <p>Game Name: {game.name}</p>
      <form onSubmit={handleAssociate} className="space-y-4">
        <input
          type="text"
          placeholder="NBA Game ID"
          value={nbaGameId}
          onChange={(e) => setNbaGameId(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <input
          type="text"
          placeholder="Home Team"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <input
          type="text"
          placeholder="Away Team"
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          Save NBA Game
        </button>
      </form>
    </div>
  );
}
