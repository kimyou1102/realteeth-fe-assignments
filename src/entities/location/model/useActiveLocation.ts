import { useContext } from "react";
import { LocationContext } from "./LocationContext";

export function useActiveLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useActiveLocation must be used within LocationProvider");
  }
  return ctx;
}
