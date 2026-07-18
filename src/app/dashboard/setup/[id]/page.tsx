"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Settings, Bot, ChevronLeft } from "lucide-react";
import {TagInput} from "@/components/TagInput";

export default function SetupServer() {
  const params = useParams();
  const router = useRouter();
  const serverId = params.id as string;

  // The Ammunition
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [tags, setTags] = useState<string[]>([]);

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
    
    // 🚨 THE VISUAL DEBUGGER ALERT 🚨
  alert(
    `--- OAUTH DEBUGGER ---\n` +
    `Client ID: ${clientId}\n` +
    `Raw Redirect URL: ${rawUrl}\n` +
    `Encoded Redirect: ${redirectUri}\n` +
    `-----------------------\n` +
    `Make sure the 'Raw Redirect URL' matches your Discord Portal EXACTLY!`
  );
  
    // 👑 This URL forces the user to invite the bot to the specific server they chose
    const discordBotAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands&guild_id=${serverId}&disable_guild_select=true&redirect_uri=${redirectUri}&response_type=code`;

    // Execute the redirect
    window.location.href = discordBotAuthUrl;
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-3xl mx-auto mt-12">
        
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          Back to Server Selection
        </button>

        <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
          <Settings className="text-orange-500" size={36} />
          Server Configuration
        </h1>
        <p className="text-gray-400 mb-10">
          Define your community. When you proceed, you will invite the Disverz bot to establish the Pulse Feed.
        </p>

        <div className="bg-[#111] border border-white/5 p-8 rounded-xl shadow-2xl">
          <form onSubmit={handleSaveAndInvite} className="space-y-6">
            
            {/* Description Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                maxLength={300}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What makes your community unique?"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all resize-none h-32"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Tags
              </label>
              <TagInput tags={tags} setTags={setTags} maxTags={5} />
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Main Language <span className="text-red-500">*</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
              >
                <option value="English">English</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Bot size={20} />
              Save & Invite Disverz Bot
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}