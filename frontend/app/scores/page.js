"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [results, setResults] = useState({});

  // Load saved slots from Local Storage
  useEffect(() => {
    const savedSlots = JSON.parse(localStorage.getItem('selectedSlots')) || {};
    setSelectedSlots(savedSlots);
  }, []);

  // Fetch score from the backend
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/scores');
        setScores(response.data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };
    fetchScores();
  }, []);

  // Save selected slots to Local Storage
  const handleSlotSelect = (gameId, quarter, slot) => {
    const updatedSlots = {
      ...selectedSlots,
      [gameId]: {
        ...selectedSlots[gameId],
        [quarter]: slot
      }
    };
    setSelectedSlots(updatedSlots);
    localStorage.setItem('selectedSlots', JSON.stringify(updatedSlots));
  };

  // Calculate Results
  useEffect(() => {
    const calculateResults = () => {
      const newResults = {};
      scores.forEach((game) => {
        console.log(game);
        const gameResults = {};
        ['q1', 'q2', 'q3', 'q4'].forEach((quarter) => {
          const teamAScore = game[quarter].teamA;
          const teamBScore = game[quarter].teamB;
          console.log(teamAScore, teamBScore);
          // Get last digits
          const lastDigitA = teamAScore % 10;
          const lastDigitB = teamBScore % 10;

          // Determine higher and lower scores
          const higher = teamAScore > teamBScore ? lastDigitA : lastDigitB;
          const lower = teamAScore > teamBScore ? lastDigitB : lastDigitA;

          // Form Winning Combination
          const winningCombination = parseInt(`${higher}${lower}`);

          const selectedSlot = selectedSlots[game.id]?.[quarter];
          gameResults[quarter] = {
            winningCombination,
            selectedSlot,
            isWin: selectedSlot === winningCombination
          };
        });
        newResults[game.id] = gameResults;
      });
      setResults(newResults);
    };

    calculateResults();
  }, [scores, selectedSlots]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">NBA Scores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scores.map((game, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{game.teamA} vs {game.teamB}</h3>

            {['q1', 'q2', 'q3', 'q4'].map((quarter, qIndex) => (
              <div key={qIndex} className="mt-2">
                
                <p className="font-semibold">{quarter.toUpperCase()}:</p>
                <p>Score: {game[quarter].teamA} - {game[quarter].teamB}</p>
                
                <div className="mt-2 grid grid-cols-10 gap-1">
                  {Array.from({ length: 100 }, (_, i) => (
                    <button
                      key={i}
                      className={`p-1 rounded text-sm ${
                        selectedSlots[game.id]?.[quarter] === i
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300'
                      }`}
                      onClick={() => handleSlotSelect(game.id, quarter, i)}
                    >
                      {i.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>

                {selectedSlots[game.id]?.[quarter] !== undefined && (
                  <p className="mt-1 text-sm">
                    Selected Slot: <strong>{selectedSlots[game.id][quarter].toString().padStart(2, '0')}</strong>
                  </p>
                )}

                {results[game.id]?.[quarter] && (
                  <p className={`mt-1 text-sm font-semibold ${
                    results[game.id][quarter].isWin
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    Winning Combination: {results[game.id][quarter].winningCombination}
                    <br />
                    Result: {results[game.id][quarter].isWin ? 'Win!' : 'Lose!'}
                  </p>
                )}

              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}