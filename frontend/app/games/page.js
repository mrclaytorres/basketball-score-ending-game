
'use client';

import React, { useEffect, useState } from "react";

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

  if (loading) return <p>Loading games...</p>;

  return (
    <div>
      <h2>Available Games</h2>
      {games.length === 0 ? (
        <p>No games available.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game._id}>
              <h3>{game.name}</h3>
              <p>{game.homeTeam} vs {game.awayTeam} - {game.gameDate}</p>
              <a href={`/game/playing/${game._id}`}>Join Game</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GamesList;
