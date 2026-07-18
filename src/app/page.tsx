import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Flame, Users, LayoutGrid, ChevronRight } from "lucide-react";

interface ServerType {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  lastChallengeAt: string | null;
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
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* Header section */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-600">
            Disverz
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          The only server list where rank is determined by real human activity. 
          <br/>No dead communities. No bot spam.
        </p>
      </div>

      {/* The Pulse Feed */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-2 mb-6 text-orange-500 font-semibold">
          <Flame size={20} />
          <h2>LIVE PULSE FEED</h2>
        </div>

        {servers.length === 0 ? (
          <div className="text-center p-12 bg-[#111] rounded-xl border border-white/5">
            <p className="text-gray-500">No servers are currently active.</p>
          </div>
        ) : (
          servers.map((server: ServerType) => (
            <Link href={`/servers/${server.id}`} key={server.id}>
              <div className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#111] hover:bg-[#161616] border border-white/5 hover:border-orange-500/30 rounded-xl transition-all cursor-pointer">
                
                <div className="flex flex-col mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-gray-100 group-hover:text-orange-400 transition-colors">
                    {server.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-1 max-w-lg">
                    {server.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                      <LayoutGrid size={14} />
                      {server.category.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                      <Users size={14} />
                      {server.memberCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 md:w-48 text-right">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                      Last Active
                    </span>
                    <span className="text-sm text-orange-400 font-medium bg-orange-400/10 px-2 py-1 rounded flex items-center gap-1">
                      <Flame size={14} />
                      {server.lastChallengeAt 
                        ? formatDistanceToNow(new Date(server.lastChallengeAt), { addSuffix: true }) 
                        : "Just now"}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-gray-600 group-hover:text-orange-500 transition-colors" />
                </div>

              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}