import dbConnect from "@/lib/db";
import Game from "@/models/Game";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  await dbConnect();

  // Get the current date in YYYY-MM-DD format in EST
  const options = { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" };
  const formatter = new Intl.DateTimeFormat("en-CA", options); // "en-CA" ensures YYYY-MM-DD format
  const parts = formatter.formatToParts(new Date());
  const currentDateEST = `${parts[0].value}-${parts[2].value}-${parts[4].value}`;

  try {
    const games = await Game.find({ gameDate: { $gte: currentDateEST } }).select("-slots").populate('createdBy', ['_id', 'name']); // Exclude slot data
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch games", error });
  }
}
