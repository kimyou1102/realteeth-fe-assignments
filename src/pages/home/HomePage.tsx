import { HomeHeader } from "../../widgets";
import { CurrentWeatherCard } from "../../widgets/current-weather-card/CurrentWeatherCard";
import { useWeatherSummaryQuery } from "../../entities/weather/api/useWeatherSummaryQuery";

export function HomePage() {
  const lat = 37.49265;
  const lon = 126.8895972;

  const { data } = useWeatherSummaryQuery({ lat, lon });

  return (
    <main>
      <HomeHeader />
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
    </main>
  );
}
