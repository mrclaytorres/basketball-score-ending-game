import axios from 'axios';

export default async function handler(req, res) {
  const { start_date, end_date, team_abbreviation, sort_order, page, limit } = req.query;

  try {
    const response = await axios.get('http://localhost:8000/api/upcoming-games', {
      params: { start_date, end_date, team_abbreviation, sort_order, page, limit },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming NBA games' });
  }
}