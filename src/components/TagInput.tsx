"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";

// The master list of standardized Disverz tags
const PREDEFINED_TAGS = [
  "gaming", "chill", "anime", "coding", "music", 
  "community", "social", "friendly", "roleplay", "art", "tech"
];

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  maxTags?: number;
}

export const TagInput = ({ tags, setTags, maxTags = 5 }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter recommendations based on what the user types
  const suggestions = inputValue.trim() === "" 
    ? [] 
    : PREDEFINED_TAGS.filter(
        (tag) => 
          tag.toLowerCase().includes(inputValue.toLowerCase()) && 
          !tags.includes(tag)
      );

  const addTag = (tagToAdd: string) => {
    const formattedTag = tagToAdd.trim().toLowerCase();
    if (formattedTag && !tags.includes(formattedTag) && tags.length < maxTags) {
      setTags([...tags, formattedTag]);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      // Remove the last tag if backspace is pressed on an empty input
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="relative w-full">
      {/* 👑 The Input Box containing the Tag Chips */}
      <div 
        className={`w-full bg-[#1a1a1a] border rounded-lg px-2 md:px-3 py-1.5 md:py-2 flex flex-wrap gap-1.5 md:gap-2 transition-all cursor-text min-h-11 items-center ${
          isFocused ? "border-[#ff5500] shadow-[0_0_8px_rgba(255,85,0,0.2)]" : "border-white/10"
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span 
            key={tag} 
            // 👑 Scaled down for mobile, uppercase to match the public feed cards
            className="flex items-center gap-1 bg-[#2b2d31] text-gray-200 px-2 py-0.5 md:px-2.5 md:py-1 rounded md:rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider select-none"
          >
            {tag}
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {/* 👑 Responsive Lucide icon size using Tailwind */}
              <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
            </button>
          </span>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)} // Delay to allow click on suggestions
          placeholder={tags.length < maxTags ? "Add a Tag (Press Enter)" : `Max ${maxTags} tags reached`}
          disabled={tags.length >= maxTags}
          // 👑 Shrunk the placeholder text for mobile to match the other inputs
          className="flex-1 bg-transparent text-white outline-none min-w-30 py-0.5 text-xs md:text-sm"
        />
      </div>

      <p className="text-[10px] md:text-[11px] text-gray-500 mt-1.5 leading-tight">
        Categorize your server by keywords (Up to {maxTags} tags)
      </p>

      {/* 👑 The Auto-Recommend Dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(suggestion);
              }}
              // 👑 Mobile scaled dropdown items
              className="px-3 md:px-4 py-2 md:py-2.5 hover:bg-[#2b2d31] cursor-pointer text-gray-300 hover:text-white transition-colors text-xs md:text-sm font-bold uppercase tracking-wider"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}