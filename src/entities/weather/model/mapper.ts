import type { KmaItem } from "../../../shared/api/kma/types";
import type { WeatherSummary } from "./type";

function toKstIso(now: Date) {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString();
}

function pickObs(items: KmaItem[], category: string): number | null {
  const v = items.find((it) => it.category === category)?.obsrValue;
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function groupFcst(items: KmaItem[]) {
  const map = new Map<string, Record<string, string>>();
  for (const it of items) {
    if (!it.fcstDate || !it.fcstTime || it.fcstValue == null) continue;
    const key = `${it.fcstDate}${it.fcstTime}`;
    const prev = map.get(key) ?? {};
    prev[it.category] = it.fcstValue;
    map.set(key, prev);
  }
  return map;
}

function safeNum(v: string | undefined): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function ymdToDashed(ymd: string) {
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}
function hmToColon(hm: string) {
  return `${hm.slice(0, 2)}:${hm.slice(2, 4)}`;
}

function is3hSlot(hm: string) {
  const h = Number(hm.slice(0, 2));
  const m = Number(hm.slice(2, 4));
  return m === 0 && h % 3 === 0;
}

export function mapToWeatherSummary(args: {
  nx: number;
  ny: number;
  now: Date;
  todayYmd: string;
  ncstItems: KmaItem[];
  vilageItems: KmaItem[];
}): WeatherSummary {
  const fcstMap = groupFcst(args.vilageItems);
  const keys = Array.from(fcstMap.keys()).sort();

  let minTempC: number | null = null;
  let maxTempC: number | null = null;

  for (const key of keys) {
    const fcstDate = key.slice(0, 8);
    if (fcstDate !== args.todayYmd) continue;
    const cat = fcstMap.get(key)!;

    if (minTempC == null && cat["TMN"] != null) minTempC = safeNum(cat["TMN"]);
    if (maxTempC == null && cat["TMX"] != null) maxTempC = safeNum(cat["TMX"]);
    if (minTempC != null && maxTempC != null) break;
  }

  const hourly3h: WeatherSummary["hourly3h"] = [];
  for (const key of keys) {
    const fcstDate = key.slice(0, 8);
    const fcstTime = key.slice(8, 12);
    if (fcstDate !== args.todayYmd) continue;
    if (!is3hSlot(fcstTime)) continue;

    const cat = fcstMap.get(key)!;

    hourly3h.push({
      date: ymdToDashed(fcstDate),
      time: hmToColon(fcstTime),
      tempC: safeNum(cat["TMP"]),
      humidityPct: safeNum(cat["REH"]),
      windSpeedMs: safeNum(cat["WSD"]),
    });
  }

  return {
    nx: args.nx,
    ny: args.ny,
    fetchedAtKST: toKstIso(args.now),
    current: {
      tempC: pickObs(args.ncstItems, "T1H"),
      humidityPct: pickObs(args.ncstItems, "REH"),
      windSpeedMs: pickObs(args.ncstItems, "WSD"),
    },
    today: { minTempC, maxTempC },
    hourly3h,
  };
}
