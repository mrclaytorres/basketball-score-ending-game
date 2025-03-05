"use client";

import React, { useEffect, useState } from "react";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GameCreatePage() {
  const [loading, setLoading] = useState(true);
  const [gameName, setGameName] = useState('');
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/auth/login');
      } else {
        setSession(session);
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) return <p>Loading...</p>;

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
