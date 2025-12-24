import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search notes, units, subjects…", 
  debounceMs = 150 
}: Props) => {
  const [inner, setInner] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setInner(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (inner !== value) onChange(inner);
    }, debounceMs);
    return () => clearTimeout(t);
  }, [inner, value, onChange, debounceMs]);

  const clearSearch = () => {
    setInner("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      {/* Prominent Search Container */}
      <div className="relative bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-cyan-50/60 p-6 md:p-8 rounded-2xl border-2 border-indigo-100 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Header Text */}
        <div className="mb-4 text-center">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 flex items-center justify-center gap-2">
            <Search className="h-5 w-5 text-indigo-600" />
            Find Your Study Material
          </h3>
          <p className="text-sm text-slate-600">
            Search by subject name, unit, code, or keyword
          </p>
        </div>

        {/* Search Input */}
        <div className="relative group">
          {/* Search Icon */}
          <div className="absolute left-0 top-0 h-full flex items-center pl-5 pointer-events-none">
            <Search className="h-6 w-6 text-indigo-500 group-focus-within:text-indigo-600 transition-colors" />
          </div>

          {/* Input Field */}
          <Input
            ref={inputRef}
            value={inner}
            onChange={(e) => setInner(e.target.value)}
            placeholder={placeholder}
            className="h-14 md:h-16 pl-14 pr-14 text-base md:text-lg bg-white border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 text-slate-900 placeholder:text-slate-500 font-medium transition-all shadow-sm hover:shadow-md focus:shadow-lg"
            onFocus={() => {
              // Ensure input is visible when keyboard opens
              inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />

          {/* Clear Button */}
          {inner && (
            <div className="absolute right-0 top-0 h-full flex items-center pr-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-10 w-10 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Search Tips */}
        <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 bg-white/60 rounded-lg p-3 border border-indigo-100/50">
          <div className="flex-shrink-0 mt-0.5">
            💡
          </div>
          <p>
            <span className="font-semibold">Pro tip:</span> Try full subject names (e.g., "Compiler Design"), 
            short codes (e.g., "CD"), or subject codes (e.g., "KCS-601")
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
