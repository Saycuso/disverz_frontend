import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Flame, Activity, Hash, LayoutGrid } from "lucide-react";
import Image from "next/image";

// 👑 Upgraded the interface to anticipate both new tags and old category data, plus iconUrls
interface ServerType {
  id: string;
  name: string;
  description: string;
  category?: string; 
  tags?: string[];
  memberCount: number;
  lastChallengeAt: string | null;
  iconUrl?: string | null;
}

// Force Next.js to always fetch fresh data, never cache the live feed
export const dynamic = "force-dynamic";

async function getActiveServers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servers?sort=active`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch servers");
  return res.json();
}

export default async function Home() {
  const { data: servers } = await getActiveServers();

  return (
    <main className="min-h-screen bg-[#060606] text-white p-6 md:p-12 selection:bg-orange-500/30">
      
      {/* Header section */}
      <div className="max-w-5xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-orange-500/10 border border-orange-500/20">
          <Flame size={32} className="text-orange-500 animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-red-500 to-indigo-500">
            Disverz
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          The only server list where rank is determined by real human activity. 
          <br className="hidden md:block"/> No dead communities. No bot spam.
        </p>
      </div>

      {/* The Pulse Feed */}
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3 text-white font-bold tracking-widest uppercase text-sm">
            <Activity size={18} className="text-orange-500" />
            <h2>Live Pulse Feed</h2>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {servers.length} Active {servers.length === 1 ? 'Server' : 'Servers'}
          </span>
        </div>

        {servers.length === 0 ? (
          <div className="text-center p-16 bg-[#111] rounded-2xl border border-white/5 shadow-2xl">
            <Activity size={48} className="text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 font-medium">The feed is currently silent. No servers are active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server: ServerType) => (
              <Link href={`/servers/${server.id}`} key={server.id} className="block w-full h-full outline-none">
                {/* 👑 Enhanced Vertical Card Layout */}
                <div className="flex flex-col h-full bg-[#0e0e0e] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-orange-500/20 transition-all duration-300 shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1">
                  
                  {/* Top Gradient Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-orange-500 to-indigo-500 opacity-30 group-hover:opacity-100 transition-opacity" />

                  {/* Header Block: Identity and Metrics Meta */}
                  <div className="flex items-start gap-4 mb-4">
                    
                    {/* Server Avatar Box */}
                    <div className="shrink-0 w-14 h-14 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-xl font-black text-gray-400 shadow-inner group-hover:scale-105 transition-transform duration-300 uppercase overflow-hidden relative">
                      {server.iconUrl ? (
                        <Image src={server.iconUrl} alt={server.name} fill className="object-cover" />
                      ) : (
                        server.name.charAt(0)
                      )}
                    </div>

                    {/* Title & Status Pills Stack */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors tracking-tight truncate mb-1.5">
                        {server.name}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Member Count Badge */}
                        <span className="bg-white/5 border border-white/5 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5 select-none shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                          {server.memberCount?.toLocaleString() || 0}
                        </span>

                        {/* Last Active Timestamp Badge */}
                        <div className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          server.lastChallengeAt 
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.1)]' 
                            : 'bg-neutral-800 text-gray-400 border-white/5'
                        }`}>
                          <Activity size={10} className={server.lastChallengeAt ? "animate-pulse" : ""} />
                          {server.lastChallengeAt 
                            ? formatDistanceToNow(new Date(server.lastChallengeAt), { addSuffix: true }) 
                            : "Never Active"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clean Content Area */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">
                    {server.description || "No description provided for this server."}
                  </p>

                  {/* Tag Array Footer - Locked uniformly to the card base */}
                  <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/5">
                    {server.tags && server.tags.length > 0 ? (
                      server.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="flex items-center gap-1 bg-white/5 text-gray-400 border border-white/5 hover:border-white/10 hover:text-white transition-colors text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider select-none">
                          <Hash size={10} className="text-orange-500/50" />
                          {tag}
                        </span>
                      ))
                    ) : server.category ? (
                      <span className="flex items-center gap-1 bg-white/5 text-gray-400 border border-white/5 hover:border-white/10 hover:text-white transition-colors text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider select-none">
                        <LayoutGrid size={10} className="text-orange-500/50" />
                        {server.category}
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-600 italic">No tags assigned</span>
                    )}
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
