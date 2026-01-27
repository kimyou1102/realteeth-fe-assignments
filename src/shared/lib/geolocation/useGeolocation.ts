import { useEffect, useState } from "react";

type LatLng = {
  lat: number;
  lng: number;
};

export function useGeolocation() {
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      () => {
        setError(true);
        setIsLoading(false);
      },
    );
  }, []);

  return {
    coords,
    isLoading,
    error,
  };
}
