import { Droplets, Wind, Star } from "lucide-react";
import { cn } from "../../shared/lib/cn";
import { WeatherIcon } from "../../shared/ui/weather-icon/WeatherIcon";
import type { WeatherIconKey } from "../../entities/weather/model/type";

interface CurrentWeatherCardProps {
  locationName: string;
  temperature: number;
  conditionLabel: WeatherIconKey | null;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number;

  isFavorite: boolean;
  onFavoriteToggle?: () => void;
}

function CurrentWeatherCard({
  locationName,
  temperature,
  conditionLabel,
  tempMax,
  tempMin,
  humidity,
  windSpeed,
  isFavorite,
  onFavoriteToggle,
}: CurrentWeatherCardProps) {
  return (
    <section
      className={
        "w-full rounded-2xl border border-[#e2e2e2] bg-white px-6 py-8 text-center shadow-sm"
      }
      aria-label="현재 날씨"
    >
      <h2 className="text-2xl font-semibold text-gray-900">{locationName}</h2>

      <div className="mt-6 flex items-center justify-center gap-6">
        <WeatherIcon name={conditionLabel} size={56} />
        <div className="flex items-start">
          <span className="text-6xl font-light leading-none text-gray-900">
            {temperature}
          </span>
          <span className="ml-1 text-2xl font-medium text-gray-900">°</span>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        {conditionLabel ?? "정보 없음"}{" "}
      </p>

      <div className="mt-5 flex items-center justify-center gap-4 text-sm text-gray-600">
        <span>최고 {tempMax}°</span>
        <span className="h-4 w-px bg-gray-200" aria-hidden="true" />
        <span>최저 {tempMin}°</span>
      </div>

      <div className="mt-8 flex items-center justify-center gap-10 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span>습도 {humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span>풍속 {windSpeed}m/s</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onFavoriteToggle}
        className="mt-8 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
        aria-label={isFavorite ? "즐겨찾기 삭제" : "즐겨찾기 추가"}
      >
        <Star
          className={cn(
            "h-4 w-4",
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400",
          )}
          aria-hidden="true"
        />
        <span>{isFavorite ? "즐겨찾기 삭제" : "즐겨찾기 추가"}</span>
      </button>
    </section>
  );
}

export { CurrentWeatherCard };
