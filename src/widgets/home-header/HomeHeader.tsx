import { Star } from "lucide-react";
import { cn } from "../../shared/lib/cn";
import { useState } from "react";

export function HomeHeader() {
  const [isFavorite, setIsFavorite] = useState(false);
  const handleFavoriteClick = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <header
      className={
        "flex items-center justify-between px-4 h-14 border-b bg-white border-[#e2e2e2]"
      }
    >
      <h1 className="text-lg font-semibold">날씨</h1>

      <button
        type="button"
        onClick={handleFavoriteClick}
        aria-label="즐겨찾기"
        className="flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
      >
        <Star
          className={cn(
            "h-5 w-5",
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-500",
          )}
        />
      </button>
    </header>
  );
}
