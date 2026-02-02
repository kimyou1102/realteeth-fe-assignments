import { FavoriteWeatherList } from "../../shared/ui/favorite-weather-list/FavoriteWeatherList";

export function FavoritesPage() {
  const DUMMY = [
    {
      name: "경화동",
      current: 20,
      min: 15,
      max: 25,
      conditionText: "맑음",
    },
  ];

  return (
    <main>
      <h1>즐겨찾기</h1>
      <FavoriteWeatherList
        items={DUMMY}
        onChangeName={(id, nextName) => console.log(id, nextName)}
        onDelete={(id) => console.log(id)}
      />
    </main>
  );
}
