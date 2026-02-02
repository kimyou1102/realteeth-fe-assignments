import { useCallback, useMemo, useState } from "react";
import type { ActiveLocation } from "./types";
import { LocationContext } from "./LocationContext";

type LocationState = ActiveLocation | null;

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [activeLocation, setActiveLocation] = useState<LocationState>(null);

  const setFromGeo = useCallback((lat: number, lon: number) => {
    setActiveLocation((prev) => {
      if (prev) return prev;
      return {
        lat,
        lon,
        source: "geo",
      };
    });
  }, []);

  const setFromSearch = useCallback(
    (input: { lat: number; lon: number; label: string }) => {
      setActiveLocation({
        lat: input.lat,
        lon: input.lon,
        label: input.label,
      });
    },
    [],
  );

  const setFromFavorite = useCallback(
    (input: { lat: number; lon: number; label: string }) => {
      setActiveLocation({
        lat: input.lat,
        lon: input.lon,
        label: input.label,
      });
    },
    [],
  );

  const clear = useCallback(() => {
    setActiveLocation(null);
  }, []);

  const value = useMemo(
    () => ({
      activeLocation,
      setFromGeo,
      setFromSearch,
      setFromFavorite,
      clear,
    }),
    [activeLocation, setFromGeo, setFromSearch, setFromFavorite, clear],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
