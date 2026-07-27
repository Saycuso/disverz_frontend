"use client";

import { useState } from "react"; // 👑 Added for settings dropdown state
import Link from "next/link";
import { Flame, LogIn, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false); // 👑 Track dropdown menu state

  return (
    <nav className="border-b border-white/5 bg-[#060606]/80 backdrop-blur-md sticky top-0 z-50">
      {/* 👑 Grid-Aligned Wrapper: Cleaned padding to perfectly line up with your page layouts */}
      <div className="max-w-7xl mx-auto px-0 py-3.5 flex items-center justify-between w-full">
        
        {/* LEFT SECTION: Logo and Navigation Links Grouped Together */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Flame className="text-orange-500 group-hover:scale-110 transition-transform duration-300" size={22} />
            <span className="text-lg font-black text-white tracking-tight uppercase">
              Disverz
            </span>
          </Link>

          {/* 🚀 Modern Navigation Links Group (Left-aligned next to logo) */}
          {user && !isLoading && (
            <div className="hidden md:flex items-center gap-6 border-l border-white/5 pl-8">
              <Link 
                href="/dashboard" 
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
              >
                <LayoutDashboard size={14} className="text-orange-500/80" />
                Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: Dynamic Auth & Profile Widget Layout */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-28 bg-white/5 animate-pulse rounded-lg"></div>
          ) : user ? (
            /* 👑 PREMIUM PROFILE WIDGET SYSTEM WITH INTERACTIVE ACCORDION SETTINGS DROPDOWN */
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-[#111] hover:bg-[#161616] border border-white/5 hover:border-zinc-800/80 px-3 py-1.5 rounded-xl transition-all select-none cursor-pointer group"
              >
                <Image
                  src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                  alt="Avatar"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-lg border border-white/10 object-cover"
                />
                <span className="font-bold text-xs text-zinc-200 group-hover:text-white tracking-wide">
                  {user.username}
                </span>
                <ChevronDown 
                  size={14} 
                  className={`text-zinc-500 group-hover:text-zinc-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* 👑 FLOATING dropdown FOR SETTINGS (Closes out three-dots on left) */}
              {dropdownOpen && (
                <>
                  {/* Invisible overlay background to close dropdown when clicking anywhere else */}
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  
                  <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-white/5 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link 
                      href="/dashboard/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Settings size={14} />
                      Account Settings
                    </Link>
                    
                    <a 
                      href={`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`} // Make sure logout path matches backend routes
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border-t border-white/5 mt-1 pt-1.5"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </a>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Discord Login Button */
            <a 
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/discord/login`}
              className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-[#5865F2]/10 active:scale-95 cursor-pointer"
            >
              <LogIn size={14} />
              Login with Discord
            </a>
          )}
        </div>

      </div>
    </nav>
  );
}
