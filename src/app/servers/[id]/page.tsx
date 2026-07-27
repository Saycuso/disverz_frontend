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
        // Fetching the specific server's intelligence from your PostgreSQL database
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

  // 👑 The Trust Badge Logic Engine
  const isVerified = server.lastChallengeAt !== null;

  const isActive =
    server.lastChallengeAt &&
    currentTime - new Date(server.lastChallengeAt).getTime() <
      24 * 60 * 60 * 1000;

  const formattedListedDate = new Date(server.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    // 👑 FIXED: Standardized responsive padding and page container blocks
    <main className="min-h-screen bg-[#060606] text-white px-4 py-8 md:py-12 flex flex-col items-center selection:bg-orange-500/30">
      <div className="max-w-7xl w-full">
        {/* Dynamic Navigation Breadcrumb Row */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-white transition-colors mb-6 group w-fit cursor-pointer"
        >
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Feed
        </button>

        {/* 🚀 THE MASTER DASHBOARD CANVAS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* 🔥 LEFT COLUMN: Main Server Identity Info Panel (Takes up 8 columns) */}
          <div className="lg:col-span-8 relative bg-[#111]/60 border border-white/5 p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
            {/* Ambient Purple/Orange Glow Graphics in background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
              {/* Server Avatar Layout Profile frame */}
              <div className="relative group shrink-0 mx-auto sm:mx-0">
                <div className="absolute inset-0 bg-linear-to-tr from-orange-500 to-indigo-500 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-500" />
                {server.iconUrl ? (
                  <Image
                    src={server.iconUrl}
                    alt={server.name}
                    width={112}
                    height={112}
                    className="w-28 h-28 rounded-2xl relative z-10 border border-white/10 object-cover shadow-2xl"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-2xl relative z-10 border border-white/10 bg-[#1a1a1a] flex items-center justify-center text-3xl font-black text-gray-400 select-none shadow-2xl uppercase">
                    {server.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Profile Context Text Hierarchy Block */}
              <div className="flex-1 text-center sm:text-left w-full overflow-hidden">
                {/* 👑 ROW 1: Clean, Heavy Server Title Layout */}
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-none mb-3">
                  {server.name}
                </h1>

                {/* 👑 ROW 2: Balanced Meta Stats Row (Both pills grouped cleanly below) */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-3.5">
                  {/* Pulse Level Pill */}
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider select-none">
                    Level 1 Pulse
                  </span>

                  {/* Member Count Pill */}
                  <span className="bg-neutral-800 border border-white/5 text-gray-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                    {server.memberCount?.toLocaleString() || 0} Members
                  </span>
                </div>

                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-5 max-w-xl wrap-break-word">
                  {server.description || "No server description provided."}
                </p>

                {/* Modern Micro Tag Badges Layout */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                  {server.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-neutral-800 text-gray-300 hover:text-white border border-white/5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors duration-200 select-none cursor-default"
                    >
                      <Hash size={12} className="text-orange-500/70" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 👑 RIGHT COLUMN: Floating Floating Action Vitals Card Panel (Takes up 4 columns) */}
          <div className="lg:col-span-4 bg-[#111] border border-white/5 p-5 rounded-2xl shadow-2xl relative overflow-hidden lg:sticky lg:top-8 w-full group">
            {/* Top colored accent indicator line decoration graphic */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-orange-500 to-indigo-500" />

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Vitals & Connectivity
            </h3>

            <div className="space-y-3.5 mb-5">
              {/* Last Active tracking list metric box */}
              <div className="flex justify-between items-center bg-black/30 border border-white/5 p-3 rounded-xl text-xs font-medium">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Activity size={14} className="text-gray-500" /> Activity
                  Pulse
                </span>
                <span className="text-orange-400 flex items-center gap-1 font-bold">
                  <Clock size={14} />
                  {server.lastHumanMsgAt
                    ? new Date(server.lastHumanMsgAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Active Now"}
                </span>
              </div>

              {/* Platform Language tracking metric box */}
              <div className="flex justify-between items-center bg-black/30 border border-white/5 p-3 rounded-xl text-xs font-medium">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Globe size={14} className="text-gray-500" /> Language
                </span>
                <span className="text-white font-bold uppercase tracking-wider text-[11px]">
                  {server.language || "English"}
                </span>
              </div>
            </div>

            {/* Premium call-to-action Discord gateway hyperlink button */}
            <a
              href={server.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transform hover:-translate-y-0.5"
            >
              Join Community <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* 👑 BOTTOM FLANK: Live Activity Feed Area Box Grid Placeholder */}
        {/* This makes the page look completely professional by showing the active game feed history logs underneath */}

        {/* 👑 BOTTOM FLANK: Trust Badges & Growth Loop CTA */}
        <div className="mt-8 border-t border-white/5 pt-8 w-full flex flex-col gap-6">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {isVerified && (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold select-none">
                <ShieldCheck size={14} />
                Human verified activity
              </div>
            )}

            {isActive && (
              <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-xs font-semibold select-none">
                <Zap size={14} />
                Active community
              </div>
            )}

            {/* The Listed badge is always shown, but now totally dynamic */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full text-xs font-semibold select-none">
              <Calendar size={14} />
              Listed {formattedListedDate}
            </div>
          </div>

          {/* Growth Loop CTA Card */}
          <div className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl transition-colors hover:border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight">
                Own a server like this?
              </h3>
              <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
                List your community on Disverz for free. Real rankings based on
                real human activity — no bump bots, no pay to win.
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="shrink-0 flex items-center gap-2 bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white/40 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <Plus size={16} />
              List your server free
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
