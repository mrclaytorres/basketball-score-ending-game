// models/Game.js
import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nbaGameId: { type: String, required: null },  // Stores the NBA game ID
  homeTeam: { type: String, required: null },   // Stores the home team abbreviation
  awayTeam: { type: String, required: null },   // Stores the away team abbreviation
  slots: { type: [String], default: Array(100).fill('') }  // 100 slots initialized
}, { timestamps: true });  // Adds createdAt and updatedAt timestamps

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
export default Game;
