"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Settings, Bot, ChevronLeft } from "lucide-react";
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
  const [tags, setTags] = useState<string[]>([]);
  const [isDescTouched, setIsDescTouched] = useState(false); // 👑 ADD THIS

// The Identity State
  const [serverName, setServerName] = useState("Loading...");
  const [serverIconUrl, setServerIconUrl] = useState<string | null>(null);

  // 👑 The Fetch Engine: Retrieve the specific server's identity
  useEffect(() => {
    const fetchGuildIdentity = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/guilds`, {
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
  // 👑 FIXED: Changed justify-center to justify-start to snap elements right up below your text headers
  <main className="min-h-screen bg-[#0a0a0a] text-white py-4 px-0 flex flex-col justify-start">
    <div className="max-w-7xl w-full mx-auto">
      
      {/* Back Button Layout */}
      <button 
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors mb-2 group w-fit"
      >
        <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Server Selection
      </button>

      {/* Header Layout Section (👑 FIXED: Reduced mb-4 to mb-3 for crisp tracking) */}
      <div className="mb-3">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-0.5 flex items-center gap-2.5">
          <Settings className="text-orange-500 animate-[spin_6s_linear_infinite]" size={26} />
          Server Configuration
        </h1>
        <p className="text-xs text-gray-400 max-w-2xl">
          Define your community parameters to invite the Disverz bot.
        </p>
      </div>

      {/* 🚀 THE TACTICAL WORKFLOW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        
        {/* LEFT COLUMN: Configuration Inputs */}
        <div className="lg:col-span-7 bg-[#111] border border-white/5 p-5 rounded-xl shadow-2xl">
          <form onSubmit={handleSaveAndInvite} className="space-y-4">
            
            {/* Description Input */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                Description <span className="text-orange-500">*</span>
              </label>
              <textarea
                required
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setIsDescTouched(true)} // 👑 The trigger
                placeholder="What makes your community unique? (Min. 200 characters)"
                className={`w-full bg-black border rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-all resize-none h-20 focus:ring-1 ${
                  isDescTouched && description.trim().length < 200
                    ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]' 
                    : 'border-white/10 focus:border-orange-500 focus:ring-orange-500/20'
                }`}
              />
              
              {/* Dynamic Footer: Error Message & Counter */}
              <div className="flex justify-between items-center mt-1 px-1">
                <span className="text-[10px] font-bold">
                  {isDescTouched && description.trim().length < 200 ? (
                    <span className="text-red-500 animate-pulse">
                      ⚠️ Minimum 200 chars ({description.trim().length}/200)
                    </span>
                  ) : description.trim().length >= 200 ? (
                    <span className="text-emerald-500">✅ Length accepted</span>
                  ) : (
                    <span></span>
                  )}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  {description.length} / 2000 characters
                </span>
              </div>
            </div>

            {/* Tags & Language Placement Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Tags (Max 5)
                </label>
                <TagInput tags={tags} setTags={setTags} maxTags={5} />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Main Language <span className="text-orange-500">*</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-9.5 bg-black border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer focus:ring-1 focus:ring-orange-500/20"
                >
                  <option value="English">English</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            <div className="border-b border-white/5 pt-1" />

            {/* Discord Gateway Submission Action */}
            <button
              type="submit"
              disabled={description.trim().length < 200}
              className="w-full font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider
                bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-indigo-500/20 
               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/5"
            >
              <Bot size={16} />
              Save & Invite Disverz Bot
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Real-Time Live Feed Card Preview */}
        {/* 👑 FIXED: Updated sticky positioning offset to line up perfectly on desktop viewports */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-3">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">
            Live Feed Card Preview
          </label>
          
          {/* Card Frame */}
          <div className="bg-[#111] border border-white/10 p-4 rounded-xl shadow-2xl relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-orange-500 to-indigo-500" />
            
           {/* 👑 Card Profile Row Header - Now 100% Dynamic */}
            <div className="flex items-center gap-2.5 mb-3">
              {serverIconUrl ? (
                <Image
                  src={serverIconUrl}
                  alt={serverName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-cover border border-white/5 shadow-inner select-none"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-white/5 flex items-center justify-center font-black text-gray-400 text-lg shadow-inner select-none uppercase">
                  {serverName.charAt(0)}
                </div>
              )}
              <div className="min-w-0"> {/* min-w-0 ensures the truncate works properly */}
                <h3 className="font-bold text-sm text-white tracking-wide truncate">{serverName}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-gray-500 font-medium">{language || "English"}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Card Description Area Box */}
            <p className="text-xs text-gray-400 leading-relaxed min-h-12 bg-black/30 border border-white/5 p-2.5 rounded-lg wrap-break-word mb-3 italic">
              {description || "Your custom description string will render out live across this public block zone..."}
            </p>

            {/* Tag Array Target Output */}
            <div className="flex flex-wrap gap-1">
              {tags.length === 0 ? (
                <span className="text-[10px] text-gray-600 select-none">No tags applied yet</span>
              ) : (
                tags.map((tag, idx) => (
                  <span key={idx} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    #{tag}
                  </span>
                ))
              )}
            </div>
          </div>
          
          <p className="text-[10px] text-gray-500 leading-normal px-1 text-center lg:text-left">
            This card represents how your community presents itself on the global platform directories. Give it some distinct character!
          </p>
        </div>

      </div>
    </div>
  </main>
);

}