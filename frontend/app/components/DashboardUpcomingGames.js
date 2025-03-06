'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardUpcomingGames({ onSelect }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    team: "",
    sort: "asc",
    page: 1,
    limit: 30,
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

  return (
    <div className="p-4">
      {/* Display Games */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-disc pl-5 flex">
          {games.length > 0 ? (
            games.map((game) => (
              <li key={game.GAME_ID} className="mb-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    onSelect(game)
                  }}
                  className="ml-4 p-2 bg-blue-500 text-white rounded"
                >
                  <span className="font-bold">{game.GAME_DATE}:{" "}{game.HOME_TEAM_ABBREVIATION} vs {game.AWAY_TEAM_ABBREVIATION}</span>
                </button>
              </li>
            ))
          ) : (
            <p>No upcoming games found.</p>
          )}
        </ul>
      )}
    </div>
  );
}
