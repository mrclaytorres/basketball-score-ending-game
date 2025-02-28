// pages/api/game/create.js
import dbConnect from '@/lib/db';
import Game from '@/models/Game';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { name, createdBy } = req.body;

  await dbConnect();

  try {
    const newGame = new Game({ 
      name, 
      createdBy,
      slots: Array(100).fill('')  // Initialize 100 slots
    });
    await newGame.save();
    res.status(201).json({ message: 'Game created', game: newGame });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create game' });
  }
}
