'use client'

import { useState, Suspense } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center">
        <div className="bg-gray-800 p-10 rounded-lg shadow-md sm:w-2/3 max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Reset Password</h2>
            <p className="text-gray-600 text-center mt-2">Enter a new password for your account.</p>
            <Suspense fallback={<p>Please wait...</p>}>
              <ResetPasswordForm />
            </Suspense>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query params
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, newPassword: password }),
    });

    const data = await res.json();
    setMessage(data.message);
    if (res.ok) router.push("/auth/login");
  };

  return(
    <>
      <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        required
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 hover:underline"
      >
        Reset Password
      </button>
    </form>

    {message && (
      <p className="mt-4 text-center text-sm text-green-600">{message}</p>
    )}
  </>
  );
}