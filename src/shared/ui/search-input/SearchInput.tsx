import { Search } from "lucide-react";
import { cn } from "../../lib/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-[#e2e2e2] bg-white px-4 py-3 shadow-sm",
        "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20",
      )}
    >
      <Search className="h-5 w-5 text-gray-400" aria-hidden />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
      />
    </div>
  );
}
