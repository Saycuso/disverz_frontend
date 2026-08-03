"use client";

import { useState } from "react";
import { X, Flame} from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

interface BumpModalProps {
  serverId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BumpModal({ serverId, isOpen, onClose, onSuccess }: BumpModalProps) {
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (token: string) => {
    setVerifying(true);
    setError(null);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/api/servers/${serverId}/web-bump`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Verification failed.");
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
          <h2 className="text-xl font-bold text-white tracking-tight">Human Check</h2>
        </div>

        {error ? (
          <div className="py-6">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-400 font-medium text-center">{error}</p>
            </div>
            <button onClick={onClose} className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-bold transition-colors">
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <p className="text-sm text-gray-400 mb-6 text-center">
              Please complete the security check to bump your server.
            </p>
            
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
              onSuccess={(token) => handleVerify(token)}
              onError={() => setError("Turnstile encountered an error. Please try again.")}
              onExpire={() => setError("Challenge expired. Please close and try again.")}
            />

            {verifying && (
              <p className="text-xs text-orange-400 text-center mt-6 animate-pulse">
                Verifying and executing bump...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}