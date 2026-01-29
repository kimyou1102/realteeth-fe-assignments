import { HomeHeader } from "../../widgets";
import { CurrentWeatherCard } from "../../widgets/current-weather-card/CurrentWeatherCard";
import { useWeatherSummaryQuery } from "../../entities/weather/api/useWeatherSummaryQuery";
import { useGeolocation } from "../../shared/lib/geolocation/useGeolocation";
import { LocationPermissionDenied } from "../../shared/ui/location-permission-denied/LocationPermissionDenied";
import { useQuery } from "@tanstack/react-query";
import { reverseGeocodeKoreanAdmin } from "../../shared/lib/kakao/reverseGeocodeKoreanAdmin";
import { HourlyForecast } from "../../widgets/hourly-forecast/HourlyForecast";

export function HomePage() {
  const { coords, isLoading, error } = useGeolocation();

  const { data } = useWeatherSummaryQuery({
    lat: coords?.lat,
    lon: coords?.lng,
  });
  const { data: adminRegion } = useQuery({
    queryKey: ["adminRegion", coords?.lat, coords?.lng],
    enabled: coords?.lat != undefined && coords?.lng != undefined,
    queryFn: () =>
      reverseGeocodeKoreanAdmin({
        lat: coords!.lat!,
        lng: coords!.lng!,
      }),
    staleTime: 1000 * 60 * 60,
  });

  if (!coords || isLoading) return <div>위치 확인 중...</div>;

  return (
    <main>
      <HomeHeader />
      {error ? (
        <LocationPermissionDenied />
      ) : (
        <>
          <CurrentWeatherCard
            locationName={adminRegion ?? ""}
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
          <HourlyForecast forecasts={data?.hourly3h ?? []} />
        </>
      )}
    </main>
  );
}
