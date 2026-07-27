"use client";

import { useState, useEffect } from "react";
import { PlusCircle, ShieldAlert, RefreshCw, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // 👑 NEW: The Navigator
import Image from "next/image";

// Define the shape of the data Discord sends us
interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
}
interface ManagedServer {
  id: string;
  discordId: string;
  name: string;
  iconUrl: string | null;
  lastHumanMsgAt: string | null;
}

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth(); // 👑 Wielding the Auth Context
  const router = useRouter(); // 👑 Wielding the router

  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [selectedServerId, setSelectedServerId] = useState("");
  const [isGuildsLoading, setIsGuildsLoading] = useState(true);

  // 1. Add this state near your other useState declarations
  const [myServers, setMyServers] = useState<ManagedServer[]>([]);
  const [isLoadingServers, setIsLoadingServers] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(myServers.length / itemsPerPage);

  const availableGuilds = guilds.filter(
    (guild) => !myServers.some((server) => server.discordId === guild.id),
  );

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
          console.warn(
            "Silent Notice: Awaiting complete authentication session synchronization.",
          );
        }
      } catch (error) {
        console.warn(
          "Silent Notice: Network background refresh state cycle updated:",
          error,
        );
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

  // 2. Add this useEffect to fetch the armory data
  useEffect(() => {
    const fetchMyServers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/servers/me`,
          {
            credentials: "include",
          },
        );
        if (res.ok) {
          const data = await res.json();
          setMyServers(data);
        }
      } catch (error) {
        console.error("Failed to fetch my servers", error);
      } finally {
        setIsLoadingServers(false);
      }
    };

    fetchMyServers();
  }, []);

  // 👑 Auto-Correction: If the selected server is no longer available, select the next valid one
  useEffect(() => {
    const currentAvailableIds = guilds
      .filter(
        (guild) => !myServers.some((server) => server.discordId === guild.id),
      )
      .map((g) => g.id);

    if (currentAvailableIds.length > 0) {
      if (!currentAvailableIds.includes(selectedServerId)) {
        setTimeout(() => {
          setSelectedServerId(currentAvailableIds[0]);
        }, 0);
      }
    } else {
      if (selectedServerId !== "") {
        setTimeout(() => {
          setSelectedServerId("");
        }, 0);
      }
    }
  }, [guilds, myServers, selectedServerId]); // Deliberately omit selectedServerId to prevent render loops

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
        <p className="text-gray-400">
          You must log in with Discord to access the Command Center.
        </p>
      </main>
    );
  }

  const isLoading = isAuthLoading || isGuildsLoading;

  return (
    <main className="w-full flex-1 px-4 md:px-0 py-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* 👑 FIXED OPTION 2: High-End Split Header Layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {user ? `${user.username}'s Command Center` : "Command Center"}
            </h1>
            <p className="text-sm text-gray-400">
              Register your Discord server to enter the Disverz Pulse Feed.
            </p>
          </div>

          {/* Visual Balance Right Anchor Widget */}
          <div className="mt-4 md:mt-0 bg-[#111] border border-white/5 px-4 py-2 rounded-lg text-xs text-gray-400 font-semibold flex items-center gap-2 select-none">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Total Linked Guilds:{" "}
            <span className="text-white font-bold">{myServers.length}</span>
          </div>
        </div>

        {/* 🚀 THE TACTICAL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT FLANK: Add Server */}
          <div className="lg:col-span-5 bg-[#111] border border-white/5 p-6 rounded-xl shadow-xl sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <PlusCircle className="text-orange-500" size={24} />
                <h2 className="text-xl font-bold">Add Your Server</h2>
              </div>
              {isLoading && (
                <RefreshCw className="text-gray-500 animate-spin" size={18} />
              )}
            </div>

            <form onSubmit={handleProceed} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Select Your Server
                </label>

                {isLoading ? (
                  <div className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-gray-500 animate-pulse text-sm">
                    Scanning your Discord permissions...
                  </div>
                ) : guilds.length === 0 ? (
                  <div className="w-full bg-[#1a1a1a] border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-sm">
                    {
                      "We couldn't find any servers where you have Administrator permissions."
                    }
                  </div>
                ) : (
                  <select
                    value={selectedServerId}
                    onChange={(e) => setSelectedServerId(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                  >
                    {availableGuilds.map((guild) => (
                      <option
                        key={guild.id}
                        value={guild.id}
                        className="bg-[#111]"
                      >
                        {guild.name}
                      </option>
                    ))}
                  </select>
                )}

                <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-orange-500/70" />
                  Only servers with Admin or Manage Guild permissions are shown.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || guilds.length === 0}
                className="w-full bg-[#ff5500] hover:bg-[#ff7733] disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
              >
                List Server on Disverz
              </button>
            </form>
          </div>

          {/* RIGHT FLANK: The Armory */}
          <div className="lg:col-span-7">
            <div className="bg-[#111] border border-white/5 p-6 rounded-xl shadow-xl w-full flex flex-col min-h-105">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-200 border-b border-white/5 pb-3">
                <span>🛡️</span> My Managed Servers ({myServers.length})
              </h2>

              {isLoadingServers ? (
                <div className="text-sm text-gray-400 animate-pulse py-4">
                  Loading your armory...
                </div>
              ) : myServers.length === 0 ? (
                <div className="border border-dashed border-white/10 p-10 rounded-xl text-center flex flex-col items-center justify-center h-60">
                  <ShieldAlert className="text-gray-600 mb-3" size={32} />
                  <h3 className="text-gray-300 font-bold mb-1">
                    No Servers Listed Yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Select a server from the left panel and click{" "}
                    {"List Server on Disverz"} to begin dominating the ranks.
                  </p>
                </div>
              ) : (
                <>
                  {/* The Grid Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    {myServers.map((server) => (
                      <div
                        key={server.id}
                        className="bg-[#1a1a1a] border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-orange-500/30 transition-all group"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          {server.iconUrl ? (
                            <Image
                              src={server.iconUrl}
                              alt={server.name}
                              width={44}
                              height={44}
                              className="w-11 h-11 rounded-lg object-cover ring-1 ring-white/10"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-gray-400 text-base shrink-0">
                              {server.name.charAt(0)}
                            </div>
                          )}
                          <div className="-hidden">
                            <h3 className="font-bold text-sm leading-tight text-white group-hover:text-orange-500 transition-colors truncate">
                              {server.name}
                            </h3>
                            <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {server.lastHumanMsgAt
                                ? new Date(
                                    server.lastHumanMsgAt,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Active"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            router.push(`/dashboard/edit/${server.id}`)
                          }
                          className="w-full bg-transparent hover:bg-orange-500 text-gray-300 hover:text-white border border-white/10 hover:border-orange-500 px-3 py-2 rounded-lg text-xs font-semibold transition-all mt-auto"
                        >
                          Edit Configuration →
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* 👑 ADDED HERE: Sleek Under-Grid Pagination */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                    <span className="text-xs text-zinc-500">
                       Showing{" "} 
                      <span className="text-zinc-300 font-medium">
                        {myServers.length === 0
                          ? 0
                          : (currentPage - 1) * itemsPerPage + 1}
                        -
                        {Math.min(currentPage * itemsPerPage, myServers.length)}
                      </span>
                      {" "}of{" "}
                      <span className="text-zinc-300 font-medium">
                        {myServers.length}
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Previous Button: Disabled on Page 1 */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-35 disabled:hover:text-zinc-400 disabled:hover:border-zinc-800 disabled:cursor-not-allowed"
                      >
                        ← Previous
                      </button>

                      {/* Next Button: Disabled on Last Page */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages || totalPages <= 1}
                        className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-35 disabled:hover:text-zinc-400 disabled:hover:border-zinc-800 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
