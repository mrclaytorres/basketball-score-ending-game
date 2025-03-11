'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function BoxScore( { nbaGameId } ) {
  const [scores, setScores] = useState([]);
  const [game, setGame] = useState({});
  const [results, setResults] = useState({});

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

  useEffect(() => {

    if (scores.length > 0) {

      const foundGame = scores.find(score => score.id === nbaGameId);

      if (foundGame) {
        setGame(foundGame);
      }
    }
  }, [scores, nbaGameId]);

  // Calculate Results
    useEffect(() => {
      const calculateResults = () => {
        const newResults = {};
        const gameResults = {};
        
        ['q1', 'q2', 'q3', 'q4'].forEach((quarter) => {
          const teamAScore = game[quarter]?.teamA[0];
          const teamBScore = game[quarter]?.teamB[0];
          // Get last digits
          const lastDigitA = teamAScore % 10;
          const lastDigitB = teamBScore % 10;
          // Determine higher and lower scores
          const higher = teamAScore > teamBScore ? lastDigitA : lastDigitB;
          const lower = teamAScore > teamBScore ? lastDigitB : lastDigitA;
          // Form Winning Combination
          const winningCombination = parseInt(`${higher}${lower}`);

          gameResults[quarter] = {
            winningCombination,
          };
        });

        newResults[game.id] = gameResults;
        setResults(newResults);
      };
  
      calculateResults();
    }, [game]);

    console.log("results", results)

  return(
    <div className="flex gap-4">
      {['q1', 'q2', 'q3', 'q4'].map((quarter, qIndex) => (
        <div key={qIndex} className="p-3 bg-gray-700 rounded-lg">
          
          <p className="font-semibold text-gray-300">{quarter.toUpperCase()}:</p>
          <p className="text-gray-400">Score: {game[quarter]?.teamB} - {game[quarter]?.teamA}</p>
          
          <p className="mt-1 text-sm font-semibold text-green-500">
            Winning Combination: {Number.isNaN(results[game.id]?.[quarter]?.winningCombination) ? "-" : results[game.id]?.[quarter]?.winningCombination}
          </p>

        </div>
      ))}
    </div>
  )
}
