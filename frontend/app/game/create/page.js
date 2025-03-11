"use client";

import React, { useEffect, useState, Suspense } from "react";
import { getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import RightSidebar from "@/app/components/RightSidebar";

export default function GameCreatePage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const router = useRouter();
  
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

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create a Betting Game</h1>
        {/* Suspense wrapper for search params */}
        <Suspense fallback={<p>Loading game details...</p>}>
          <GameCreateForm session={session} />
        </Suspense>
      </div>
      <RightSidebar />
    </>
  );
}

// Extracted component
function GameCreateForm({ session }) {
  const [gameName, setGameName] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams(); //Now inside a Suspense boundary

  const gameId = searchParams.get("gameId");
  const homeTeam = searchParams.get("homeTeam");
  const homeTeamName = searchParams.get("homeTeamName");
  const homeTeamCity = searchParams.get("homeTeamCity");
  const homeTeamSlug = searchParams.get("homeTeamSlug");
  const awayTeam = searchParams.get("awayTeam");
  const awayTeamName = searchParams.get("awayTeamName");
  const awayTeamCity = searchParams.get("awayTeamCity");
  const awayTeamSlug = searchParams.get("awayTeamSlug");
  const gameDate = searchParams.get("gameDate");
  const gameTime = searchParams.get("gameTime");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: gameName,
        createdBy: session.user.id,
        nbaGameId: gameId,
        homeTeam,
        homeTeamName,
        homeTeamCity,
        homeTeamSlug,
        awayTeam,
        awayTeamName,
        awayTeamCity,
        awayTeamSlug,
        gameDate,
        gameTime,
        nbaGameStatus: null,
        homeGameQuarter1: null,
        homeGameQuarter2: null,
        homeGameQuarter3: null,
        homeGameQuarter4: null,
        awayGameQuarter1: null,
        awayGameQuarter2: null,
        awayGameQuarter3: null,
        awayGameQuarter4: null,
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to create game");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Game Name"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        required
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-[#eb5e28] text-white p-2 rounded">
        Create Game
      </button>
    </form>
  );
}