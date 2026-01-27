import type { SkyCode, PtyCode } from "./type";

export type WeatherCondition =
  | "SUNNY"
  | "CLOUDY"
  | "OVERCAST"
  | "RAIN"
  | "SNOW"
  | "SLEET"
  | "SHOWER"
  | "DRIZZLE"
  | "SNOW_FLURRY";

export function getCondition(args: {
  skyCode: SkyCode | null;
  ptyCode: PtyCode | null;
}): WeatherCondition | null {
  // 강수 우선
  if (args.ptyCode && args.ptyCode !== "0") {
    switch (args.ptyCode) {
      case "1":
        return "RAIN";
      case "2":
        return "SLEET";
      case "3":
        return "SNOW";
      case "4":
        return "SHOWER";
      case "5":
        return "DRIZZLE";
      case "6":
        return "SLEET";
      case "7":
        return "SNOW_FLURRY";
    }
  }

  if (!args.skyCode) return null;
  if (args.skyCode === "1") return "SUNNY";
  if (args.skyCode === "3") return "CLOUDY";
  return "OVERCAST";
}

export function conditionToText(cond: WeatherCondition | null): string | null {
  if (!cond) return null;
  switch (cond) {
    case "SUNNY":
      return "맑음";
    case "CLOUDY":
      return "구름많음";
    case "OVERCAST":
      return "흐림";
    case "RAIN":
      return "비";
    case "SNOW":
      return "눈";
    case "SLEET":
      return "비/눈";
    case "SHOWER":
      return "소나기";
    case "DRIZZLE":
      return "빗방울";
    case "SNOW_FLURRY":
      return "눈날림";
  }
}

export function conditionToIcon(cond: WeatherCondition | null): string | null {
  if (!cond) return null;
  switch (cond) {
    case "SUNNY":
      return "sun";
    case "CLOUDY":
      return "cloud";
    case "OVERCAST":
      return "cloudy";
    case "RAIN":
      return "rain";
    case "SNOW":
      return "snow";
    case "SLEET":
      return "sleet";
    case "SHOWER":
      return "shower";
    case "DRIZZLE":
      return "drizzle";
    case "SNOW_FLURRY":
      return "snow-wind";
  }
}
