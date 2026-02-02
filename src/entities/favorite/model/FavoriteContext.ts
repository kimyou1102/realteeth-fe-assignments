import { createContext } from "react";
import { useFavorites } from "./useFavorites";

export type FavoriteContextValue = ReturnType<typeof useFavorites>;

export const FavoriteContext = createContext<FavoriteContextValue | null>(null);
