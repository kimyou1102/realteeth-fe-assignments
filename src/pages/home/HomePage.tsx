import { HomeHeader } from "../../widgets";
import { CurrentWeatherCard } from "../../widgets/current-weather-card/CurrentWeatherCard";
import { useWeatherSummaryQuery } from "../../entities/weather/api/useWeatherSummaryQuery";
import { useGeolocation } from "../../shared/lib/geolocation/useGeolocation";
import { LocationPermissionDenied } from "../../shared/ui/location-permission-denied/LocationPermissionDenied";

export function HomePage() {
  const { coords, isLoading, error } = useGeolocation();

  const { data } = useWeatherSummaryQuery({
    lat: coords?.lat ?? 0,
    lon: coords?.lng ?? 0,
  });

  if (!coords || isLoading) return <div>위치 확인 중...</div>;

  return (
    <main>
      <HomeHeader />
      {error ? (
        <LocationPermissionDenied />
      ) : (
        <CurrentWeatherCard
          locationName="Busan"
          temperature={data?.current.tempC ?? 0}
          conditionLabel={data?.current.conditionText ?? null}
          tempMax={data?.today.maxTempC ?? 0}
          tempMin={data?.today.minTempC ?? 0}
          humidity={data?.current.humidityPct ?? 0}
          windSpeed={data?.current.windSpeedMs ?? 0}
          // TODO: 즐겨찾기 기능 추가 예정
          isFavorite
          onFavoriteToggle={() => {}}
        />
      )}
    </main>
  );
}
