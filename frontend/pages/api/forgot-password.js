import crypto from "crypto";
import { sendEmail } from "@/app/utils/email";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token to store in DB
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
  await user.save();

  // Send reset link via email
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${email}`;
  await sendEmail(user.email, "Password Reset", `Click here to reset: ${resetLink}`);

  res.json({ message: "Password reset link sent to email" });
}
