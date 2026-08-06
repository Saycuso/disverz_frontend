"use client";

import { useState } from "react";
import { Timer, Link2, ShieldCheck } from "lucide-react";

export default function WhyUsCarousel() {
  const [activeCard, setActiveCard] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.clientWidth;
    const newIndex = Math.round(scrollPosition / cardWidth);
    
    if (newIndex !== activeCard && newIndex >= 0 && newIndex <= 2) {
      setActiveCard(newIndex);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-0 py-6 md:py-16">
      {/* Carousel Wrapper - Constrained to 100% width of the padding bounds */}
      <div 
        onScroll={handleScroll}
        className="flex flex-row md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-2 md:pb-0 w-full"
      >
        {/* Card 1 */}
        <div className="bg-[#0e0e0e]/80 backdrop-blur-md border border-white/5 p-5 md:p-6 rounded-2xl hover:border-orange-500/30 transition-colors group w-full md:w-full snap-center shrink-0">
          <div className="flex items-center gap-2.5 md:gap-3 mb-2 md:mb-4">
            <Timer className="text-orange-500 group-hover:scale-110 transition-transform shrink-0 h-5 w-5 md:h-6 md:w-6"/>
            <h3 className="text-white font-black text-sm md:text-lg tracking-tight">Real Activity Timestamps</h3>
          </div>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
            See the exact time a real human last messaged before you join. No guessing if a server is alive.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0e0e0e]/80 backdrop-blur-md border border-white/5 p-5 md:p-6 rounded-2xl hover:border-indigo-500/30 transition-colors group w-full md:w-full snap-center shrink-0">
          <div className="flex items-center gap-2.5 md:gap-3 mb-2 md:mb-4">
            <Link2 className="text-indigo-500 group-hover:scale-110 transition-transform shrink-0 h-5 w-5 md:h-6 md:w-6" />
            <h3 className="text-white font-black text-sm md:text-lg tracking-tight">Auto Permanent Invite</h3>
          </div>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
            Our bot creates a permanent invite link to your server automatically. No expired links. No setup headaches.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0e0e0e]/80 backdrop-blur-md border border-white/5 p-5 md:p-6 rounded-2xl hover:border-emerald-500/30 transition-colors group w-full md:w-full snap-center shrink-0">
          <div className="flex items-center gap-2.5 md:gap-3 mb-2 md:mb-4">
            <ShieldCheck className="text-emerald-500 group-hover:scale-110 transition-transform shrink-0 h-5 w-5 md:h-6 md:w-6"/>
            <h3 className="text-white font-black text-sm md:text-lg tracking-tight">Human Trivia Verification</h3>
          </div>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
           {" Servers prove activity by answering a trivia question. Bots can't pass. Dead servers can't fake it."}
          </p>
        </div>
      </div>

      {/* 🔘 THE CAROUSEL DOT INDICATORS */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeCard === index 
                ? "w-4 bg-[#ff5500]" 
                : "w-1.5 bg-white/20" 
            }`}
          />
        ))}
      </div>
    </div>
  );
}