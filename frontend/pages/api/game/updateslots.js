// pages/api/game/update.js
import dbConnect from '@/lib/db';
import Game from '@/models/Game';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getCurrentESTDate } from '@/app/utils/dateUtils';

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

    if (!gameId) {
      return res.status(400).json({ message: 'Missing gameId' });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Get the current date in YYYY-MM-DD format in EST
    const currentDateEST = getCurrentESTDate();

    if (game.gameDate < currentDateEST) return res.status(400).json({ message: "Game has already started" });

    if (gameId) {
      game.slots = selectedSlots.map((s) => ({
        slot: s.slot,
        userId: s.userId,
        name: s.name,
      }));
    }
    
    await game.save();
    res.status(200).json({ message: 'Game updated successfully', game });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update game', error });
  }
}
