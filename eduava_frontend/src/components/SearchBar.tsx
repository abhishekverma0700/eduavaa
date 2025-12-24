import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

const SearchBar = ({ value, onChange, placeholder = "Search by name or code…", debounceMs = 150 }: Props) => {
  const [inner, setInner] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setInner(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (inner !== value) onChange(inner);
    }, debounceMs);
    return () => clearTimeout(t);
  }, [inner, value, onChange, debounceMs]);

  return (
    <div className="w-full relative">
      <div className="absolute left-0 top-0 h-full flex items-center pl-4 pointer-events-none text-slate-400">
        <Search className="h-5 w-5" />
      </div>
      <Input
        ref={inputRef}
        value={inner}
        onChange={(e) => setInner(e.target.value)}
        placeholder={placeholder}
        className="h-11 pl-12 bg-card border border-slate-100 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 text-slate-900 placeholder:text-slate-500 transition-all shadow-sm focus:shadow-md"
        onFocus={() => {
          // Ensure input is visible when keyboard opens
          inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
      />
    </div>
  );
};

export default SearchBar;
