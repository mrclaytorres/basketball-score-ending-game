"use client";

import React, { useEffect, useState } from "react";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      console.log("Session:", session);
      if (!session) {
        router.push('/auth/login');
      } else {
        setSession(session);
        fetchGames(session.user.id);
      }
    };

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

    checkSession();
  }, [router]);
  
  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">My Created Games</h1>

      <div className="flex justify-center mb-6">
        <Link href="/game/create">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition">
            Create New Game
          </button>
        </Link>
      </div>

      {games.length > 0 ? (
        <ul className="space-y-4">
          {games.map((game) => (
            <li key={game._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">{game.name}</h2>
              <p className="text-sm text-gray-400">
                Created At: {new Date(game.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No games found.</p>
      )}
    </div>
  );
}
