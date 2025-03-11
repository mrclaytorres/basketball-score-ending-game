"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSession } from "next-auth/react";
import BoxScore from "@/app/components/BoxScore";
import { formatToEST } from '../../../utils/dateUtils';
import Image from "next/image";
import RightSidebar from "@/app/components/RightSidebar";

export default function PlayGame() {
  const params = useParams();
  const gameId = params?.gameId;;
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [user, setUser] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Fetch game data when the page loads
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/game/${gameId}`);
        if (res.ok) {
          const data = await res.json();
          setGame(data);
          console.log('PlayGame', data)
          setSelectedSlots(data.slots || []);
          // Check if game has started (compare gameDate with today)
          const options = { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" };
          const formatter = new Intl.DateTimeFormat("en-CA", options); // "en-CA" ensures YYYY-MM-DD format
          const parts = formatter.formatToParts(new Date());
          const currentDateEST = `${parts[0].value}-${parts[2].value}-${parts[4].value}`;
          setGameStarted(data.gameDate <= currentDateEST);
          
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

  // Function to withdraw a slot
  const handleWithdrawSlot = async (slot) => {
    if (gameStarted) {
      alert("The game has started. Slots cannot be withdrawn.");
      return;
    }

    const slotToWithdraw = selectedSlots.find((s) => s.slot === slot);

    if (!slotToWithdraw) {
      alert("Slot not found.");
      return;
    }

    if (slotToWithdraw.userId !== user.id && game.createdBy !== user.id) {
      alert("You do not have permission to withdraw this slot.");
      return;
    }

    const updatedSlots = selectedSlots.filter((s) => s.slot !== slot);
    setSelectedSlots(updatedSlots);

    try {
      const res = await fetch("/api/game/withdrawslot", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, slot }),
      });

      if (!res.ok) console.error("Failed to withdraw slot.");
    } catch (error) {
      console.error("Error withdrawing slot:", error);
    }
  };
  
  if (!game) return <p className="text-center text-white">Loading game...</p>;
  
  const canWithdraw = (s) => {
    if (!user || !game) return false; // Ensure data is available before checking

    const isSlotOwner = s.userId?.toString() === user.id?.toString();
    const isGameCreator = game.createdBy?.toString() === user.id?.toString();
    
    // Check if the game has started
    const options = { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" };
    const formatter = new Intl.DateTimeFormat("en-CA", options); // "en-CA" ensures YYYY-MM-DD format
    const parts = formatter.formatToParts(new Date());
    const currentDateEST = `${parts[0].value}-${parts[2].value}-${parts[4].value}`;
    const gameHasStarted = game.gameDate <= currentDateEST;
  
    return (isSlotOwner || isGameCreator) && !gameHasStarted;
  };

  return (
    <>
      <div className="p-6 bg-[#252422] text-white rounded-lg w-full">
        <div className="flex">
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4">Game Details</h2>
            <p className="mb-3 text-xl">Game Name: {game.name}</p>
            <p className="mb-3 text-lg">Host: {game.createdBy?.name}</p>
            <p className="flex items-center gap-1 text-xl"><Image src={`/assets/logo/${game.homeTeam}.svg`} width={50} height={50} alt={`${game.homeTeam}`}/>{game.homeTeam} vs {game.awayTeam}<Image src={`/assets/logo/${game.awayTeam}.svg`} width={50} height={50} alt={`${game.awayTeam}`}/></p>
            <p className="text-sm pt-2">Time: {game.gameDate} {formatToEST(game.gameTime)} EST</p>
          </div>
          <div className="w-1/2 justify-center">
            <BoxScore currentGame={game} />
          </div>
        </div>
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
                disabled={isTaken || gameStarted}
              >
                {i.toString().padStart(2, "0")}
              </button>
            );
          })}
        </div>

        {selectedSlots.length > 0 && (
          <div className="mt-4">
            <p className="text-xl">Your Slots:</p>
            <ul>
              {selectedSlots.map((s, index) => {
                if (!s || typeof s.slot !== "number") return null;

                return (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-green-400">
                      Slot {s.slot.toString().padStart(2, "0")}
                    </span>
                    {canWithdraw(s) && (
                      <button
                        onClick={() => handleWithdrawSlot(s.slot)}
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Withdraw
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <RightSidebar />
    </>
  );
}
