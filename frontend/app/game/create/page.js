import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default async function GameCreatePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  const [gameName, setGameName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/game/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: gameName, createdBy: session.user.id }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Failed to create game');
    }
  };

  return (
    <div>
      <h1>Create a New Game</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          required
        />
        <button type="submit">Create Game</button>
      </form>
    </div>
  );
}
