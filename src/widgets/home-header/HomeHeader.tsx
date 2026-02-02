import { Star } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function HomeHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFavoriteClick = () => {
    const nextPath = location.pathname === "/favorites" ? "/" : "/favorites";
    navigate(nextPath);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header
      className={
        "flex items-center justify-between px-4 h-14 border-b bg-white border-[#e2e2e2]"
      }
    >
      <h1
        className="text-lg font-semibold cursor-pointer"
        onClick={handleLogoClick}
      >
        날씨
      </h1>

      <button
        type="button"
        onClick={handleFavoriteClick}
        aria-label="즐겨찾기"
        className="flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
      >
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      </button>
    </header>
  );
}
