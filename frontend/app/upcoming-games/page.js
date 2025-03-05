import UpcomingGames from "../components/UpcomingGames";

export default function GamesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">NBA Betting Games</h1>
      <UpcomingGames />
    </div>
  );
}
