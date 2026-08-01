"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Settings, ChevronLeft } from "lucide-react";
import {TagInput} from "@/components/TagInput";
import Image from "next/image";

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
}
export default function SetupServer() {
  const params = useParams();
  const router = useRouter();
  const serverId = params.id as string;

  // The Ammunition
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [category, setCategory] = useState("gaming");
  const [tags, setTags] = useState<string[]>([]);
  const [isDescTouched, setIsDescTouched] = useState(false); // 👑 ADD THIS

// The Identity State
  const [serverName, setServerName] = useState("Loading...");
  const [serverIconUrl, setServerIconUrl] = useState<string | null>(null);

  // 👑 The Fetch Engine: Retrieve the specific server's identity
  useEffect(() => {
    const fetchGuildIdentity = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/api/auth/guilds`, {
          credentials: "include",
        });
        
        if (res.ok) {
          const guilds: DiscordGuild[] = await res.json();
          const targetGuild = guilds.find((g) => g.id === serverId);
          
          if (targetGuild) {
            setServerName(targetGuild.name);
            // Construct the official Discord CDN image URL if an icon exists
            if (targetGuild.icon) {
              setServerIconUrl(`https://cdn.discordapp.com/icons/${serverId}/${targetGuild.icon}.png`);
            }
          } else {
            setServerName("Unknown Server");
          }
        }
      } catch (err) {
        console.error("Failed to fetch server identity", err);
        setServerName("Unknown Server");
      }
    };

    if (serverId) {
      fetchGuildIdentity();
    }
  }, [serverId]);

  // 👑 The New Strike: Save & Invite
  const handleSaveAndInvite = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // We will save these details in the browser's sessionStorage temporarily
    // so we don't lose them when Discord redirects us back.
    sessionStorage.setItem(`disverz_setup_${serverId}`, JSON.stringify({
      description,
      tags,
      category,
      language
    }));

    // Construct the Discord Bot Authorization URL
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID; 
    const rawUrl = `${window.location.origin}/dashboard/verify`;
    const redirectUri = encodeURIComponent(rawUrl);
  
  
    // 👑 This URL forces the user to invite the bot to the specific server they chose
    const discordBotAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands&guild_id=${serverId}&disable_guild_select=true&redirect_uri=${redirectUri}&response_type=code`;

    // Execute the redirect
    window.location.href = discordBotAuthUrl;
  };

return (
    // 👑 FIXED: Added px-4 on mobile so it doesn't touch the screen edges, px-0 or md:px-8 on desktop depending on your layout wrapper
    <main className="min-h-screen bg-[#0a0a0a] text-white py-6 md:py-8 px-0 md:px-0 flex flex-col justify-start">
      <div className="max-w-7xl w-full mx-auto">
        
        {/* Back Button Layout */}
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-xs text-gray-400 hover:text-white transition-colors mb-3 md:mb-4 group w-fit cursor-pointer p-1 -ml-1"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />Server Selection
        </button>

        {/* Header Layout Section */}
        <div className="mb-5 md:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-2 md:gap-2.5">
            <Settings className="text-orange-500 animate-[spin_6s_linear_infinite] w-5 h-5 md:w-6 md:h-6 shrink-0" />
            Server Configuration
          </h1>
          <p className="text-[11px] md:text-xs text-gray-400 max-w-2xl leading-relaxed">
            Define your community parameters to invite the Disverz bot.
          </p>
        </div>

        {/* 🚀 THE TACTICAL WORKFLOW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start w-full">
          
          {/* LEFT COLUMN: Configuration Inputs */}
          {/* 👑 FIXED: Adjusted padding for mobile (p-4) vs desktop (p-6) */}
          <div className="lg:col-span-7 bg-[#111] border border-white/5 p-3 md:p-6 rounded-xl md:rounded-2xl shadow-2xl">
            <form onSubmit={handleSaveAndInvite} className="space-y-4 md:space-y-5">
              
              {/* Description Input */}
              <div>
                 <label className="block text-[10px] md:text-xs font-bold text-gray-400 mb-1.5 md:mb-2 uppercase tracking-wider">
                  Description <span className="text-orange-500">*</span>
                </label>
                <textarea
                  required
                  maxLength={2000}
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => setIsDescTouched(true)}
                  placeholder="What makes your community unique? (Min. 200 characters)"
                  className={`w-full bg-[#1a1a1a] border rounded-lg px-3 md:px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none transition-colors resize-none h-48 md:h-52 ${
                    isDescTouched && description.trim().length < 200
                      ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]' 
                      : 'border-white/10 focus:border-orange-500 focus:ring-orange-500/20'
                  }`}
                />
                
                {/* 👑 FIXED: Dynamic Footer flex-col on mobile so it stacks instead of crashing */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-1.5 px-1 gap-1 sm:gap-0">
                  <span className="text-[10px] md:text-[11px] font-bold">
                    {isDescTouched && description.trim().length < 200 ? (
                      <span className="text-red-500 animate-pulse">
                        ⚠️ Min 200 chars ({description.trim().length}/200)
                      </span>
                    ) : description.trim().length >= 200 ? (
                      <span className="text-emerald-500">✅ Length accepted</span>
                    ) : (
                      <span></span>
                    )}
                  </span>
                  <span className="text-[10px] md:text-[11px] text-gray-500 font-medium sm:text-right">
                    {description.length} / 2000 chars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 mb-1.5 md:mb-2 uppercase tracking-wider">
                  Tags (Max 5)
                </label>
                <TagInput tags={tags} setTags={setTags} maxTags={5} />
              </div>
              
              {/* Tags & Language Placement Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {/* Trivia Category Dropdown */}
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-gray-400 mb-1.5 md:mb-2 uppercase tracking-wider">
                    Trivia Category <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    // 👑 FIXED: h-10/h-11 for better touch targets
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-[#ff5500] transition-colors h-10 md:h-11 cursor-pointer"
                  >
                    <option value="anime">Anime</option>
                    <option value="art">Art & Design</option>
                    <option value="books">Books & Literature</option>
                    <option value="chill">Chill / Vibe</option>
                    <option value="coding">Coding & Dev</option>
                    <option value="education">Education & Science</option>
                    <option value="finance">Finance & Crypto</option>
                    <option value="gaming">Gaming</option>
                    <option value="meme">Memes & Internet</option>
                    <option value="movies">Movies & TV</option>
                    <option value="social">Social & Discord</option>
                    <option value="sports">Sports</option>
                    <option value="technology">Technology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-gray-400 mb-1.5 md:mb-2 uppercase tracking-wider">
                    Main Language <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    // 👑 FIXED: h-10/h-11 for better touch targets
                     className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-[#ff5500] transition-colors h-10 md:h-11 cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
              </div>

              <div className="border-b border-white/5 pt-2" />

              {/* Discord Gateway Submission Action */}
              <button
                type="submit"
                disabled={description.trim().length < 200}
                className="w-full font-bold py-1.5 md:py-3.5 rounded-lg md:rounded-xl transition-all flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-wider
                bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-indigo-500/20 
               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/5 active:scale-[0.98]"
              >
                {/* 👑 Using standard image/icon scale down for mobile */}
                <span className="text-base md:text-lg">🤖</span>
                Save & Invite Disverz Bot
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: Real-Time Live Feed Card Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-3 md:space-y-4">
            <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">
              Live Feed Card Preview
            </label>
            
            {/* Card Frame */}
            <div className="bg-[#111] border border-white/10 p-4 md:p-5 rounded-xl md:rounded-2xl shadow-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-orange-500 to-indigo-500" />
              
             {/* Card Profile Row Header - Now 100% Dynamic */}
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                {serverIconUrl ? (
                  <Image
                    src={serverIconUrl}
                    alt={serverName}
                    width={48}
                    height={48}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border border-white/5 shadow-inner select-none shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-neutral-800 border border-white/5 flex items-center justify-center font-black text-gray-400 text-lg md:text-xl shadow-inner select-none uppercase shrink-0">
                    {serverName.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1"> 
                  <h3 className="font-bold text-sm md:text-base text-white tracking-wide truncate">{serverName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-[10px] md:text-[11px] text-gray-500 font-medium truncate">{language || "English"}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Card Description Area Box */}
              <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed min-h-12 bg-black/30 border border-white/5 p-3 rounded-lg wrap-break-word whitespace-pre-wrap mb-3 md:mb-4 italic">
                {description || "Your custom description string will render out live across this public block zone..."}
              </p>

              {/* Tag Array Target Output */}
              <div className="flex flex-wrap gap-1.5">
                {tags.length === 0 ? (
                  <span className="text-[10px] text-gray-600 select-none">No tags applied yet</span>
                ) : (
                  tags.map((tag, idx) => (
                    <span key={idx} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      #{tag}
                    </span>
                  ))
                )}
              </div>
            </div>
            
            <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed px-1 text-center lg:text-left">
              This card represents how your community presents itself on the global platform directories. Give it some distinct character!
            </p>
          </div>

        </div>
      </div>
    </main>
  );

}