'use client';
import { useState, useEffect } from "react";
import axios from "axios";

export default function UpcomingGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    team: "",
    sort: "asc",
    page: 1,
    limit: 5,
  });

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
          },
        });
        setGames(response.data.games);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching games:", error);
      }
      setLoading(false);
    };

    fetchGames();
  }, [filters]);

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
      </div>

      {/* Display Games */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc pl-5">
          {games.length > 0 ? (
            games.map((game) => (
              <li key={game.GAME_ID} className="mb-2">
                <span className="font-bold">{game.GAME_DATE}:</span>{" "}
                {game.HOME_TEAM_ABBREVIATION} vs {game.AWAY_TEAM_ABBREVIATION}
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
