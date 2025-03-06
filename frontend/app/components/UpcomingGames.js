'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UpcomingGames({ onSelect }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    team: "",
    sort: "asc",
    page: 1,
    limit: 10,
    start_date: "",
    end_date: ""
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
            end_date: filters.end_date
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
    router.push(`/game/create?gameId=${game.GAME_ID}&homeTeam=${game.HOME_TEAM_ABBREVIATION}&awayTeam=${game.AWAY_TEAM_ABBREVIATION}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upcoming NBA Games</h2>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
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
          onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
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
          onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value) })}
          className="border p-2"
        >
          {[10, 25, 50, 100, 500].map((limit) => (
            <option key={limit} value={limit}>{limit} per page</option>
          ))}
        </select>
      </div>

      {/* Display Games */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc pl-5">
          {games.length > 0 ? (
            games.map((game) => (
              <li key={game.GAME_ID} className="mb-2 flex items-center justify-between">
                <span className="font-bold">{game.GAME_DATE}:{" "}{game.HOME_TEAM_ABBREVIATION} vs {game.AWAY_TEAM_ABBREVIATION}</span>
                <button
                  onClick={() => {
                    handleCreateGame(game)
                    onSelect(game)
                  }}
                  className="ml-4 p-2 bg-blue-500 text-white rounded"
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
          className="border p-2 bg-gray-200"
        >
          Prev
        </button>
        <button
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          className="border p-2 bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
