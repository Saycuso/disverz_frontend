"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Hash, Loader2 } from "lucide-react";

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

  
  // Discord sends these back in the URL after bot authorization
  const guildId = searchParams.get("guild_id");

  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [currentGuild, setCurrentGuild] = useState<DiscordGuild | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!guildId) {
      router.push("/dashboard");
      return;
    }

    const fetchChannels = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const channelsRes = await fetch(`${baseUrl}/api/servers/${guildId}/channels`, {
          credentials: "include"
        });

        if (channelsRes.ok) {
          const data = await channelsRes.json();
          setChannels(data);
          if (data.length > 0) {
            setSelectedChannelId(data[0].id);
          }
        }

        // 2. 👑 NEW: Fetch User's Guilds to extract the Name and Icon
        const guildsRes = await fetch(`${baseUrl}/api/auth/guilds`, {
          credentials: "include"
        });

        if(guildsRes.ok){
          const guildsData = await guildsRes.json();
          const matchedGuild = guildsData.find((g:DiscordGuild) => g.id === guildId)
          if(matchedGuild){
            setCurrentGuild(matchedGuild)
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

    // 1. Retrieve the saved data from the previous screen
    const savedSetup = sessionStorage.getItem(`disverz_setup_${guildId}`);
    const setupData = savedSetup ? JSON.parse(savedSetup) : {};

    // 2. Construct the ultimate payload
    const finalPayload = {
      discordId: guildId,
      name: currentGuild?.name || "Unknown Server",
      iconUrl: currentGuild?.icon ? `https://cdn.discordapp.com/icons/${guildId}/${currentGuild.icon}.png` : null,
      description: setupData.description || "",
      tags: setupData.tags || "",
      language: setupData.language || "English",
      welcomeChannelId: selectedChannelId, // The missing piece of the puzzle
      inviteLink: "https://discord.gg/pending" // Placeholder to bypass strict database rules
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
        // Clean up the temporary storage
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
        The Disverz Bot has successfully entered your server. Select the channel where you want the bot to generate the permanent welcome invite and post updates.
      </p>

      <form onSubmit={handleFinalize} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Welcome & Announcement Channel
          </label>
          
          {isLoading ? (
            <div className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-gray-500 animate-pulse flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} /> Scanning channels...
            </div>
          ) : channels.length === 0 ? (
            <div className="w-full bg-[#1a1a1a] border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {"No text channels found. Please ensure the bot has 'View Channels' permission."}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash size={16} className="text-gray-500" />
              </div>
              <select
                value={selectedChannelId}
                onChange={(e) => setSelectedChannelId(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all appearance-none cursor-pointer"
              >
                {channels.map((channel) => (
                  <option key={channel.id} value={channel.id} className="bg-[#111]">
                    {channel.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

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
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-3xl mx-auto mt-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Final Step</h1>
        <p className="text-gray-400 mb-10">{"Configure your server's pulse channels."}</p>
        
        <Suspense fallback={<div className="text-center text-gray-500 mt-10">Loading authorization data...</div>}>
          <VerifySetupContent />
        </Suspense>
      </div>
    </main>
  );
}