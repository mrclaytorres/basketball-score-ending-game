import dbConnect from '@/lib/db';
import Game from '@/models/Game';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { gameId } = req.query;
  await dbConnect();

  try {
    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json(game);

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch game' });
  }
}
