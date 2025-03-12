"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HowToPlay from "./components/HowToPlay";

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      console.log("Session:", session);
      setSession(session);
    };

    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-2">Welcome to the BELDS!</h2>
        <p className="text-lg text-gray-400">Track NBA scores and pick your winning slots.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <a href="/scores" className="w-full sm:w-auto">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg w-full sm:w-auto">
            View Scores
          </button>
        </a>
        <a href="/upcoming-games" className="w-full sm:w-auto">
          <button className="bg-[#eb5e28] hover:bg-[#e2501b] text-white font-semibold py-3 px-6 rounded-lg w-full sm:w-auto">
            Schedules
          </button>
        </a>
        {session ? (
          <a href="/dashboard" className="w-full sm:w-auto">
            <button className="bg-[#eb5e28] hover:bg-[#e2501b] text-white font-semibold py-3 px-6 rounded-lg w-full sm:w-auto">
              My Dashboard
            </button>
          </a>
        ) : (
          <a href="/auth/login" className="w-full sm:w-auto">
            <button className="bg-[#eb5e28] hover:bg-[#e2501b] text-white font-semibold py-3 px-6 rounded-lg w-full sm:w-auto">
              Login
            </button>
          </a>
        )}
      </div>
      
      {!session ? (
        <div className="text-center text-gray-300">
          Don't have an account? 
          <a href="/auth/register" className="text-blue-400 hover:underline ml-2">Register</a>
        </div>
      ) : (
        <div className="mt-4">
          <a href="/auth/logout" className="text-red-400 hover:underline">Logout</a>
        </div>
      )}
      
      <div className="mt-10 w-full max-w-4xl">
        <HowToPlay />
      </div>
    </div>
  );
}