"use client";

import { useState, useEffect } from "react";
import { PlusCircle, ShieldAlert, RefreshCw, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // 👑 NEW: The Navigator

// Define the shape of the data Discord sends us
interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
}

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth(); // 👑 Wielding the Auth Context
  const router = useRouter(); // 👑 Wielding the router

  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [selectedServerId, setSelectedServerId] = useState("");
  const [isGuildsLoading, setIsGuildsLoading] = useState(true);

  // Fetch the user's servers only after we confirm they are logged in
  useEffect(() => {
    const fetchAdminGuilds = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/guilds`,
          {
            method: "GET",
            credentials: "include", // Sends the auth cookie
          },
        );

        if (res.ok) {
          const data = await res.json();
          setGuilds(data);
          if (data.length > 0) {
            setSelectedServerId(data[0].id); // Auto-select the first server
          }
        } else {
          console.error("Failed to authenticate or fetch guilds.");
        }
      } catch (error) {
        console.error("Network error fetching guilds:", error);
      } finally {
        setIsGuildsLoading(false);
      }
    };

    if (!isAuthLoading && user) {
      fetchAdminGuilds();
    } else if (!isAuthLoading && !user) {
     setTimeout(() => {
        setIsGuildsLoading(false);
      }, 0);
    }
  }, [user, isAuthLoading]);



  const handleProceed = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedServerId) return;
    
    // Route to the new details page we are about to build
    router.push(`/dashboard/setup/${selectedServerId}`);
  };

  // 🛡️ Security Shield: Block unauthenticated access
  if (!isAuthLoading && !user) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white p-8 flex flex-col items-center justify-center">
        <Lock className="text-orange-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400">You must log in with Discord to access the Command Center.</p>
      </main>
    );
  }

  const isLoading = isAuthLoading || isGuildsLoading;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-3xl mx-auto mt-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          {user ? `${user.username}'s Command Center` : "Command Center"}
        </h1>
        <p className="text-gray-400 mb-10">
          Register your Discord server to enter the Disverz Pulse Feed.
        </p>

        {/* Server Registration Card */}
        <div className="bg-[#111] border border-white/5 p-8 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <PlusCircle className="text-orange-500" size={28} />
              <h2 className="text-2xl font-bold">Add Your Server</h2>
            </div>
            {isLoading && (
              <RefreshCw className="text-gray-500 animate-spin" size={20} />
            )}
          </div>

          <form onSubmit={handleProceed} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Select Your Server
              </label>

              {/* Dynamic Rendering Based on State */}
              {isLoading ? (
                <div className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-gray-500 animate-pulse">
                  Scanning your Discord permissions...
                </div>
              ) : guilds.length === 0 ? (
                <div className="w-full bg-[#1a1a1a] border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {"We couldn't find any servers where you have Administrator permissions."}
                </div>
              ) : (
                <select
                  value={selectedServerId}
                  onChange={(e) => setSelectedServerId(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none cursor-pointer"
                >
                  {guilds.map((guild) => (
                    <option key={guild.id} value={guild.id} className="bg-[#111]">
                      {guild.name}
                    </option>
                  ))}
                </select>
              )}

              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-orange-500/70" />
                Only servers where you have Admin or Manage Guild permissions are shown.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || guilds.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all"
            >
              List Server on Disverz
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}