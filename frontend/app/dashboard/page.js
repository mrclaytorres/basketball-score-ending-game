"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import DashboardUpcomingGames from "../components/DashboardUpcomingGames";
import UpdateSelectedSchedule from "../components/UpdateSelectedSchedule";
import RightSidebar from "../components/RightSidebar";
import { getCurrentESTTime, getCurrentESTDate, toDateTime } from "../utils/dateUtils";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [removingGameIds, setRemovingGameIds] = useState(new Set());
  const currentESTDate = getCurrentESTDate();
  const currentESTTime = getCurrentESTTime();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
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
    // Mark game for removal to trigger exit animation
    setRemovingGameIds((prev) => new Set(prev).add(gameId));

    try {
      const res = await fetch(`/api/game/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
        }),
      });

      if (!res.ok) {
        console.error("Failed to delete game:", res.status, res.statusText);

        // Revert UI change if delete fails
        setRemovingGameIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(gameId);
          return newSet;
        });
      } else {
        // Wait for animation before actually removing from state
        setTimeout(() => {
          setGames((prevGames) =>
            prevGames.filter((game) => game._id !== gameId)
          );
          setRemovingGameIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(gameId);
            return newSet;
          });
        }, 900); // Match the exit animation duration
      }
    } catch (error) {
      console.error("Request failed:", error);
      // Revert UI change if request fails
      setRemovingGameIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-[#252422] min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">
          My Created Games
        </h1>

        <div className="flex justify-center mb-6 w-full gap-4">
          <Link href="/game/create" className="w-full sm:w-1/2">
            <button className="px-4 py-2 bg-[#eb5e28] hover:bg-[#e2501b] text-white font-semibold rounded-lg shadow-md transition w-full py-5">
              Create New Game
            </button>
          </Link>
          <Link href="/games" className="w-full sm:w-1/2">
            <button className="px-4 py-2 bg-[#eb5e28] hover:bg-[#e2501b] text-white font-semibold rounded-lg shadow-md transition w-full py-5">
              Join a Game
            </button>
          </Link>
        </div>

        {games.length > 0 ? (
          <ul className="space-y-4">
            <AnimatePresence>
              {games
                .filter((game) => !removingGameIds.has(game._id)) // Prevent immediate removal
                .map((game) => (
                  <motion.li
                    key={game._id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.9 }}
                    className="bg-gray-800 p-4 rounded-lg shadow-lg"
                  >
                    <Link href={`/game/playing/${game._id}`}>
                      <div className="cursor-pointer flex flex-col-reverse justify-between sm:flex-row">
                        <div>
                          <h2 className="text-lg font-semibold text-left">{game.name}</h2>
                          <p className="text-sm text-gray-400 text-left">
                            Created At:{" "}
                            {new Date(game.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteGame(game._id);
                            }}
                            className="ml-4 p-2 bg-gray-600 hover:bg-gray-600 text-white rounded opacity-50 hover:opacity-100"
                          >
                            {" "}
                            Delete Game
                          </button>
                        </div>
                      </div>
                    </Link>

                    {game.nbaGameId ? (
                      <>
                        <UpdateSelectedSchedule
                          key={game.nbaGameId}
                          gameSelected={game}
                        />
                        <p className="text-yellow-500 mt-2">
                          {toDateTime(game.gameDate, game.gameTime) < toDateTime(currentESTDate, currentESTTime)
                            ? "Game already started."
                            : "Choose a different game schedule:"}
                        </p>

                        {!(
                          toDateTime(game.gameDate, game.gameTime) < toDateTime(currentESTDate, currentESTTime)
                        ) && (
                          <div className="overflow-x-auto whitespace-nowrap flex space-x-4 mt-2 p-2 rounded-lg">
                            <DashboardUpcomingGames
                              onSelect={(selectedGame) => handleAssignGame(game._id, selectedGame)}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-yellow-500 mt-2">
                          Assign an NBA Game:
                        </p>
                        <div className="overflow-x-auto whitespace-nowrap flex space-x-4 mt-2 p-2 bg-gray-700 rounded-lg">
                          <DashboardUpcomingGames
                            onSelect={(selectedGame) => {
                              handleAssignGame(game._id, selectedGame);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </motion.li>
                ))}
            </AnimatePresence>
          </ul>
        ) : (
          <p className="text-center text-gray-400">No games found.</p>
        )}
      </div>
      <RightSidebar />
    </>
  );
}
