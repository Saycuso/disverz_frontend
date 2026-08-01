import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Activity, Hash, LayoutGrid, Users } from "lucide-react";
import Image from "next/image";

// 👑 Upgraded the interface to anticipate both new tags and old category data, plus iconUrls and inviteUrls
interface ServerType {
  id: string;
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  memberCount: number;
  lastChallengeAt: string | null;
  iconUrl?: string | null;
  inviteLink?: string | null;
}

// Force Next.js to always fetch fresh data, never cache the live feed
export const dynamic = "force-dynamic";

async function getActiveServers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(
    `${baseUrl}/api/servers?sort=active`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch servers");
  return res.json();
}

export default async function Home() {
  const { data: servers } = await getActiveServers();

  return (
    <main className="min-h-screen text-white px-0 md:px-0 selection:bg-orange-500/30 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-175 h-87.5 bg-linear-to-r from-orange-500/10 via-red-500/5 to-indigo-500/10 rounded-full blur-[130px] pointer-events-none select-none -z-10" />

      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-16 text-center relative pt-4 md:pt-12">
        <div className="inline-flex items-center justify-center p-2 md:p-3 mb-2 md:mb-4 rounded-xl md:rounded-2xl bg-[#111] border border-white/5 shadow-[0_0_20px_rgba(255,85,0,0.1)] md:shadow-[0_0_30px_rgba(255,85,0,0.15)] group relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#ff5500]/10 to-[#a855f7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />

          <Image
            src="/logo.svg"
            alt="Disverz Logo"
            width={60}
            height={60}
            className="w-10 h-10 md:w-15 md:h-15 object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#ff5500] via-[#ff7733] to-[#a855f7]">
            Disverz
          </span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-sm md:text-xl max-w-xl mx-auto leading-relaxed px-4">
          The only server list where rank is determined by real human activity.
          <br className="hidden md:block" /> No dead communities. No bot spam.
        </p>
      </div>

      {/* The Pulse Feed */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4 md:mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2 md:gap-3 text-white font-bold tracking-widest uppercase text-[10px] md:text-sm">
            <Activity
              size={16}
              className="text-orange-500 shrink-0 animate-pulse"
            />
            <h2>
              {/* 👑 MOBILE FIXED: Shortens 'Live Pulse Feed' to just 'Live Feed' on small screens */}
              <span className="md:hidden">Live Feed</span>
              <span className="hidden md:inline">Live Pulse Feed</span>
            </h2>
          </div>

          <span className="text-[10px] md:text-xs text-gray-500 font-bold tracking-widest uppercase shrink-0">
            {servers.length}{" "}
            {/* 👑 MOBILE FIXED: Condenses 'Active Servers' to just 'Active' on phones */}
            <span className="md:hidden">Active</span>
            <span className="hidden md:inline">
              Active {servers.length === 1 ? "Server" : "Servers"}
            </span>
          </span>
        </div>

        {servers.length === 0 ? (
          <div className="text-center p-16 bg-[#111] rounded-2xl border border-white/5 shadow-2xl">
            <Activity
              size={48}
              className="text-gray-600 mx-auto mb-4 opacity-50"
            />
            <p className="text-gray-400 font-medium">
              The feed is currently silent. No servers are active.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {servers.map((server: ServerType) => (
              /* 👑 FIXED 1: The outer wrapper explicitly forces h-full to guarantee equal heights */
              <div key={server.id} className="h-full">
                {/* 👑 FIXED 2: The visual card is now the main container, preventing the layout and hover bounce from separating */}
                <div className="relative flex flex-col h-full bg-[#0e0e0e] border border-white/5 rounded-2xl shadow-xl hover:border-orange-500/20 hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 group/card overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-orange-500 to-indigo-500 opacity-30 group-hover/card:opacity-100 transition-opacity z-10" />

                  {/* 👑 FIXED 3: Added pb-20 (Padding Bottom) so the text never touches the absolute footer */}
                  <Link
                    href={`/servers/${server.id}`}
                    className="flex-1 block w-full h-full outline-none p-3 md:p-6 pb-12 md:pb-20"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="shrink-0 w-13 h-13 md:w-16 md:h-16 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-xl font-black text-gray-400 shadow-inner group-hover/card:scale-105 transition-transform duration-300 uppercase overflow-hidden relative">
                        {server.iconUrl ? (
                          <Image
                            src={server.iconUrl}
                            alt={server.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          server.name.charAt(0)
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg md:text-2xl font-bold text-white group-hover/card:text-orange-400 transition-colors tracking-tight line-clamp-2 mb-1.5">
                          {server.name}
                        </h3>

                        <div className="flex flex-wrap md:flex-nowrap items-center gap-1.5 md:gap-2">
                          {/* 👑 MEMBER COUNT PILL: Responsive font sizing and padding */}
                          <span className="bg-white/5 border border-white/10 text-gray-200 text-[10px] md:text-xs font-bold md:font-extrabold px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg flex items-center gap-1 md:gap-1.5 select-none shrink-0 tracking-wide whitespace-nowrap">
                            <Users
                              size={10}
                              className="text-indigo-400 md:w-3 md:h-3"
                            />
                            {server.memberCount?.toLocaleString() || 0}
                            <span className="hidden md:inline"> Members</span>
                          </span>

                          {/* 👑 LIVE TIMING PILL: Balanced for tight phone viewports */}
                          <div
                            className={`shrink-0 flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold md:font-extrabold border tracking-wide whitespace-nowrap ${
                              server.lastChallengeAt
                                ? "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                                : "bg-white/2 text-gray-500 border-white/4"
                            }`}
                          >
                            <Activity
                              size={10}
                              className={`md:w-3 md:h-3 ${
                                server.lastChallengeAt
                                  ? "animate-pulse"
                                  : "opacity-30"
                              }`}
                            />

                            {server.lastChallengeAt
                              ? formatDistanceToNow(
                                  new Date(server.lastChallengeAt),
                                  { addSuffix: false },
                                )
                                  .replace("less than a minute", "1m")
                                  .replace("about ", "")
                                  .replace(" hours", "h")
                                  .replace(" hour", "h")
                                  .replace(" h", "h")
                                  .replace(" minutes", "m")
                                  .replace(" minute", "m")
                                  .replace(" m", " m")
                                  .replace("less than a minute", "1m")
                              : "Never Active"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed line-clamp-3">
                      {server.description ||
                        "No description provided for this server."}
                    </p>
                  </Link>

                  {/* 👑 FIXED 4: Footer is now safely pinned to the bottom of the animated card */}
                  <div className="absolute bottom-0 left-0 w-full p-3 md:p-6 pt-0 flex items-end justify-between gap-4 pointer-events-none">
                    {/* Tags Container with max-width so they don't squish the Join button */}
                    <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto max-w-[70%]">
                      {server.tags && server.tags.length > 0 ? (
                        server.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`items-center gap-1 bg-white/5 text-gray-400 border border-white/5 hover:border-white/10 hover:text-white transition-colors text-[8px] md:text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider select-none truncate ${
                              idx === 2 ? "hidden lg:flex" : "flex"
                            }`}
                          >
                            <Hash
                              size={10}
                              className="text-orange-500/50 shrink-0"
                            />
                            <span className="truncate">{tag}</span>
                          </span>
                        ))
                      ) : server.category ? (
                        <span className="flex items-center gap-1 bg-white/5 text-gray-400 border border-white/5 hover:border-white/10 hover:text-white transition-colors text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider select-none truncate max-w-full">
                          <LayoutGrid
                            size={10}
                            className="text-orange-500/50 shrink-0"
                          />
                          <span className="truncate">{server.category}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-600 italic">
                          No tags assigned
                        </span>
                      )}
                    </div>

                    <a
                      href={server.inviteLink || "https://discord.gg"}
                      target="_blank"
                      rel="noopener noreferrer"
                       className="pointer-events-auto px-4.5 py-1.5 md:px-6 md:py-2.5 bg-[#ff5500] hover:bg-[#ff7733] text-white text-[11px] md:text-sm font-black rounded-lg transition-all transform active:scale-95 group-hover/card:shadow-[0_0_15px_rgba(255,85,0,0.3)] tracking-wider uppercase cursor-pointer shrink-0"
>
                      Join
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
