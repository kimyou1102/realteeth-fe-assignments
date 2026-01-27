import type { KmaItem } from "../../../shared/api/kma/types";
import type { PtyCode, SkyCode, WeatherSummary } from "./type";

function toKstIso(now: Date) {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString();
}

function pickObsString(items: KmaItem[], category: string): string | null {
  return items.find((it) => it.category === category)?.obsrValue ?? null;
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

function asSkyCode(v: string | null): SkyCode | null {
  return v === "1" || v === "3" || v === "4" ? v : null;
}
function asPtyCode(v: string | null): PtyCode | null {
  return v === "0" ||
    v === "1" ||
    v === "2" ||
    v === "3" ||
    v === "4" ||
    v === "5" ||
    v === "6" ||
    v === "7"
    ? v
    : null;
}

//  "현재 하늘상태"를 위해 가장 가까운 예보 key 선택 로직
function pickNearestForecastKey(keys: string[], todayYmd: string, now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const ymd = `${kst.getUTCFullYear()}${String(kst.getUTCMonth() + 1).padStart(2, "0")}${String(
    kst.getUTCDate(),
  ).padStart(2, "0")}`;
  const hm = `${String(kst.getUTCHours()).padStart(2, "0")}${String(kst.getUTCMinutes()).padStart(2, "0")}`;

  const target = `${ymd}${hm}`;

  const todayKeys = keys.filter((k) => k.slice(0, 8) === todayYmd);
  if (todayKeys.length === 0) return null;

  return todayKeys.find((k) => k >= target) ?? todayKeys[todayKeys.length - 1];
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
      skyCode: asSkyCode(cat["SKY"] ?? null),
      ptyCode: asPtyCode(cat["PTY"] ?? null),
    });
  }

  //"현재 상태" SKY/PTY 계산
  const nearestKey = pickNearestForecastKey(keys, args.todayYmd, args.now);
  const nearestCat = nearestKey ? (fcstMap.get(nearestKey) ?? null) : null;

  // PTY는 실황 우선, 없으면 예보 fallback
  const ptyFromNcst = pickObsString(args.ncstItems, "PTY");
  const ptyFromFcst = nearestCat?.["PTY"] ?? null;

  const currentPtyCode = asPtyCode(ptyFromNcst ?? ptyFromFcst);
  const currentSkyCode = asSkyCode(nearestCat?.["SKY"] ?? null);

  return {
    nx: args.nx,
    ny: args.ny,
    fetchedAtKST: toKstIso(args.now),
    current: {
      tempC: pickObs(args.ncstItems, "T1H"),
      humidityPct: pickObs(args.ncstItems, "REH"),
      windSpeedMs: pickObs(args.ncstItems, "WSD"),
      skyCode: currentSkyCode,
      ptyCode: currentPtyCode,
    },
    today: { minTempC, maxTempC },
    hourly3h,
  };
}
