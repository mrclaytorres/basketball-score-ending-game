"use client";

import React, { useEffect, useState } from "react";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import DashboardUpcomingGames from "../components/DashboardUpcomingGames";
import UpdateSelectedSchedule from "../components/UpdateSelectedSchedule";
import RightSidebar from "../components/RightSidebar";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      console.log("Session:", session);
      if (!session) {
        router.push('/auth/login');
      } else {
        setSession(session);
        fetchGames(session.user.id);
      }
    };

    checkSession();
  }, [router]);

  // Fetch games for the current user and store it in state
  const fetchGames = async (userId) => {
    try {
      const res = await fetch(`/api/game/list`);
      if (res.ok) {
        const data = await res.json();
        setGames(data);
        console.log(data)
      } else {
        console.error("Failed to fetch games:", res.status, res.statusText);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignGame = async (gameId, selectedGame) => {
    if (!selectedGame) {
      alert("Please select an NBA game first.");
      return;
    }

    try {
      const res = await fetch(`/api/game/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          nbaGameId: selectedGame.GAME_ID,
          homeTeam: selectedGame.HOME_TEAM_ABBREVIATION,
          homeTeamName: selectedGame.HOME_TEAM_NAME,
          homeTeamCity: selectedGame.HOME_TEAM_CITY,
          homeTeamSlug: selectedGame.HOME_TEAM_SLUG,
          awayTeam: selectedGame.AWAY_TEAM_ABBREVIATION,
          awayTeamName: selectedGame.AWAY_TEAM_NAME,
          awayTeamCity: selectedGame.AWAY_TEAM_CITY,
          awayTeamSlug: selectedGame.AWAY_TEAM_SLUG,
          gameDate: selectedGame.GAME_DATE,
          gameTime: selectedGame.GAME_TIME,
        }),
      });

      if (res.ok) {
        fetchGames();
      } else {
        console.error("Failed to assign NBA game:", res.status, res.statusText);
      }
    } catch (error) {
      console.error("Error assigning NBA game:", error);
    }
  };

  const handleDeleteGame = async (gameId) => {

    // Remove game from UI first for a smooth fadeout transition
    setGames((prevGames) => prevGames.filter((game) => game._id !== gameId));
    
    try {
      const res = await fetch(`/api/game/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId
        }),
      });

      if (!res.ok) {
        console.error("Failed to delete game:", res.status, res.statusText);
        // Revert UI change if delete fails
        fetchGames();
      } else {
        // Delay re-fetching to allow animation to complete
        setTimeout(() => fetchGames(), 3000);
      }

    } catch (error) {
      console.error("Request failed:", error);
      // Revert UI change if request fails
      fetchGames();
    }
  }
  
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-[#252422] min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">My Created Games</h1>

        <div className="flex justify-center mb-6">
          <Link href="/game/create">
            <button className="px-4 py-2 bg-[#eb5e28] hover:bg-[#e2501b] text-white font-semibold rounded-lg shadow-md transition">
              Create New Game
            </button>
          </Link>
        </div>

        {games.length > 0 ? (
          <AnimatePresence>
            <ul className="space-y-4">
              {games.map((game) => (
                <motion.li
                  key={game._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.9 }}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg"
                >
                  <Link href={`/game/playing/${game._id}`}>
                    <div className="cursor-pointer flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">{game.name}</h2>
                        <p className="text-sm text-gray-400">
                          Created At: {new Date(game.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteGame(game._id);
                          }}
                          className="ml-4 p-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                        > Delete Game</button>
                      </div>
                    </div>
                  </Link>

                  {game.nbaGameId ? (
                    <>
                      <UpdateSelectedSchedule key={game.nbaGameId} gameSelected={game} />
                      <p className="text-yellow-500 mt-2">Choose a different game schedule:</p>
                      <div className="overflow-x-auto whitespace-nowrap flex space-x-4 mt-2 p-2 rounded-lg">
                        <DashboardUpcomingGames
                          onSelect={(selectedGame) => {
                            handleAssignGame(game._id, selectedGame)
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-yellow-500 mt-2">Assign an NBA Game:</p>
                      <div className="overflow-x-auto whitespace-nowrap flex space-x-4 mt-2 p-2 bg-gray-700 rounded-lg">
                        <DashboardUpcomingGames
                          onSelect={(selectedGame) => {
                            handleAssignGame(game._id, selectedGame)
                          }}
                        />
                      </div>
                    </>
                  )}
                </motion.li>
              ))}

            </ul>
          </AnimatePresence>
        ) : (
          <p className="text-center text-gray-400">No games found.</p>
        )}
      </div>
      <RightSidebar />
    </>
  );
}
