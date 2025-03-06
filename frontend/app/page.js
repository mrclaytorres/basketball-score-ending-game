"use client";

import React, { useEffect, useState } from "react";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
    <>
      <div className="text-center">
        <h2 className="text-2xl mb-4">Welcome to the Game!</h2>
        <p className="mb-4">Track NBA scores and pick your winning slots.</p>
        <a href="/scores" className="mr-4">
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
            View Scores
          </button>
        </a>
        <a href="/upcoming-games" className="mr-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Schedules
          </button>
        </a>
      {session ? (
        <a href="/dashboard" className="mr-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            My Dashboard
          </button>
        </a> ) : (
        <a href="/auth/login" className="mr-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Login
          </button>
        </a>
      )}
      </div>
      {!session ? (
      <div className="text-center mt-4">
        Don't have an account?
        <a href="/auth/register" className="m-4 hover:underline">
          Register
        </a>
      </div>
      ) : (
      <div className="text-center mt-4">
        <a href="/auth/logout" className="m-4 hover:underline">
          Logout
        </a>
      </div>)}
    </>
  );
}