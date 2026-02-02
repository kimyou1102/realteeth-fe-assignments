import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { FavoriteWeatherList } from "../../shared/ui/favorite-weather-list/FavoriteWeatherList";
import { useFavoriteContext } from "../../entities/favorite/model/useFavoriteContext";
import { getWeatherSummaryByLatLon } from "../../entities/weather/model/service";
import type {
  WeatherIconKey,
  WeatherSummary,
} from "../../entities/weather/model/type";
import {
  conditionToText,
  getCondition,
} from "../../entities/weather/model/condition";

type FavoritePlace = { name: string; lat: number; lon: number };

type FavoriteWeatherItem = {
  name: string;
  current: number | null;
  min: number | null;
  max: number | null;
  conditionText: WeatherIconKey | null;
};

export function FavoritesPage() {
  const { favorites, remove } = useFavoriteContext();

  const favoriteList: FavoritePlace[] = useMemo(
    () => Object.values(favorites ?? {}),
    [favorites],
  );

  const queries = useQueries({
    queries: favoriteList.map((fav) => ({
      queryKey: ["weatherSummary", fav.lat, fav.lon],
      queryFn: () => getWeatherSummaryByLatLon({ lat: fav.lat, lon: fav.lon }),
      staleTime: 1000 * 60 * 3,
      enabled: fav.lat !== undefined && fav.lon !== undefined,

      select: (data: WeatherSummary): FavoriteWeatherItem => {
        const cond = getCondition({
          skyCode: data.current.skyCode,
          ptyCode: data.current.ptyCode,
        });

        return {
          name: fav.name,
          current: data.current.tempC ?? null,
          min: data.today.minTempC ?? null,
          max: data.today.maxTempC ?? null,
          conditionText: conditionToText(cond),
        };
      },
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const items: FavoriteWeatherItem[] = useMemo(
    () =>
      queries.map((q) => q.data).filter((v): v is FavoriteWeatherItem => !!v),
    [queries],
  );

  const handleDelete = (name: string) => {
    if (confirm(`정말 "${name}" 즐겨찾기를 삭제하시겠습니까?`)) {
      remove(name);
    }
  };
  return (
    <main>
      <h1>즐겨찾기</h1>

      {favoriteList.length === 0 ? (
        <p>즐겨찾기가 없습니다.</p>
      ) : isError ? (
        <p>일부 즐겨찾기 정보를 불러오지 못했습니다.</p>
      ) : isLoading ? (
        <p>불러오는 중…</p>
      ) : (
        <FavoriteWeatherList
          items={items}
          onChangeName={(id, nextName) => console.log(id, nextName)}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
