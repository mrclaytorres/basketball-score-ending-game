import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const { email, token, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.resetPasswordToken) return res.status(400).json({ message: "Invalid or expired token" });

  // Validate token
  const isValid = bcrypt.compareSync(token, user.resetPasswordToken);
  if (!isValid || Date.now() > user.resetPasswordExpires) {
    return res.status(400).json({ message: "Token expired or invalid" });
  }

  // Update password
  user.password = bcrypt.hashSync(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
}
