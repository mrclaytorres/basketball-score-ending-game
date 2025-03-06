// pages/api/game/update.js
import dbConnect from '@/lib/db';
import Game from '@/models/Game';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const { gameId, selectedSlots } = req.body;
    console.log(selectedSlots)
    if (!gameId) {
      return res.status(400).json({ message: 'Missing gameId' });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.createdBy.toString() !== session.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // If an NBA game is being associated, ensure necessary fields are provided
    if (gameId) {
      game.slots = selectedSlots.map((s) => ({
        slot: s.slot,
        userId: s.userId,
      }));
    }
    
    await game.save();
    res.status(200).json({ message: 'Game updated successfully', game });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update game', error });
  }
}
