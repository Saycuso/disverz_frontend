"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ExternalLink,
  Hash,
  Clock,
  Globe,
  Activity,
  ShieldCheck,
  Zap,
  Calendar,
  Plus,
} from "lucide-react";
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
  createdAt: string;
  lastChallengeAt: string | null;
  memberCount: number;
}

export default function ServerProfile() {
  const params = useParams();
  const router = useRouter();
  const serverId = params.id as string;

  const [server, setServer] = useState<ServerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const fetchServerDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/servers/${serverId}`,
        );
        if (res.ok) {
          const data = await res.json();
          setServer(data);
          setCurrentTime(Date.now());
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
        <div className="animate-pulse text-orange-500 font-bold text-lg md:text-xl">
          Loading Pulse Data...
        </div>
      </main>
    );
  }

  if (!server) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Server Not Found</h1>
        <button
          onClick={() => router.push("/")}
          className="text-orange-500 hover:underline text-sm md:text-base"
        >
          Return to Feed
        </button>
      </main>
    );
  }

  // 👑 The Trust Badge Logic Engine
  const isVerified = server.lastChallengeAt !== null;
  const isActive =
    server.lastChallengeAt &&
    currentTime - new Date(server.lastChallengeAt).getTime() <
      24 * 60 * 60 * 1000;

  const formattedListedDate = new Date(server.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short", // 👑 Mobile optimization: "Oct" instead of "October" to save space
      year: "numeric",
    },
  );

  return (
    <main className="min-h-screen bg-[#060606] text-white px-4 py-6 md:py-12 flex flex-col items-center selection:bg-orange-500/30">
      <div className="max-w-7xl w-full">
        {/* Dynamic Navigation Breadcrumb Row */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[11px] md:text-xs font-semibold text-gray-500 hover:text-white transition-colors mb-4 md:mb-6 group w-fit cursor-pointer p-2 -ml-2"
        >
          <ChevronLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Feed
        </button>

        {/* 🚀 THE MASTER DASHBOARD CANVAS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-start w-full">
          
          {/* 🔥 LEFT COLUMN: Main Server Identity Info Panel */}
          <div className="lg:col-span-8 relative bg-[#111]/60 border border-white/5 p-5 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Ambient Purple/Orange Glow Graphics in background */}
            <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row gap-5 md:gap-6 items-start sm:items-center md:items-start relative z-10">
              
              {/* Server Avatar Layout Profile frame */}
              <div className="relative group shrink-0 mx-auto sm:mx-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-indigo-500 rounded-xl md:rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-500" />
                {server.iconUrl ? (
                  <Image
                    src={server.iconUrl}
                    alt={server.name}
                    width={112}
                    height={112}
                    // 👑 Scaled down to w-20 on mobile, w-28 on desktop
                    className="w-20 h-20 md:w-28 md:h-28 rounded-xl md:rounded-2xl relative z-10 border border-white/10 object-cover shadow-2xl"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl md:rounded-2xl relative z-10 border border-white/10 bg-[#1a1a1a] flex items-center justify-center text-2xl md:text-3xl font-black text-gray-400 select-none shadow-2xl uppercase">
                    {server.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Profile Context Text Hierarchy Block */}
              <div className="flex-1 text-center sm:text-left w-full overflow-hidden min-w-0">
                {/* 👑 ROW 1: Clean, Heavy Server Title Layout */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight mb-2 md:mb-3 truncate">
                  {server.name}
                </h1>

                {/* 👑 ROW 2: Balanced Meta Stats Row */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3 md:mb-3.5">
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] md:text-xs font-bold px-2.5 py-1 md:px-3 rounded-full uppercase tracking-wider select-none shrink-0">
                    Level 1 Pulse
                  </span>

                  <span className="bg-neutral-800 border border-white/5 text-gray-300 text-[10px] md:text-xs font-bold px-2.5 py-1 md:px-3 rounded-full flex items-center gap-1.5 select-none shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                    {server.memberCount?.toLocaleString() || 0} Members
                  </span>
                </div>

                {/* 👑 THE FIX: Replaced custom class with break-words whitespace-pre-wrap to handle long links perfectly */}
                <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-4 md:mb-5 max-w-xl break-words whitespace-pre-wrap">
                  {server.description || "No server description provided."}
                </p>

                {/* Modern Micro Tag Badges Layout */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {server.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-neutral-800 text-gray-300 hover:text-white border border-white/5 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-200 select-none cursor-default shrink-0"
                    >
                      <Hash size={10} className="text-orange-500/70 md:w-3 md:h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 👑 RIGHT COLUMN: Floating Action Vitals Card Panel */}
          <div className="lg:col-span-4 bg-[#111] border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl shadow-2xl relative overflow-hidden lg:sticky lg:top-24 w-full group">
            {/* Top colored accent indicator line decoration graphic */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-indigo-500" />

            <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 md:mb-4">
              Vitals & Connectivity
            </h3>

            <div className="space-y-2.5 md:space-y-3.5 mb-4 md:mb-5">
              {/* Last Active tracking list metric box */}
              <div className="flex justify-between items-center bg-black/30 border border-white/5 p-2.5 md:p-3 rounded-lg md:rounded-xl text-[11px] md:text-xs font-medium">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Activity size={14} className="text-gray-500 md:w-4 md:h-4" /> Activity
                  Pulse
                </span>
                <span className="text-orange-400 flex items-center gap-1 font-bold">
                  <Clock size={12} className="md:w-3.5 md:h-3.5" />
                  {server.lastHumanMsgAt
                    ? new Date(server.lastHumanMsgAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Active Now"}
                </span>
              </div>

              {/* Platform Language tracking metric box */}
              <div className="flex justify-between items-center bg-black/30 border border-white/5 p-2.5 md:p-3 rounded-lg md:rounded-xl text-[11px] md:text-xs font-medium">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Globe size={14} className="text-gray-500 md:w-4 md:h-4" /> Language
                </span>
                <span className="text-white font-bold uppercase tracking-wider text-[10px] md:text-[11px]">
                  {server.language || "English"}
                </span>
              </div>
            </div>

            {/* Premium call-to-action Discord gateway hyperlink button */}
            <a
              href={server.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2.5 md:py-3 px-4 rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs md:text-sm shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 active:scale-95"
            >
              Join Community <ExternalLink size={14} className="md:w-4 md:h-4" />
            </a>
          </div>
        </div>

        {/* 👑 BOTTOM FLANK: Trust Badges & Growth Loop CTA */}
        <div className="mt-6 md:mt-8 border-t border-white/5 pt-6 md:pt-8 w-full flex flex-col gap-5 md:gap-6">
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-3">
            {isVerified && (
              <div className="flex items-center gap-1 md:gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold select-none shrink-0">
                <ShieldCheck size={12} className="md:w-3.5 md:h-3.5" />
                Human verified
              </div>
            )}

            {isActive && (
              <div className="flex items-center gap-1 md:gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold select-none shrink-0">
                <Zap size={12} className="md:w-3.5 md:h-3.5" />
                Active community
              </div>
            )}

            <div className="flex items-center gap-1 md:gap-1.5 bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold select-none shrink-0">
              <Calendar size={12} className="md:w-3.5 md:h-3.5" />
              Listed {formattedListedDate}
            </div>
          </div>

          {/* Growth Loop CTA Card */}
          <div className="bg-[#111] border border-white/5 p-5 md:p-8 rounded-xl md:rounded-2xl flex flex-col sm:flex-row items-center sm:items-start md:items-center justify-between gap-4 md:gap-6 shadow-xl transition-colors hover:border-white/10 text-center sm:text-left">
            <div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-1.5 tracking-tight">
                Own a server like this?
              </h3>
              <p className="text-[11px] md:text-sm text-gray-400 max-w-xl leading-relaxed">
                List your community on Disverz for free. Real rankings based on
                real human activity — no bump bots, no pay to win.
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              // 👑 Full width on mobile, auto width on desktop
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white/40 px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all duration-200 active:scale-95"
            >
              <Plus size={14} className="md:w-4 md:h-4" />
              List your server free
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}