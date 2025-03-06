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

  const { gameId, slot } = req.body;
  const userId = session.user.id;

  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    // Get the current date in YYYY-MM-DD format in EST
    const options = { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" };
    const formatter = new Intl.DateTimeFormat("en-CA", options); // "en-CA" ensures YYYY-MM-DD format
    const parts = formatter.formatToParts(new Date());
    const currentDateEST = `${parts[0].value}-${parts[2].value}-${parts[4].value}`;
    
    if (game.gameDate < currentDateEST) return res.status(400).json({ message: "Game has already started" });

    const slotIndex = game.slots.findIndex((s) => s.slot === slot);
    if (slotIndex === -1) return res.status(404).json({ message: "Slot not found" });

    // Only allow game creator or the player who owns the slot to withdraw
    if (game.createdBy.toString() !== userId && game.slots[slotIndex].userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to withdraw this slot" });
    }

    game.slots.splice(slotIndex, 1); // Remove the slot
    await game.save();

    res.status(200).json({ message: "Slot withdrawn successfully", game });
  } catch (error) {
    res.status(500).json({ message: "Failed to withdraw slot", error });
  }
}
