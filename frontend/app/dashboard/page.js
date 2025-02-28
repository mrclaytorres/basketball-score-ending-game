import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/game/list`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const games = await res.json();

  return (
    <div>
      <h1>My Created Games</h1>
      <Link href="/game/create">
        <button>Create New Game</button>
      </Link>
      <ul>
        {games.map((game) => (
          <li key={game._id}>
            {game.name} - Created At: {new Date(game.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
