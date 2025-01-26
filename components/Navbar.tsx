"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="flex items-center justify-between p-4 px-8 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-lg">
      <div>
        <Link href="/" className="text-2xl font-extrabold tracking-wide text-white hover:text-gray-300 transition">
          WhisperLink
        </Link>
      </div>
      <div>
        {session ? (
          <div className="flex items-center space-x-8">
            <span className="text-base font-medium text-gray-200">
              Welcome, {"  "} 
              <span className="text-white font-semibold">

               {user?.username?.toUpperCase() || user?.email}
              </span>
            </span>
            <Button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/signin">
            <Button className="bg-white text-gray-800 rounded-lg shadow hover:bg-gray-200 transition text-base">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
