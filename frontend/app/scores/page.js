"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image'
import RightSidebar from '../components/RightSidebar';

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
        const response = await axios.get(`${API_URL}/api/scores`);
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
        const gameResults = {};
        ['q1', 'q2', 'q3', 'q4'].forEach((quarter) => {
          const teamAScore = game[quarter].teamA[0];
          const teamBScore = game[quarter].teamB[0];
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
    <>
      <div className="bg-[#252422] min-h-screen text-white p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">NBA Scores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scores.map((game, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl sm:text-lg font-semibold text-center flex gap-4 mx-auto items-center justify-center"><Image src={`/assets/logo/${game.teamBTriCode}.svg`} width={50} height={50} alt={`${game.teamBTriCode}`}/>{game.teamB} vs {game.teamA}<Image src={`/assets/logo/${game.teamATriCode}.svg`} width={50} height={50} alt={`${game.teamATriCode}`}/></h3>
              <div className="mt-4 space-y-3 text-lg sm:text-base">
                {['q1', 'q2', 'q3', 'q4'].map((quarter, qIndex) => (
                  <div key={qIndex} className="p-3 bg-gray-700 rounded-lg">
                    
                    <p className="font-semibold text-gray-300">{quarter.toUpperCase()}:</p>
                    <p className="text-gray-400">Score: {game[quarter].teamB} - {game[quarter].teamA}</p>

                    {selectedSlots[game.id]?.[quarter] !== undefined && (
                      <p className="text-sm text-gray-300">
                        Selected Slot: <span className="font-bold text-blue-400">{selectedSlots[game.id][quarter].toString().padStart(2, '0')}</span>
                      </p>
                    )}

                    {results[game.id]?.[quarter] && (
                      <p className={`mt-1 text-sm font-semibold ${
                        results[game.id][quarter].isWin
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        Winning Combination: {results[game.id][quarter].winningCombination}
                      </p>
                    )}

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <RightSidebar />
    </>
  );
}