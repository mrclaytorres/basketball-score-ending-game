"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SlotSelectionPage() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [game, setGame] = useState(null);

  // Load saved slot from local storage
  useEffect(() => {
    if (!gameId) return;

    const fetchGameDetails = async () => {
      try {
        const res = await fetch(`/api/game/${gameId}`);
        if (res.ok) {
          const data = await res.json();
          setGame(data);
        } else {
          console.error("Failed to fetch game:", res.status, res.statusText);
        }
      } catch (error) {
        console.error("Error fetching game:", error);
      }
    };

    fetchGameDetails();

    // Load saved slot from local storage
    const savedSlot = localStorage.getItem('selectedSlot');
    if (savedSlot) {
      setSelectedSlot(parseInt(savedSlot));
    }
  }, [gameId]);

  // Save slot selection to local storage
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    localStorage.setItem('selectedSlot', slot);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#252422] min-h-screen text-white">
      {game ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Game: {game.name}</h1>
          <h2 className="text-lg text-gray-400 mb-6">
            Home: {game.homeTeam} | Away: {game.awayTeam}
          </h2>
        </>
      ) : (
        <p className="text-gray-400">Loading game details...</p>
      )}

      <h2 className="text-xl font-bold mb-4">Select Your Slot (00-99)</h2>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 100 }, (_, i) => (
          <button
            key={i}
            className={`p-10 rounded transition ${
              selectedSlot === i ? 'bg-[#eb5e28] text-white' : 'bg-gray-300'
            }`}
            onClick={() => handleSlotSelect(i)}
          >
            {i.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
      {selectedSlot !== null && (
        <div className="mt-4">
          <p className="text-xl">
            Selected Slot: <strong>{selectedSlot.toString().padStart(2, '0')}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
