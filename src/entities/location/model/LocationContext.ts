import { createContext } from "react";
import type { ActiveLocation } from "./types";

export type LocationContextValue = {
  activeLocation: ActiveLocation | null;
  setFromGeo: (lat: number, lon: number) => void;
  setFromSearch: (input: { lat: number; lon: number; label: string }) => void;
  setFromFavorite: (input: {
    lat: number;
    lon: number;
    label: string;
  }) => void;
  clear: () => void;
};

export const LocationContext = createContext<LocationContextValue | null>(null);
