"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import RightSidebar from "./RightSidebar";

export default function UpcomingGames({ onSelect }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    team: "",
    sort: "asc",
    page: 1,
    limit: 10,
    start_date: "",
    end_date: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/game/upcoming-games", {
          params: {
            team_abbreviation: filters.team,
            sort_order: filters.sort,
            page: filters.page,
            limit: filters.limit,
            start_date: filters.start_date,
            end_date: filters.end_date,
          },
        });
        setGames(response.data.games.upcoming_games);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
      setLoading(false);
    };

    fetchGames();
  }, [filters]);

  const handleCreateGame = (game) => {
    router.push(
      `/game/create?gameId=${game.GAME_ID}&homeTeam=${game.HOME_TEAM_ABBREVIATION}&homeTeamName=${game.HOME_TEAM_NAME}&homeTeamSlug=${game.HOME_TEAM_SLUG}&homeTeamCity=${game.HOME_TEAM_CITY}&awayTeam=${game.AWAY_TEAM_ABBREVIATION}&awayTeamName=${game.AWAY_TEAM_NAME}&awayTeamCity=${game.AWAY_TEAM_CITY}&awayTeamSlug=${game.AWAY_TEAM_SLUG}&gameDate=${game.GAME_DATE}&gameTime=${game.GAME_TIME}`
    );
  };

  return (
    <>
      <div className="p-0 sm:p-4">
        <h2 className="text-xl font-bold mb-4">Upcoming NBA Games</h2>

        {/* Filters */}
        <div className="mb-10 sm:mb-4 grid sm:flex gap-4">
          <input
            type="text"
            placeholder="Filter by team (e.g., LAL)"
            value={filters.team}
            onChange={(e) => setFilters({ ...filters, team: e.target.value })}
            className="border p-2"
          />
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="border p-2"
          >
            <option value="asc">Oldest First</option>
            <option value="desc">Newest First</option>
          </select>
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) =>
              setFilters({ ...filters, start_date: e.target.value })
            }
            className="border p-2"
          />
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
            className="border p-2"
          />
          <select
            value={filters.limit}
            onChange={(e) =>
              setFilters({ ...filters, limit: Number(e.target.value) })
            }
            className="border p-2"
          >
            {[10, 25, 50, 100, 500].map((limit) => (
              <option key={limit} value={limit}>
                {limit} per page
              </option>
            ))}
          </select>
        </div>

        {/* Display Games */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="list-disc sm:pl-5">
            {games.length > 0 ? (
              games.map((game) => (
                <li
                  key={game.GAME_ID}
                  className="mb-2 grid sm:flex items-center sm:justify-between"
                >
                  <div className="font-bold grid gap-3 items-center m-10 sm:m-5 sm:flex">
                    <div className="text-center">{game.GAME_DATE}:</div> 
                    <div className="flex items-center text-2xl justify-between sm:text-base sm:justify-normal">
                      <Image className="mr-2" src={`/assets/logo/${game.HOME_TEAM_ABBREVIATION}.svg`} width={50} height={50} alt={`${game.HOME_TEAM_ABBREVIATION}`}/>{game.HOME_TEAM_ABBREVIATION} vs{" "}
                      {game.AWAY_TEAM_ABBREVIATION}<Image className="ml-2" src={`/assets/logo/${game.AWAY_TEAM_ABBREVIATION}.svg`} width={50} height={50} alt={`${game.AWAY_TEAM_ABBREVIATION}`}/>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleCreateGame(game);
                      onSelect(game);
                    }}
                    className="sm:ml-4 p-2 bg-[#eb5e28] text-white rounded"
                  >
                    Create Betting Game
                  </button>
                </li>
              ))
            ) : (
              <p>No upcoming games found.</p>
            )}
          </ul>
        )}

        {/* Pagination Controls */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
            className="border p-2 bg-gray-800"
          >
            Prev
          </button>
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            className="border p-2 bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>
      <RightSidebar />
    </>
  );
}
