"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <a
      onClick={() => signOut()}
      className="text-red-400 hover:text-red-500 hover:underline hover:cursor-pointer"
    >
      Logout
    </a>
  );
}