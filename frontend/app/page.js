export default function HomePage() {
  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">Welcome to the Game!</h2>
      <p className="mb-4">Track NBA scores and pick your winning slots.</p>
      <a href="/scores">
        <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
          View Scores
        </button>
      </a>
    </div>
  );
}