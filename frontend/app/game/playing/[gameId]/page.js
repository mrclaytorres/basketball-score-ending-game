"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSession } from "next-auth/react";

export default function PlayGame() {
  const params = useParams();
  const gameId = params?.gameId;;
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch game data when the page loads
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/game/${gameId}`);
        if (res.ok) {
          const data = await res.json();
          setGame(data);
          setSelectedSlots(data.slots || []);
          console.log(data)
        } else {
          console.error("Game not found");
        }
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };

    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/login");
      } else {
        setUser(session.user);
      }
    };

    if (gameId) {
      fetchGame();
    }

    checkSession();

  }, [gameId, router]);

  const handleSlotSelect = async (slot) => {
    if (!user) {
      alert("You need to be logged in to select a slot.");
      return;
    }

    if (selectedSlots.some((s) => s.slot === slot)) {
      alert("Slot already taken!");
      return;
    }

    const updatedSlots = [...selectedSlots, { slot, userId: user.id }]; // Convert to string
    setSelectedSlots(updatedSlots);
    console.log('selectedSlots',selectedSlots);

    try {
      const res = await fetch("/api/game/updateslots", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, selectedSlots: updatedSlots.map(s => ({ slot: s.slot, userId: s.userId })) }),
      });

      if (!res.ok) {
        console.error("Failed to update slot selection.");
      }
    } catch (error) {
      console.error("Error updating slot selection:", error);
    }
  };
  
  if (!game) return <p className="text-center text-white">Loading game...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-full">
      <h2 className="text-2xl font-bold mb-4">Game Details</h2>
      <p>Game Name: {game.name}</p>
      <p>Home Team: {game.homeTeam}</p>
      <p>Away Team: {game.awayTeam}</p>

      <h2 className="text-xl font-bold mt-6 mb-4">Select Your Slot (00-99)</h2>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 100 }, (_, i) => {
          const isTaken = selectedSlots.some((s) => s.slot === i);
          return (
            <button
              key={i}
              className={`p-4 rounded transition ${
                isTaken
                  ? "bg-red-500 text-white cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
              }`}
              onClick={() => !isTaken && handleSlotSelect(i)}
              disabled={isTaken}
            >
              {i.toString().padStart(2, "0")}
            </button>
          );
        })}
      </div>

      {selectedSlots.length > 0 && (
        <div className="mt-4">
          <p className="text-xl">Selected Slots:</p>
          <ul>
            {selectedSlots.map((s, index) => {
              if (!s || typeof s.slot !== "number") return null; // Prevent errors
              return (
                <li key={index} className="text-green-400">
                  Slot {s.slot.toString().padStart(2, "0")} - Taken
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
