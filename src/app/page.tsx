import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Flame, Activity, Hash, LayoutGrid } from "lucide-react";
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servers?sort=active`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch servers");
  return res.json();
}

export default async function Home() {
  const { data: servers } = await getActiveServers();

  return (
    <main className="min-h-screen text-white px-0 md:px-0 selection:bg-orange-500/30 relative">
       {/* 👑 THE AMBIENT GLOW BACKDROP */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[350px] bg-linear-to-r from-orange-500/10 via-red-500/5 to-indigo-500/10 rounded-full blur-[130px] pointer-events-none select-none -z-10" />
      
      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-16 text-center relative">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-orange-500/10 border border-orange-500/20">
          <Flame size={32} className="text-orange-500 animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-red-500 to-indigo-500">
            Disverz
          </span>
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
          The only server list where rank is determined by real human activity. 
          <br className="hidden md:block"/> No dead communities. No bot spam.
        </p>
      </div>

      {/* The Pulse Feed */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3 text-white font-bold tracking-widest uppercase text-sm">
            <Activity size={18} className="text-orange-500" />
            <h2>Live Pulse Feed</h2>
          </div>
          <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">
            {servers.length} Active {servers.length === 1 ? 'Server' : 'Servers'}
          </span>
        </div>

        {servers.length === 0 ? (
          <div className="text-center p-16 bg-[#111] rounded-2xl border border-white/5 shadow-2xl">
            <Activity size={48} className="text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 font-medium">The feed is currently silent. No servers are active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servers.map((server: ServerType) => (
              <div key={server.id} className="relative group/card h-full">
                {/* Main Clickable Card Link */}
                <Link href={`/servers/${server.id}`} className="block w-full h-full outline-none">
                  <div className="flex flex-col h-full bg-[#0e0e0e] border border-white/5 p-6 rounded-2xl overflow-hidden relative shadow-xl hover:border-orange-500/20 hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300">
                    
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-orange-500 to-indigo-500 opacity-30 group-hover/card:opacity-100 transition-opacity" />

                    <div className="flex items-start gap-4 mb-4">
                      <div className="shrink-0 w-16 h-16 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-xl font-black text-gray-400 shadow-inner group-hover/card:scale-105 transition-transform duration-300 uppercase overflow-hidden relative">
                        {server.iconUrl ? (
                          <Image src={server.iconUrl} alt={server.name} fill className="object-cover" />
                        ) : (
                          server.name.charAt(0)
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-2xl font-bold text-white group-hover/card:text-orange-400 transition-colors tracking-tight line-clamp-2 mb-2">
                          {server.name}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="bg-white/5 border border-white/10 text-gray-200 text-xs font-extrabold px-3 py-1 rounded-lg flex items-center gap-2 select-none shrink-0 tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
                            {server.memberCount?.toLocaleString() || 0} Members
                          </span>

                          <div className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold border tracking-wide ${
                            server.lastChallengeAt 
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.15)]' 
                              : 'bg-white/2 text-gray-500 border-white/4'
                          }`}>
                            <Activity size={12} className={server.lastChallengeAt ? "animate-pulse" : "opacity-30"} />
                            {server.lastChallengeAt 
                              ? formatDistanceToNow(new Date(server.lastChallengeAt), { addSuffix: true }) 
                              : "Never Active"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed mb-16 line-clamp-3">
                      {server.description || "No description provided for this server."}
                    </p>

                  </div>
                </Link>

                {/* 👑 ACTION FOOTER: Positioned perfectly inside the absolute layer to balance tags and the Join button */}
                <div className="absolute bottom-0 left-0 w-full p-6 flex items-center justify-between gap-4 pointer-events-none">
                  
                  {/* Tags Left Aligned */}
                  <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
                    {server.tags && server.tags.length > 0 ? (
                      server.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="flex items-center gap-1 bg-white/5 text-gray-400 border border-white/5 hover:border-white/10 hover:text-white transition-colors text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider select-none">
                          <Hash size={10} className="text-orange-500/50" />
                          {tag}
                        </span>
                      ))
                    ) : server.category ? (
                      <span className="flex items-center gap-1 bg-white/5 text-gray-400 border border-white/5 hover:border-white/10 hover:text-white transition-colors text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider select-none">
                        <LayoutGrid size={10} className="text-orange-500/50" />
                        {server.category}
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-600 italic">No tags assigned</span>
                    )}
                  </div>

                  {/* 🚀 Independent Join Server Trigger Box */}
                  <a
                    href={server.inviteLink || "https://discord.gg"} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto px-4 py-1.5 bg-[#ff5500] hover:bg-[#ff7733] text-white text-xs font-black rounded-lg transition-all transform active:scale-95 group-hover/card:shadow-[0_0_15px_rgba(255,85,0,0.3)] tracking-wider uppercase cursor-pointer"
                  >
                    Join
                  </a>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}