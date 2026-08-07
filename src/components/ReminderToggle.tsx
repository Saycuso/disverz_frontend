"use client";

import { useState } from "react";
import { Bell, BellOff } from "lucide-react";

interface ReminderToggleProps {
  serverId: string;
  initialState: boolean;
}

export default function ReminderToggle({ serverId, initialState }: ReminderToggleProps) {
  const [enabled, setEnabled] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const toggleReminder = async () => {
    setLoading(true);
    const newState = !enabled;
    
    // Optimistic UI update (feels instantly fast for the user)
    setEnabled(newState);

    try {
      // 👑 Hits the Express backend route you just made in servers.ts!
      // Make sure the port (5000) matches whatever your backend actually runs on.
      const response = await fetch(`http://localhost:5000/servers/${serverId}/reminder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bumpReminders: newState }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }
    } catch {
      // Revert the switch if the backend fails
      setEnabled(!newState);
      console.error("Failed to toggle reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[#111] border border-white/10 rounded-xl w-full max-w-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg transition-colors ${enabled ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-gray-500'}`}>
          {enabled ? <Bell size={18} /> : <BellOff size={18} />}
        </div>
        <div>
          <h4 className="text-white text-sm font-bold">Bump Reminders</h4>
          <p className="text-gray-400 text-xs mt-0.5">
            {enabled ? "We will ping you when it's time." : "Reminders are paused."}
          </p>
        </div>
      </div>

      {/* The actual clickable switch */}
      <button
        onClick={toggleReminder}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          enabled ? 'bg-orange-500' : 'bg-gray-600'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}