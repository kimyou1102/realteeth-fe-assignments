import { getUltraSrtNcst } from "../../../shared/api/kma/getUltraSrtNcst";
import { getVilageFcst } from "../../../shared/api/kma/getVilageFcst";
import { latLonToNxNy } from "../../../shared/lib/kma/grid";
import {
  formatYmdKST,
  getUltraNcstBase,
  getVilageFcstBase,
} from "../../../shared/lib/kma/time";
import { mapToWeatherSummary } from "./mapper";
import type { WeatherSummary } from "./type";

type WeatherSource = "ULTRA_NCST" | "VILAGE_FCST";

export class WeatherApiError extends Error {
  public readonly source: WeatherSource;
  public readonly cause?: unknown;

  constructor(args: {
    source: WeatherSource;
    message: string;
    cause?: unknown;
  }) {
    super(args.message);
    this.name = "WeatherApiError";
    this.source = args.source;
    this.cause = args.cause;
  }
}

export async function getWeatherSummaryByLatLon(args: {
  lat: number;
  lon: number;
}): Promise<WeatherSummary> {
  const now = new Date();
  const { nx, ny } = latLonToNxNy(args.lat, args.lon);

  const ultraBase = getUltraNcstBase(now);
  const vilageBase = getVilageFcstBase(now);

  const ncstPromise = getUltraSrtNcst({ nx, ny, ...ultraBase }).catch((e) => {
    throw new WeatherApiError({
      source: "ULTRA_NCST",
      message: "초단기실황 조회 실패",
      cause: e,
    });
  });

  const vilagePromise = getVilageFcst({ nx, ny, ...vilageBase }).catch((e) => {
    throw new WeatherApiError({
      source: "VILAGE_FCST",
      message: "단기예보 조회 실패",
      cause: e,
    });
  });

  const [ncstItems, vilageItems] = await Promise.all([
    ncstPromise,
    vilagePromise,
  ]);

  const todayYmd = formatYmdKST(now);

  return mapToWeatherSummary({
    nx,
    ny,
    now,
    todayYmd,
    ncstItems,
    vilageItems,
  });
}
