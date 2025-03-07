// models/Game.js
import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nbaGameId: { type: String, required: null },  // Stores the NBA game ID
  homeTeam: { type: String, required: null },   // Stores the home team abbreviation
  homeTeamName: { type: String, required: null },   // Stores the home team name
  homeTeamCity: { type: String, required: null },   // Stores the home team city
  homeTeamSlug: { type: String, required: null },   // Stores the home team slug
  awayTeam: { type: String, required: null },   // Stores the away team abbreviation
  awayTeamName: { type: String, required: null },   // Stores the away team name
  awayTeamCity: { type: String, required: null },   // Stores the away team city
  awayTeamSlug: { type: String, required: null },   // Stores the away team slug
  gameDate: { type: String, required: null },   // Stores the game date
  gameTime: { type: String, required: null },   // Stores the game time
  slots: { 
    type: [{ 
      slot: { type: Number, required: true }, 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
    }], 
    default: [] 
  },
  locked: { type: Boolean, default: false } // New field to prevent edits after start
}, { timestamps: true });  // Adds createdAt and updatedAt timestamps

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
export default Game;
