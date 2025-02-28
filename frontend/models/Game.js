// models/Game.js
import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  slots: [{ type: String, default: '' }],
});

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
export default Game;
