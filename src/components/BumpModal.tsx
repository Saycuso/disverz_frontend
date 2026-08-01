"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Flame, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // 👑 ADD THIS

interface BumpModalProps {
  serverId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BumpModal({ serverId, isOpen, onClose, onSuccess }: BumpModalProps) {
  const router = useRouter(); // 👑 ADD THIS
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [challenge, setChallenge] = useState<{
    challengeId: string;
    text: string;
    options: { id: string; text: string }[];
  } | null>(null);

   // 👑 FIX 1: fetchChallenge now ONLY fetches data. No synchronous state drops at start.
  const fetchChallenge = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/api/servers/${serverId}/web-challenge`, {
        credentials: "include"
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch challenge");
      }
      
      setChallenge(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [serverId]);

  // 👑 FIX 2: Handle setup phase inside the effect safely
  useEffect(() => {
    if (!isOpen) return;

    // Defer the state updates so they run right after the render phase finishes
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      setChallenge(null);
      fetchChallenge();
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, fetchChallenge]);

  const handleAnswer = async (answerId: string) => {
    if (!challenge) return;
    
    setVerifying(true);
    setError(null);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/api/servers/${serverId}/web-challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          challengeId: challenge.challengeId,
          answer: answerId
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Incorrect answer.");
      }
      
      // Victory!
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
      <div className="bg-[#111] border border-orange-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Flame className="text-orange-500" size={24} />
          <h2 className="text-xl font-bold text-white tracking-tight">Manual Web Bump</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="text-orange-500 animate-spin mb-3" size={32} />
            <p className="text-sm text-gray-400">Summoning challenge...</p>
          </div>
        ) : error ? (
          <div className="py-6">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-400 font-medium text-center">{error}</p>
            </div>
            
            {/* 👑 THE SMART ERROR ROUTER */}
            {error.includes("cooldown") ? (
               <button onClick={onClose} className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-bold transition-colors">
                 Understood
               </button>
            ) : error.includes("No questions found") ? (
               <button 
                 onClick={() => {
                   onClose();
                   router.push(`/dashboard/edit/${serverId}`);
                 }} 
                 className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors"
               >
                 Configure Category ⚙️
               </button>
            ) : (
               <button onClick={fetchChallenge} className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors">
                 Try Another Question
               </button>
            )}
          </div>
        ) : challenge ? (
          <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
            <p className="text-sm text-gray-200 mb-6 font-medium leading-relaxed">
              {challenge.text}
            </p>
            
            <div className="space-y-2.5">
              {challenge.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.id)}
                  disabled={verifying}
                  className="w-full flex items-center p-3 rounded-lg border border-white/10 bg-[#1a1a1a] hover:bg-orange-500/10 hover:border-orange-500/50 transition-all group disabled:opacity-50"
                >
                  <span className="w-8 h-8 rounded-md bg-neutral-800 flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-colors mr-3 shrink-0">
                    {opt.id}
                  </span>
                  <span className="text-sm text-gray-300 group-hover:text-white text-left">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>
            
            {verifying && (
              <p className="text-xs text-orange-400 text-center mt-4 animate-pulse">
                Verifying your response...
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}