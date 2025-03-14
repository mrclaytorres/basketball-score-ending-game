import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const { email, token, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.resetPasswordToken) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Hash the provided token to compare
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Check token validity
  if (hashedToken !== user.resetPasswordToken || Date.now() > user.resetPasswordExpires) {
    return res.status(400).json({ message: "Token expired or invalid" });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Fetch and log the saved user data to confirm
  const updatedUser = await User.findOne({ email });

  res.json({ message: "Password reset successful" });
}
