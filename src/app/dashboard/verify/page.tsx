"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Hash, Loader2, Bell, BellOff } from "lucide-react";

interface DiscordChannel {
  id: string;
  name: string;
}

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
}

function VerifySetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const guildId = searchParams.get("guild_id");

  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [currentGuild, setCurrentGuild] = useState<DiscordGuild | null>(null);
  
  // Channel Selections
  const [selectedWelcomeChannelId, setSelectedWelcomeChannelId] = useState("");
  const [selectedChallengeChannelId, setSelectedChallengeChannelId] = useState(""); // 👑 Repurposed!
  
  // Setup State from previous page
  const [wantsReminders, setWantsReminders] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!guildId) {
      router.push("/dashboard");
      return;
    }

   

    const fetchChannels = async () => {
       // 1. Read the toggle choice they made on the setup screen
    const savedSetup = sessionStorage.getItem(`disverz_setup_${guildId}`);
    if (savedSetup) {
      const parsed = JSON.parse(savedSetup);
      setWantsReminders(parsed.bumpReminders ?? true);
    }
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // Fetch Channels
        const channelsRes = await fetch(`${baseUrl}/api/servers/${guildId}/channels`, {
          credentials: "include"
        });

        if (channelsRes.ok) {
          const data = await channelsRes.json();
          setChannels(data);
          if (data.length > 0) {
            setSelectedWelcomeChannelId(data[0].id);
            setSelectedChallengeChannelId(data[0].id); // Initialize the bot action channel
          }
        }

        // Fetch Guild Info
        const guildsRes = await fetch(`${baseUrl}/api/auth/guilds`, {
          credentials: "include"
        });

        if (guildsRes.ok) {
          const guildsData = await guildsRes.json();
          const matchedGuild = guildsData.find((g: DiscordGuild) => g.id === guildId);
          if (matchedGuild) {
            setCurrentGuild(matchedGuild);
          }
        } 
      } 
      catch (error) {
        console.error("Network error fetching verify data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [guildId, router]);

  const handleFinalize = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const savedSetup = sessionStorage.getItem(`disverz_setup_${guildId}`);
    const setupData = savedSetup ? JSON.parse(savedSetup) : {};

    // 👑 2. Construct final payload matching your Prisma Schema
    const finalPayload = {
      discordId: guildId,
      name: currentGuild?.name || "Unknown Server",
      iconUrl: currentGuild?.icon ? `https://cdn.discordapp.com/icons/${guildId}/${currentGuild.icon}.png` : null,
      description: setupData.description || "",
      tags: setupData.tags || [],
      category: setupData.category || "gaming",
      language: setupData.language || "English",
      welcomeChannelId: selectedWelcomeChannelId, 
      challengeChannelId: selectedChallengeChannelId, // The shared action channel!
      bumpReminders: wantsReminders, // Passes their setting to DB
      inviteLink: "https://discord.gg/pending"
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/api/servers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
        credentials: "include",
      });

      if (res.ok) {
        sessionStorage.removeItem(`disverz_setup_${guildId}`);
        alert("Server successfully listed! The Pulse is active.");
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        alert(`Failed to complete registration: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Finalization error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#111] border border-white/5 p-8 rounded-xl shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="text-green-500" size={28} />
        <h2 className="text-2xl font-bold">Bot Authorized</h2>
      </div>
      
      <p className="text-gray-400 mb-6">
       {" The Disverz Bot has successfully entered your server. Route the bot's modules to the correct channels below."}
      </p>

      <form onSubmit={handleFinalize} className="space-y-6">
        {isLoading ? (
          <div className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-gray-500 animate-pulse flex items-center gap-2">
            <Loader2 className="animate-spin" size={16} /> Scanning channels...
          </div>
        ) : channels.length === 0 ? (
          <div className="w-full bg-[#1a1a1a] border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
            {"No text channels found. Please ensure the bot has 'View Channels' permission."}
          </div>
        ) : (
          <div className="space-y-5">
            {/* 👑 Welcome Channel Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Public Activity & Welcome Channel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash size={16} className="text-gray-500" />
                </div>
                <select
                  value={selectedWelcomeChannelId}
                  onChange={(e) => setSelectedWelcomeChannelId(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-green-500 transition-all appearance-none cursor-pointer"
                >
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id} className="bg-[#111]">
                      {channel.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 👑 Bot Action / Challenge Channel Dropdown */}
            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-orange-400">
                  Bot Action Channel
                </label>
                
                {/* Visual indicator of what they chose on the previous screen */}
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${wantsReminders ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-800 text-gray-400'}`}>
                  {wantsReminders ? <Bell size={12} /> : <BellOff size={12} />}
                  {wantsReminders ? "Reminders ON" : "Reminders OFF"}
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mb-3">
                Select where the bot will post general important project updates {wantsReminders && "and bump reminders"}.
              </p>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash size={16} className="text-orange-500/50" />
                </div>
                <select
                  value={selectedChallengeChannelId}
                  onChange={(e) => setSelectedChallengeChannelId(e.target.value)}
                  className="w-full bg-black border border-orange-500/20 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer text-sm"
                >
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id} className="bg-[#111]">
                      {channel.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || channels.length === 0 || isSaving}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2"
        >
          {isSaving ? <><Loader2 className="animate-spin" size={18} /> Finalizing...</> : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 flex flex-col justify-center">
      <div className="max-w-3xl w-full mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Final Step</h1>
        <p className="text-gray-400 mb-8">{"Configure your server's pulse channels."}</p>
        
        <Suspense fallback={<div className="text-center text-gray-500 mt-10">Loading authorization data...</div>}>
          <VerifySetupContent />
        </Suspense>
      </div>
    </main>
  );
}