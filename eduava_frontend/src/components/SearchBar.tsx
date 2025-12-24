import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

const SearchBar = ({ value, onChange, placeholder = "Search by name, short name, or code…", debounceMs = 150 }: Props) => {
  const [inner, setInner] = useState(value);

  useEffect(() => setInner(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (inner !== value) onChange(inner);
    }, debounceMs);
    return () => clearTimeout(t);
  }, [inner, value, onChange, debounceMs]);

  return (
    <div className="w-full">
      <Input
        value={inner}
        onChange={(e) => setInner(e.target.value)}
        placeholder={placeholder}
        className="h-11"
      />
    </div>
  );
};

export default SearchBar;
