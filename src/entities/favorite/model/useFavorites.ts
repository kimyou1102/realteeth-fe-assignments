import { useCallback, useState } from "react";
import { FAVORITE_LOCATIONS_KEY } from "../../../shared/constant/localStorage";

export type FavoriteLocation = {
  name: string;
  lat: number;
  lon: number;
};

export type FavoriteMap = Record<string, FavoriteLocation>;

type LocationLike = {
  lat: number;
  lon: number;
  label?: string | null;
} | null;

function loadFavorites(): FavoriteMap {
  const raw = localStorage.getItem(FAVORITE_LOCATIONS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as FavoriteMap;
  } catch {
    return {};
  }
}

function saveFavorites(next: FavoriteMap) {
  localStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(next));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMap>(() =>
    loadFavorites(),
  );

  const toggle = useCallback(
    (location: LocationLike, adminRegion: string | null) => {
      if (!location) return;
      const id = location.label ?? adminRegion ?? "";
      if (!id) return;

      setFavorites((prev) => {
        const next = { ...prev };

        console.log("location", location);
        if (next[id]) {
          delete next[id];
        } else {
          next[id] = {
            name: location.label ?? adminRegion ?? "",
            lat: location.lat,
            lon: location.lon,
          };
        }

        saveFavorites(next);
        return next;
      });
    },
    [],
  );

  const isFavorite = useCallback(
    (location: LocationLike, adminRegion: string | null) => {
      if (!location) return false;
      const id = location.label ?? adminRegion ?? "";
      return Boolean(favorites[id]);
    },
    [favorites],
  );

  return { favorites, toggle, isFavorite };
}
