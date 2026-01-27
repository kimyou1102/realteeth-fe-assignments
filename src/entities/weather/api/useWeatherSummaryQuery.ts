import { useQuery } from "@tanstack/react-query";
import { getWeatherSummaryByLatLon } from "../model/service";
import { conditionToText, getCondition } from "../model/condition";
import type { WeatherIconKey, WeatherSummary } from "../model/type";

export type WeatherSummaryWithConditionText = WeatherSummary & {
  current: WeatherSummary["current"] & { conditionText: WeatherIconKey | null };
  hourly3h: Array<
    WeatherSummary["hourly3h"][number] & {
      conditionText: WeatherIconKey | null;
    }
  >;
};

export function useWeatherSummaryQuery({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  return useQuery<WeatherSummary, Error, WeatherSummaryWithConditionText>({
    queryKey: ["weatherSummary", lat, lon],
    queryFn: () => getWeatherSummaryByLatLon({ lat, lon }),
    staleTime: 1000 * 60 * 3,
    select: (data) => {
      const currentCondition = getCondition({
        skyCode: data.current.skyCode,
        ptyCode: data.current.ptyCode,
      });

      return {
        ...data,
        current: {
          ...data.current,
          conditionText: conditionToText(currentCondition),
        },
        hourly3h: data.hourly3h.map((h) => {
          const cond = getCondition({
            skyCode: h.skyCode,
            ptyCode: h.ptyCode,
          });

          return {
            ...h,
            conditionText: conditionToText(cond),
          };
        }),
      };
    },
  });
}
