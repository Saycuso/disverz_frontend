"use client"; // 👑 Must be a client component now

import Link from "next/link";
import { Flame, LogIn, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const { user, isLoading } = useAuth();

  return (
    <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Flame className="text-orange-500 group-hover:scale-110 transition-transform" size={24} />
          <span className="text-xl font-bold text-white tracking-tight">
            Disverz
          </span>
        </Link>

        {/* Dynamic Auth Section */}
        {isLoading ? (
          <div className="h-10 w-32 bg-white/5 animate-pulse rounded-lg"></div>
        ) : user ? (
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full shadow-md">
              <Image
                src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                alt="Avatar"
                width={28}
                height={28}
                className="w-7 h-7 rounded-full border border-white/10"
              />
              <span className="font-semibold text-sm tracking-wide">{user.username}</span>
            </div>
          </div>
        ) : (
          <a 
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/discord/login`}
            className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-[#5865F2]/20"
          >
            <LogIn size={18} />
            Login with Discord
          </a>
        )}

      </div>
    </nav>
  );
}