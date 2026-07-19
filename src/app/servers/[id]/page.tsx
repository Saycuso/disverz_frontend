"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ExternalLink, Hash, Clock } from "lucide-react";
import Image from "next/image";

interface ServerDetails {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  tags: string[];
  language: string;
  rawScore: number;
  inviteLink: string;
  lastHumanMsgAt: string | null;
}

export default function ServerProfile() {
  const params = useParams();
  const router = useRouter();
  const serverId = params.id as string;

  const [server, setServer] = useState<ServerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServerDetails = async () => {
      try {
        // Fetching the specific server's intelligence from your PostgreSQL database
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/servers/${serverId}`,
        );
        if (res.ok) {
          const data = await res.json();
          setServer(data);
        } else {
          console.error("Failed to fetch server details");
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (serverId) fetchServerDetails();
  }, [serverId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-pulse text-orange-500 font-bold text-xl">
          Loading Pulse Data...
        </div>
      </main>
    );
  }

  if (!server) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Server Not Found</h1>
        <button
          onClick={() => router.push("/")}
          className="text-orange-500 hover:underline"
        >
          Return to Feed
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto mt-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          Back to Feed
        </button>

        {/* Server Header */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
            {server.iconUrl ? (
              <Image
                src={server.iconUrl}
                alt={server.name}
                width={128}
                height={128}
                className="w-32 h-32 rounded-2xl shadow-lg border border-white/10"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl shadow-lg border border-white/10 bg-[#1a1a1a] flex items-center justify-center text-4xl font-bold text-gray-500">
                {server.name.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                {server.name}
              </h1>
              <p className="text-gray-300 text-lg mb-4 max-w-2xl leading-relaxed">
                {server.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {server.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-[#2b2d31] text-gray-200 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    <Hash size={14} className="text-orange-500" /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Panel */}
            <div className="bg-black/50 border border-white/10 p-6 rounded-xl min-w-62.5 flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm font-semibold text-gray-400">
                <span>Last Active</span>
                <span className="text-orange-500 flex items-center gap-1">
                  <Clock size={16} /> 
                  {server.lastHumanMsgAt ? new Date(server.lastHumanMsgAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                </span>
              </div>
              <a
                href={server.inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/20"
              >
                Join Server <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
