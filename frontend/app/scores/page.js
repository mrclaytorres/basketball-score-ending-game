"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ScoresPage() {
  const [scores, setScores] = useState([]);

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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">NBA Scores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scores.map((game, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{game.teamA} vs {game.teamB}</h3>
            <p>1st Quarter: {game.q1}</p>
            <p>2nd Quarter: {game.q2}</p>
            <p>3rd Quarter: {game.q3}</p>
            <p>4th Quarter: {game.q4}</p>
          </div>
        ))}
      </div>
    </div>
  );
}