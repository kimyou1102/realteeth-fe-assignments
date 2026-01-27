import { HomeHeader } from "../../widgets";
import { CurrentWeatherCard } from "../../widgets/current-weather-card/CurrentWeatherCard";

export function HomePage() {
  return (
    <main>
      <HomeHeader />
      <CurrentWeatherCard
        locationName="Busan"
        temperature={0}
        conditionLabel="맑음"
        tempMax={0}
        tempMin={0}
        humidity={25}
        windSpeed={2.57}
        isFavorite
        onFavoriteToggle={() => {}}
      />
    </main>
  );
}
