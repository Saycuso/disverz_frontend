"use client";

import { useState, useRef} from "react";
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
      {/* The Input Box containing the Tag Chips */}
      <div 
        className={`w-full bg-black border rounded-lg px-3 py-2 flex flex-wrap gap-2 transition-all ${
          isFocused ? "border-orange-500 ring-1 ring-orange-500" : "border-white/10"
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="flex items-center gap-1 bg-[#2b2d31] text-gray-200 px-3 py-1 rounded-md text-sm font-medium"
          >
            {tag}
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={14} />
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
          className="flex-1 bg-transparent text-white outline-none min-w-[120px] py-1"
        />
      </div>

      <p className="text-xs text-gray-500 mt-2">
        - Categorize your server by keywords<br/>
        - Up to {maxTags} tags
      </p>

      {/* The Auto-Recommend Dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-[#111] border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(suggestion);
              }}
              className="px-4 py-2 hover:bg-[#2b2d31] cursor-pointer text-gray-300 hover:text-white transition-colors"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}