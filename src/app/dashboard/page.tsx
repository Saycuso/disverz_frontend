"use client";

import { useState, useEffect } from "react";
import { PlusCircle, ShieldAlert, RefreshCw, Lock, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { BumpModal } from "@/components/BumpModal";
import Image from "next/image";

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
  lastChallengeAt: string | null;
}

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [selectedServerId, setSelectedServerId] = useState("");
  const [isGuildsLoading, setIsGuildsLoading] = useState(true);

  const [bumpingServerId, setBumpingServerId] = useState<string | null>(null);

  const [myServers, setMyServers] = useState<ManagedServer[]>([]);
  const [isLoadingServers, setIsLoadingServers] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const totalPages = Math.ceil(myServers.length / itemsPerPage);

  const availableGuilds = guilds.filter(
    (guild) => !myServers.some((server) => server.discordId === guild.id),
  );

  useEffect(() => {
    const fetchAdminGuilds = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(
          `${baseUrl}/api/auth/guilds`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (res.ok) {
          const data = await res.json();
          setGuilds(data);
          if (data.length > 0) {
            setSelectedServerId(data[0].id);
          }
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMyServers = async () => {
    setIsLoadingServers(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch( `${baseUrl}/api/servers/me`, {
        credentials: "include",
      });
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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMyServers();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
  }, [guilds, myServers, selectedServerId]);

  const handleProceed = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedServerId) return;
    router.push(`/dashboard/setup/${selectedServerId}`);
  };

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
    <main className="w-full flex-1 px-0 md:px-0 py-8 relative">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-1">
              {user ? `${user.username}'s Command Center` : "Command Center"}
            </h1>
            <p className="text-xs md:text-sm text-gray-400">
              Register your Discord server to enter the Disverz Pulse Feed.
            </p>
          </div>

          <div className="mt-4 md:mt-0 bg-[#111] border border-white/5 px-4 py-2 rounded-lg text-[11px] md:text-xs text-gray-400 font-semibold flex items-center gap-2 select-none w-fit">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Total Linked Guilds:{" "}
            <span className="text-white font-bold">{myServers.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-5 bg-[#111] border border-white/5 p-3 md:p-6 rounded-xl shadow-xl lg:sticky lg:top-24'">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <PlusCircle className="text-orange-500" size={20} />
                <h2 className="text-md md:text-xl font-bold">
                  Add Your Server
                </h2>
              </div>
              {isLoading && (
                <RefreshCw className="text-gray-500 animate-spin" size={16} />
              )}
            </div>

            <form onSubmit={handleProceed} className="space-y-4">
              <div>
                <label className="block text-[10px] md:text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Select Your Server
                </label>

                {isLoading ? (
                  <div className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-gray-500 animate-pulse text-xs md:text-sm">
                    Scanning permissions...
                  </div>
                ) : guilds.length === 0 ? (
                  <div className="w-full bg-[#1a1a1a] border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-xs md:text-sm">
                    {
                      "We couldn't find any servers where you have Administrator permissions."
                    }
                  </div>
                ) : (
                  <select
                    value={selectedServerId}
                    onChange={(e) => setSelectedServerId(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
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

                <p className="text-[10px] md:text-[11px] text-gray-500 mt-2 flex items-center gap-1.5">
                  <ShieldAlert
                    size={12}
                    className="text-orange-500/70 shrink-0"
                  />
                  Only servers with Admin or Manage Guild permissions are shown.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || guilds.length === 0}
                className="w-full bg-[#ff5500] hover:bg-[#ff7733] disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-colors text-xs md:text-sm"
              >
                List Server on Disverz
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {/* 👑 OUTER CONTAINER FIX: Added strict height for PC (md:h-[430px]) so it never collapses, while staying flexible on mobile */}
            <div className="bg-[#111] border border-white/5 p-4 md:p-6 rounded-xl shadow-xl w-full flex flex-col min-h-95in-h-105 md:h-107.5">
              <h2 className="text-md md:text-lg font-bold mb-5 flex items-center gap-2 text-gray-200 border-b border-white/5 pb-3">
                <span>🛡️</span> My Managed Servers ({myServers.length})
              </h2>

              {isLoadingServers ? (
                <div className="text-xs md:text-sm text-gray-400 animate-pulse py-4">
                  Loading your armory...
                </div>
              ) : myServers.length === 0 ? (
                <div className="border border-dashed border-white/10 p-6 md:p-10 rounded-xl text-center flex flex-col items-center justify-center flex-1">
                  <ShieldAlert className="text-gray-600 mb-3" size={28} />
                  <h3 className="text-gray-300 font-bold mb-1 text-sm md:text-base">
                    No Servers Listed Yet
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 max-w-sm">
                    Select a server from the left panel and click{" "}
                    {"List Server on Disverz"} to begin dominating the ranks.
                  </p>
                </div>
              ) : (
                <>
                  {/* 👑 GRID FIX: Added `content-start` so rows pack tightly at the top instead of stretching to fill the flex container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start">
                    {myServers
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage,
                      )
                      .map((server) => {
                        const COOLDOWN_HOURS = 0;
                        let isOnCooldown = false;
                        let timeLeftText = "";

                        if (server.lastChallengeAt) {
                          const lastBump = new Date(
                            server.lastChallengeAt,
                          ).getTime();
                          const hoursSinceLast =
                            (currentTime - lastBump) / (1000 * 60 * 60);

                          if (hoursSinceLast < COOLDOWN_HOURS) {
                            isOnCooldown = true;
                            let totalMinsLeft = Math.ceil(
                              (COOLDOWN_HOURS - hoursSinceLast) * 60,
                            );
                            totalMinsLeft = Math.min(
                              totalMinsLeft,
                              COOLDOWN_HOURS * 60,
                            );
                       const hrs = Math.floor(totalMinsLeft / 60);
                            const mins = totalMinsLeft % 60;
                            timeLeftText =
                              hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
                          }
                        }

                        return (
                          /* 👑 CARD FIX: Added strict height (`h-[135px] md:h-[145px]`) so cards NEVER stretch, regardless of server count */
                          <div
                            key={server.id}
                            className="bg-[#1a1a1a] border border-white/5 p-3 md:p-4 rounded-xl flex flex-col justify-between h-33.75 md:h-36.25 hover:border-orange-500/30 transition-all group"
                          >
                            <div className="flex items-start gap-3">
                              {server.iconUrl ? (
                                <Image
                                  src={server.iconUrl}
                                  alt={server.name}
                                  width={44}
                                  height={44}
                                  className="w-10 h-10 md:w-11 md:h-11 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-gray-400 text-base shrink-0">
                                  {server.name.charAt(0)}
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-sm md:text-base leading-tight text-white group-hover:text-orange-500 transition-colors truncate">
                                  {server.name}
                                </h3>
                                <p className="text-[10px] md:text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                  <span className="truncate">
                                    {server.lastHumanMsgAt
                                      ? new Date(
                                          server.lastHumanMsgAt,
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "Active"}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 md:gap-2 mt-auto pt-2">
                              {/* 1. BUMP BUTTON */}
                              <button
                                onClick={() => setBumpingServerId(server.id)}
                                disabled={isOnCooldown}
                                className={`flex-[1.2] px-1.5 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-1 
              ${
                isOnCooldown
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-white/5"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_10px_rgba(255,85,0,0.15)] hover:shadow-[0_0_15px_rgba(255,85,0,0.3)]"
              }`}
                              >
                                {isOnCooldown ? (
                                  <>⏱️ {timeLeftText}</>
                                ) : (
                                  <>
                                    <Flame
                                      size={12}
                                      className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0"
                                    />
                                    Bump
                                  </>
                                )}
                              </button>
                              
                              {/* 2. EDIT BUTTON */}
                              <button
                                onClick={() =>
                                  router.push(`/dashboard/edit/${server.id}`)
                                }
                                className="flex-1 bg-transparent hover:bg-white/10 text-gray-300 border border-white/10 px-1.5 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-xs font-semibold transition-all flex items-center justify-center gap-1"
                              >
                                Edit ⚙️
                              </button>

                              {/* 3. VIEW PAGE BUTTON */}
                              <button
                                onClick={() => router.push(`/servers/${server.id}`)}
                                className="flex-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-1.5 md:px-3 py-1.5 md:py-2 rounded-md text-[10px] md:text-xs font-semibold transition-all flex items-center justify-center gap-1"
                              >
                                View 👁️
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-5 md:mt-auto">
                    <span className="text-[10px] md:text-xs text-zinc-500">
                      <span className="hidden sm:inline">Showing </span>
                      <span className="text-zinc-300 font-medium">
                        {myServers.length === 0
                          ? 0
                          : (currentPage - 1) * itemsPerPage + 1}
                        -
                        {Math.min(currentPage * itemsPerPage, myServers.length)}
                      </span>{" "}
                      of{" "}
                      <span className="text-zinc-300 font-medium">
                        {myServers.length}
                      </span>
                    </span>

                    <div className="flex items-center gap-1.5 md:gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-2 py-1.5 md:px-3 md:py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-[10px] md:text-xs font-medium transition-colors cursor-pointer disabled:opacity-35 disabled:hover:text-zinc-400 disabled:hover:border-zinc-800 disabled:cursor-not-allowed"
                      >
                        ← Prev
                      </button>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages || totalPages <= 1}
                        className="px-2 py-1.5 md:px-3 md:py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-[10px] md:text-xs font-medium transition-colors cursor-pointer disabled:opacity-35 disabled:hover:text-zinc-400 disabled:hover:border-zinc-800 disabled:cursor-not-allowed"
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

      <BumpModal
        isOpen={!!bumpingServerId}
        serverId={bumpingServerId || ""}
        onClose={() => setBumpingServerId(null)}
        onSuccess={() => fetchMyServers()}
      />
    </main>
  );
}
