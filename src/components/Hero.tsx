import Link from "next/link";
import { Zap, ChevronRight, Activity, ShieldCheck, Radio } from "lucide-react";

interface HeroProps {
  activeServerCount?: number;
}

export default function Hero({ activeServerCount = 0 }: HeroProps) {
  return (
    <div className="relative w-full overflow-hidden bg-[#060606] pt-8 pb-0 md:pt-16 md:pb-24 flex flex-col items-center selection:bg-orange-500/30">
      {/* 👑 ADVANCED BACKGROUND EFFECTS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] sm:w-[80%] max-w-200 h-75 bg-linear-to-r from-orange-500/20 via-red-500/10 to-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 👑 MAIN CONTENT CONTAINER */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,85,0,0.1)] mb-6 md:mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-widest">
            The New Standard for Discord
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.2] sm:leading-[1.1] mb-6 max-w-4xl mx-auto">
          Find Discord Servers That Are{" "}
          <span className="relative whitespace-nowrap">
            <span className="absolute -inset-1 bg-orange-500/20 blur-xl rounded-full" />
            <span className="relative text-transparent bg-clip-text bg-linear-to-r from-[#ff5500] via-[#ff7733] to-[#a855f7]">
              Actually Alive
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10 px-2">
          Stop joining graveyards. Disverz is the first platform that ranks
          communities purely by{" "}
          <span className="text-white font-bold">
            real-time human activity.
          </span>{" "}
          No bot spam. No pay-to-win bumps. Just active chats.
        </p>

        {/* Dual Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto px-4 mb-10 md:mb-14">
          <Link
            href="/dashboard"
            className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 md:px-8 md:py-3.5 bg-[#ff5500] hover:bg-[#ff7733] text-white text-xs md:text-sm font-black rounded-lg md:rounded-xl transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(255,85,0,0.25)] hover:shadow-[0_0_35px_rgba(255,85,0,0.45)] uppercase tracking-wider overflow-hidden whitespace-nowrap"
          >
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            List Your Server Free
            <Zap className="animate-pulse h-4 w-4 md:h-4.5 md:w-4.5" />
          </Link>

          <Link
            href="#live-feed"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 md:px-8 md:py-3.5 bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/40 text-xs md:text-sm font-bold rounded-lg md:rounded-xl transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            Explore Live Feed
            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition-transform text-purple-200 group-hover:text-white"
            />
          </Link>
        </div>

        {/* 👑 REAL PLATFORM STATS BAR (Replaces Fake Floating Pills) */}
        <div className="hidden md:flex w-full max-w-2xl bg-[#0d0d0e]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl items-center justify-around gap-3 text-sm font-bold">
          {/* Stat 1: Real Live Count */}
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-white font-extrabold">{activeServerCount}</span>
            <span className="text-gray-400">Active Communities</span>
          </div>

          <div className="hidden sm:block text-white/10">|</div>

          {/* Stat 2: Verification */}
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-orange-400" />
            <span className="text-gray-300">Human Verification</span>
          </div>

          <div className="hidden sm:block text-white/10">|</div>

          {/* Stat 3: Realtime Engine */}
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-indigo-400" />
            <span className="text-gray-300">Live Messages</span>
          </div>
        </div>

        {/* 👑 Ambient Section Divider */}
        <div className="hidden w-full max-w-7xl mx-auto mt-10 md:mt-14">
          <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </div>
  );
}