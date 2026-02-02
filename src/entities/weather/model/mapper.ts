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

function toKstKey(d: Date) {
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kst.getUTCDate()).padStart(2, "0");
  const hh = String(kst.getUTCHours()).padStart(2, "0");
  const mm = String(kst.getUTCMinutes()).padStart(2, "0");
  return `${y}${m}${day}${hh}${mm}`; // YYYYMMDDHHmm
}

function ceilToNext3h(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = kst.getUTCMonth();
  const d = kst.getUTCDate();
  const h = kst.getUTCHours();

  const nextH = Math.ceil((h + 1e-9) / 3) * 3; // 현재 시각이면 다음 슬롯
  const aligned = new Date(Date.UTC(y, m, d, nextH % 24, 0, 0));

  // nextH가 24면 다음날 00시로 넘겨야 함
  if (nextH >= 24) {
    aligned.setUTCDate(aligned.getUTCDate() + 1);
    aligned.setUTCHours(0);
  }

  // aligned는 KST기준 UTC로 만들어졌으니, 다시 "원래 Date(UTC)"로 되돌리려면 -9h
  return new Date(aligned.getTime() - 9 * 60 * 60 * 1000);
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

  if (minTempC == null || maxTempC == null) {
    const temps: number[] = [];
    for (const key of keys) {
      const fcstDate = key.slice(0, 8);
      if (fcstDate !== args.todayYmd) continue;
      const cat = fcstMap.get(key)!;
      const t = safeNum(cat["TMP"]);
      if (t != null) temps.push(t);
    }
    if (temps.length > 0) {
      if (minTempC == null) minTempC = Math.min(...temps);
      if (maxTempC == null) maxTempC = Math.max(...temps);
    }
  }

  const start = ceilToNext3h(args.now);
  const startKey = toKstKey(start);
  const endKey = toKstKey(new Date(start.getTime() + 24 * 60 * 60 * 1000));

  const hourly3h: WeatherSummary["hourly3h"] = [];

  for (const key of keys) {
    // key: YYYYMMDDHHmm
    if (key < startKey) continue;
    if (key >= endKey) break; // keys가 sort 되어 있으니 break 가능

    const fcstTime = key.slice(8, 12);
    if (!is3hSlot(fcstTime)) continue;

    const cat = fcstMap.get(key)!;
    const fcstDate = key.slice(0, 8);

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
