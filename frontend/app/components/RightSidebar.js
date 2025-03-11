"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icons for open/close

export default function RightSidebar( {currentPage} ) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null)

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close Sidebar if Clicked Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed top-0 right-0 h-full z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 shadow-xl`}
      >
        <div className="p-6 text-lg font-semibold border-b border-gray-700">Menu</div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link href="/scores" className="hover:text-blue-400">Today's Scores</Link>
          <Link href="/game/create" className="hover:text-blue-400">Create Game</Link>
          <Link href="/games" className="hover:text-blue-400">Join a Game</Link>
          <Link href="/upcoming-games" className="hover:text-blue-400">Upcoming Games</Link>
          <Link href="/auth/logout" className="hover:text-red-400">Logout</Link>
        </nav>
      </div>
    </div>
  );
}
