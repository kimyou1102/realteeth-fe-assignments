import type { ReactNode } from "react";
import { FavoriteContext } from "./FavoriteContext";
import { useFavorites } from "./useFavorites";

type FavoriteProviderProps = {
  children: ReactNode;
};

export function FavoriteProvider({ children }: FavoriteProviderProps) {
  const value = useFavorites();

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}
