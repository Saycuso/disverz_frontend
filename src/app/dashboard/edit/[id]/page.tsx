"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { TagInput } from "@/components/TagInput";

interface Channel {
  id: string;
  name: string;
  type: number;
}

const EditServerPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const serverId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "", // Read-only for display
    description: "",
    tags: [] as string[], // Handled as comma-separated string in UI
    language: "English",
    welcomeChannelId: "",
    challengeChannelId: "",
  });

  useEffect(() => {
    const fetchServerAndChannels = async () => {
      try {
        // 1. Fetch current server details
        const serverRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/servers/${serverId}`,
        );
        if (!serverRes.ok) throw new Error("Failed to fetch server details");
        const serverData = await serverRes.json();

        // 2. Fetch the live channels from Discord via our Bot
        const channelsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/servers/${serverData.discordId}/channels`,
          {
            credentials: "include",
          },
        );

        if (channelsRes.ok) {
          const channelsData = await channelsRes.json();
          setChannels(channelsData);
        } else {
          console.warn("Could not fetch channels. Bot might lack permissions.");
        }

        // 3. Populate the form
        setFormData({
          name: serverData.name,
          description: serverData.description || "",
          tags: serverData.tags || [],
          language: serverData.language || "English",
          welcomeChannelId: serverData.welcomeChannelId || "",
          challengeChannelId: serverData.challengeChannelId || "",
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (serverId) {
      fetchServerAndChannels();
    }
  }, [serverId]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/servers/${serverId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            description: formData.description,
            tags: formData.tags,
            language: formData.language,
            welcomeChannelId: formData.welcomeChannelId,
            challengeChannelId: formData.challengeChannelId,
          }),
        },
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update server");
      }

      // Tactical retreat back to the armory upon success
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while saving.");
      }
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-400">
          Forging interface...
        </div>
      </div>
    );
  }

  return (
    // STRIKE 1: Reduced overall container padding from p-8 to p-4, centered vertically
    <div className="min-h-[calc(100vh-100px)] bg-[#0a0a0a] text-white p-4 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        {/* STRIKE 2: Tightened header margins and text sizes */}
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-3">
          ← Back to Command Center
        </Link>

        <h1 className="text-2xl font-bold mb-1">Edit {formData.name}</h1>
        <p className="text-sm text-gray-400 mb-5">{"Configure your server's public profile and bot mechanics."}</p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* STRIKE 3: Reduced form internal spacing (space-y-6 -> space-y-4) and padding (p-6 -> p-5) */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-[#111] border border-white/5 p-5 rounded-xl">
          
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              required
              rows={2} // Reduced from 3 to 2
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5500] transition-colors resize-none"
              placeholder="What makes your community unique?"
            />
          </div>

          {/* Tags & Language Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">Tags</label>
              <TagInput
                tags={formData.tags}
                setTags={(newTags) => setFormData({ ...formData, tags: newTags })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">Primary Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5500] transition-colors h-10.5"
              >
                <option value="English">English</option>
                <option value="German">German (Deutsch)</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>

          <hr className="border-white/5 my-3" />

          {/* Bot Configuration - Now Side-by-Side */}
          <div>
            <h3 className="text-sm font-bold text-gray-200 mb-3">Bot Configuration</h3>
            
            {/* STRIKE 4: Placed Bot dropdowns in a grid to save vertical space */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Welcome Channel (Invite Target)</label>
                <select
                  required
                  value={formData.welcomeChannelId}
                  onChange={(e) => setFormData({ ...formData, welcomeChannelId: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5500] transition-colors"
                >
                  <option value="" disabled>Select a channel...</option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      # {channel.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1 leading-tight">Generates a permanent invite link here.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Challenge Channel</label>
                <select
                  required
                  value={formData.challengeChannelId}
                  onChange={(e) => setFormData({ ...formData, challengeChannelId: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5500] transition-colors"
                >
                  <option value="" disabled>Select a channel...</option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      # {channel.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1 leading-tight">Bot drops /challenge questions here.</p>
              </div>
            </div>
          </div>

          {/* STRIKE 5: Compressed button padding */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#ff5500] hover:bg-[#ff7733] text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm"
          >
            {isSaving ? "Saving Configuration..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditServerPage;
