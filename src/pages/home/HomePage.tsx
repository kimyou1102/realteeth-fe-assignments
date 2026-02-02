import { CurrentWeatherCard } from "../../widgets/current-weather-card/CurrentWeatherCard";
import { useWeatherSummaryQuery } from "../../entities/weather/api/useWeatherSummaryQuery";
import { useGeolocation } from "../../shared/lib/geolocation/useGeolocation";
import { LocationPermissionDenied } from "../../shared/ui/location-permission-denied/LocationPermissionDenied";
import { useQuery } from "@tanstack/react-query";
import { HourlyForecast } from "../../widgets/hourly-forecast/HourlyForecast";
import { SearchInput } from "../../shared/ui/search-input/SearchInput";
import { useEffect, useMemo, useState } from "react";
import { AddressAutoCompleteList } from "../../shared/ui/address-auto-complete-list/AddressAutocompleteList";
import koreaDistricts from "../../shared/data/korea_districts.json";
import { reverseGeocodeKoreanAdmin } from "../../shared/lib/kakao/reverseGeocodeKoreanAdmin";
import { geocodeByKakao } from "../../shared/lib/kakao/geocodeByKakao";
import { useDebouncedValue } from "../../shared/lib/addressSearch/useDebouncedValue";
import {
  MAX_SUGGESTIONS,
  searchAddresses,
  type AddressItem,
} from "../../shared/lib/addressSearch/searchAddresses";
import { useActiveLocation } from "../../entities/location/model/useActiveLocation";
import { useFavoriteContext } from "../../entities/favorite/model/useFavoriteContext";

export function HomePage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchError, setIsSearchError] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const { coords, isLoading, error } = useGeolocation();
  const { activeLocation, setFromGeo, setFromSearch } = useActiveLocation();
  const debouncedQuery = useDebouncedValue(searchKeyword, 150);
  const { toggle, isFavorite } = useFavoriteContext();

  const { data: weatherSummary, isError: isWeatherSummaryError } =
    useWeatherSummaryQuery({
      lat: activeLocation?.lat,
      lon: activeLocation?.lon,
    });

  const { data: adminRegion } = useQuery({
    queryKey: ["adminRegion", activeLocation?.lat, activeLocation?.lon],
    enabled:
      activeLocation?.lat != undefined &&
      activeLocation?.lon != undefined &&
      !activeLocation?.label,
    queryFn: () =>
      reverseGeocodeKoreanAdmin({
        lat: activeLocation!.lat,
        lng: activeLocation!.lon,
      }),
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (!activeLocation && coords) {
      setFromGeo(coords.lat, coords.lng);
    }
  }, [activeLocation, coords, setFromGeo]);

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
    setIsSuggestionOpen(true);
  };

  const handleAddressClick = async (suggestion: AddressItem) => {
    setSearchKeyword(suggestion.label);
    setIsSuggestionOpen(false);
    setSearchKeyword("");

    try {
      const lat = suggestion.lat;
      const lon = suggestion.lon;
      const coordsFromLabel =
        lat != undefined && lon != undefined
          ? { lat, lon }
          : await geocodeByKakao(suggestion.label);

      setFromSearch({
        lat: coordsFromLabel.lat,
        lon: coordsFromLabel.lon,
        label: suggestion.label,
      });
    } catch (err) {
      setIsSearchError(true);
      console.error(err);
    }
  };

  const handleFavoriteClick = () => {
    toggle(activeLocation, adminRegion!);
  };

  const isFavoriteValue = isFavorite(activeLocation, adminRegion!);

  const suggestions = useMemo(
    () => searchAddresses(koreaDistricts, debouncedQuery, MAX_SUGGESTIONS),
    [debouncedQuery],
  );

  if (!activeLocation && isLoading) return <div>위치 확인 중...</div>;

  return (
    <main>
      {error && !activeLocation ? (
        <LocationPermissionDenied />
      ) : (
        <>
          <div>
            <SearchInput
              placeholder="장소 검색 (시, 구, 동)"
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <AddressAutoCompleteList
              keyword={searchKeyword}
              address={isSuggestionOpen ? suggestions : []}
              onAddressClick={handleAddressClick}
            />
          </div>
          {isSearchError || (isWeatherSummaryError && !weatherSummary) ? (
            <div>해당 장소의 정보가 제공되지 않습니다.</div>
          ) : (
            <>
              <CurrentWeatherCard
                locationName={activeLocation?.label ?? adminRegion ?? ""}
                temperature={weatherSummary?.current.tempC ?? 0}
                conditionLabel={weatherSummary?.current.conditionText ?? null}
                tempMax={weatherSummary?.today.maxTempC ?? 0}
                tempMin={weatherSummary?.today.minTempC ?? 0}
                humidity={weatherSummary?.current.humidityPct ?? 0}
                windSpeed={weatherSummary?.current.windSpeedMs ?? 0}
                // TODO: 즐겨찾기 기능 추가 예정
                isFavorite={isFavoriteValue}
                onFavoriteToggle={handleFavoriteClick}
              />
              <HourlyForecast forecasts={weatherSummary?.hourly3h ?? []} />
            </>
          )}
        </>
      )}
    </main>
  );
}
