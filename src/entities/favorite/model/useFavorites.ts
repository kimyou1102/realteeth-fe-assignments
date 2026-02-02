import { useCallback, useState } from "react";
import { FAVORITE_LOCATIONS_KEY } from "../../../shared/constant/localStorage";

export type FavoriteLocation = {
  id: string;
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
            id,
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

  const remove = useCallback((id: string) => {
    if (!id) return;

    setFavorites((prev) => {
      if (!prev[id]) return prev;

      const next = { ...prev };
      delete next[id];

      saveFavorites(next);
      return next;
    });
  }, []);

  const reName = useCallback((id: string, nextName: string) => {
    const trimmed = nextName.trim();
    if (!id) return;
    if (!trimmed) return;

    setFavorites((prev) => {
      const target = prev[id];
      if (!target) return prev;
      if (target.name === trimmed) return prev;

      const next: FavoriteMap = {
        ...prev,
        [id]: { ...target, name: trimmed },
      };

      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (location: LocationLike, adminRegion: string | null) => {
      if (!location) return false;
      const id = location.label ?? adminRegion ?? "";
      return Boolean(favorites[id]);
    },
    [favorites],
  );

  return { favorites, toggle, remove, reName, isFavorite };
}
