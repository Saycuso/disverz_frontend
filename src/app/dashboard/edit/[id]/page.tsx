"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TagInput } from "@/components/TagInput";
import { Trash2 } from "lucide-react"; 

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
  const [isDeleting, setIsDeleting] = useState(false);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "", // Read-only for display
    description: "",
    tags: [] as string[], // Handled as comma-separated string in UI
    category: "gaming",
    language: "English",
    welcomeChannelId: "",
    challengeChannelId: "",
  });
  const [isDescTouched, setIsDescTouched] = useState(false);

  useEffect(() => {
    const fetchServerAndChannels = async () => {
      try {
        // 1. Fetch current server details
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const serverRes = await fetch(
          `${baseUrl}/api/servers/${serverId}`,
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
          category: serverData.category || "gaming", 
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
            category: formData.category, 
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

  // 👑 The Destructive Strike
  const handleDelete = async () => {
    // The Safeguard
    if (
      !window.confirm(
        "Are you absolutely sure you want to delete this server? This will wipe all pulse data and rankings. This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(
        `${baseUrl}/api/servers/${serverId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete server");
      }

      // Tactical retreat back to the dashboard after successful wipe
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while deleting.");
      }
      setIsDeleting(false);
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
    <div className="text-white px-0 md:px-0 py-6 md:py-8 flex flex-col justify-center items-center">
      <div className="max-w-7xl w-full">
        {/* Header Block with Mobile Scaling */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-xs text-gray-400 hover:text-white transition-colors mb-3 md:mb-4 group w-fit cursor-pointer p-1 -ml-1"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />Command Center
          </Link>
          <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight mt-2 md:mt-3">
            Edit {formData.name}
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            {"Configure your server's public profile and bot mechanics."}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500/30 text-red-200 px-4 py-2.5 rounded-lg mb-4 text-xs md:text-sm">
            {error}
          </div>
        )}

        {/* 🚀 THE TACTICAL TWO-COLUMN DASHBOARD */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 w-full"
        >
          {/* 👑 LEFT PANEL: Server Info */}
          <div className="md:col-span-7 bg-[#111] border border-white/5 p-3 md:p-6 rounded-xl space-y-5 shadow-xl">
            {/* Description Block */}
            <div>
              <label className="block text-[10px] md:text-xs font-bold text-gray-400 mb-1.5 md:mb-2 uppercase tracking-wider">
                Description <span className="text-orange-500">*</span>
              </label>
              <textarea
                required
                maxLength={2000}
                rows={8}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                onBlur={() => setIsDescTouched(true)} 
                className={`w-full bg-[#1a1a1a] border rounded-lg px-3 md:px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none transition-colors resize-none h-48 md:h-52 ${
                  isDescTouched && formData.description.trim().length < 200
                    ? "border-red-500/80 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                    : "border-white/10 focus:border-[#ff5500]"
                }`}
                placeholder="What makes your community unique? (Min. 200 characters)"
              />

              {/* 👑 Dynamic Footer: Flex-col on mobile so the warning doesn't break the layout */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1.5 px-1 gap-1 sm:gap-0">
                <span className="text-[10px] md:text-[11px] font-bold">
                  {isDescTouched && formData.description.trim().length < 200 ? (
                    <span className="text-red-500 animate-pulse">
                      ⚠️ Min 200 chars ({formData.description.trim().length}/200)
                    </span>
                  ) : formData.description.trim().length >= 200 ? (
                    <span className="text-emerald-500">✅ Length accepted</span>
                  ) : (
                    <span className="text-gray-500"></span>
                  )}
                </span>
                <span className="text-[10px] text-gray-500 font-medium sm:text-right">
                  {formData.description.length} / 2000
                </span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[10px] md:text-xs font-bold text-gray-400 mb-1.5 md:mb-2 uppercase tracking-wider">
                Tags
              </label>
              <TagInput
                tags={formData.tags}
                setTags={(newTags) =>
                  setFormData({ ...formData, tags: newTags })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {/* Category */}
              <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 mb-1.5 md:mb-2 uppercase tracking-wider">
                  Trivia Category <span className="text-orange-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
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

              {/* Language */}
              <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 mb-1.5 md:mb-2 uppercase tracking-wider">
                  Primary Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-[#ff5500] transition-colors h-10 md:h-11 cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
          </div>

          {/* 👑 RIGHT PANEL: Bot Routing */}
          <div className="md:col-span-5 bg-[#111] border border-white/5 p-3 md:p-6 rounded-xl flex flex-col shadow-xl h-fit">
            <div className="space-y-4 md:space-y-5 pb-0 md:pb-6">
              <h3 className="text-sm md:text-base font-bold text-gray-200 border-b border-white/5 pb-2.5">
                Bot Configuration
              </h3>

              {/* Welcome Target Box */}
              <div>
                <label className="block text-[10px] md:text-xs font-semibold text-gray-300 mb-1 md:mb-1.5">
                  Welcome Channel (Invite Target)
                </label>
                <select
                  required
                  value={formData.welcomeChannelId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      welcomeChannelId: e.target.value,
                    })
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-[#ff5500] transition-colors h-10 md:h-11 cursor-pointer"
                >
                  <option value="" disabled>
                    Select a channel...
                  </option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      # {channel.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1.5 md:mt-1 leading-tight">
                  Generates a permanent invite link here.
                </p>
              </div>

              {/* Challenge Target Box */}
              <div>
                <label className="block text-[10px] md:text-xs font-semibold text-gray-300 mb-1 md:mb-1.5">
                  Challenge Channel
                </label>
                <select
                  required
                  value={formData.challengeChannelId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      challengeChannelId: e.target.value,
                    })
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 md:px-4 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-[#ff5500] transition-colors h-10 md:h-11 cursor-pointer"
                >
                  <option value="" disabled>
                    Select a channel...
                  </option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      # {channel.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1.5 md:mt-1 leading-tight">
                  Bot drops /challenge questions here.
                </p>
              </div>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              disabled={isSaving || formData.description.trim().length < 200}
              className="w-full bg-[#ff5500] hover:bg-[#ff7733] text-white font-bold py-2.5 md:py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 md:mt-auto text-xs md:text-sm uppercase tracking-wider cursor-pointer"
            >
              {isSaving ? "Saving Configuration..." : "Save Changes"}
            </button>

            {/* 👑 DANGER ZONE: The Kill Switch */}
            <div className="mt-5 pt-4 md:pt-5 border-t border-red-500/20">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
                className="w-full flex items-center justify-center gap-2 text-[11px] md:text-xs font-bold text-red-500/80 hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={14} className="w-2 h-2 md:w-4 md:h-4" />
                {isDeleting ? "Wiping Data..." : "Remove Server"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServerPage;