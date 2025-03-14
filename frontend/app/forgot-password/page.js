'use client';

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center">
        <div className="bg-gray-800 p-10 rounded-lg shadow-md sm:w-2/3 max-w-md">
          <form onSubmit={handleSubmit} className="mt-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 hover:underline"
              >
                Send Reset Link
              </button>
            </form>

          {message && (
            <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
