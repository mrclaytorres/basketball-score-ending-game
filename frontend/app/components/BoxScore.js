'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_URL

export default function BoxScore( { currentGame } ) {
  const [scores, setScores] = useState([]);
  const [game, setGame] = useState({});
  const [results, setResults] = useState({});

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

  useEffect(() => {

    if (scores.length > 0) {

      const foundGame = scores.find(score => score.id === currentGame.nbaGameId);
      if (foundGame) {
        setGame(foundGame);
      }

      // Update game db quarter scores
      if (foundGame?.gameStatusText == "Final" && !currentGame.awayGameQuarter4 && !currentGame.homeGameQuarter4) {
        handlePeriodScoresUpdate(currentGame, foundGame)
      }
    }
  }, [scores, currentGame]);

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

    const handlePeriodScoresUpdate = async (currentGame, foundGame) => {
      if (!currentGame) {
        console.log("Game not found.")
        return;
      }
  
      try {
        const res = await fetch(`/api/game/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: currentGame._id,
            nbaGameStatus: foundGame.gameStatusText,
            homeGameQuarter1: foundGame.teamBPeriods[0].score,
            homeGameQuarter2: foundGame.teamBPeriods[1].score,
            homeGameQuarter3: foundGame.teamBPeriods[2].score,
            homeGameQuarter4: foundGame.teamBPeriods[3].score,
            awayGameQuarter1: foundGame.teamAPeriods[0].score,
            awayGameQuarter2: foundGame.teamAPeriods[1].score,
            awayGameQuarter3: foundGame.teamAPeriods[2].score,
            awayGameQuarter4: foundGame.teamAPeriods[3].score,
          }),
        });
  
        if (res.ok) {
          console.log('Game periods scores successfully updated.')
        } else {
          console.error("Failed to assign NBA game:", res.status, res.statusText);
        }
      } catch (error) {
        console.error("Error assigning NBA game:", error);
      }
    }

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
