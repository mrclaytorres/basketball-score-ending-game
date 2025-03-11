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
  nbaGameStatus: { type: String, required: null },   // Stores NBA game status
  homeGameQuarter1: { type: String, required: null },   // Stores NBA home q1
  homeGameQuarter2: { type: String, required: null },   // Stores NBA home q2
  homeGameQuarter3: { type: String, required: null },   // Stores NBA home q3
  homeGameQuarter4: { type: String, required: null },   // Stores NBA home q4
  awayGameQuarter1: { type: String, required: null },   // Stores NBA away q1
  awayGameQuarter2: { type: String, required: null },   // Stores NBA away q2
  awayGameQuarter3: { type: String, required: null },   // Stores NBA away q3
  awayGameQuarter4: { type: String, required: null },   // Stores NBA away q4
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
