import { useContext } from "react";
import { FavoriteContext } from "./FavoriteContext";

export function useFavoriteContext() {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error("useFavoriteContext must be used within FavoriteProvider");
  }

  return context;
}
