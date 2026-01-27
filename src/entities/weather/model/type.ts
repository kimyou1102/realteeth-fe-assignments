export type SkyCode = "1" | "3" | "4"; // 1: 맑음, 3: 구름많음, 4: 흐림
// // PTY는 실황/예보 코드 체계가 조금 달라서 합집합으로 둠
export type PtyCode = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";

export type WeatherSummary = {
  nx: number;
  ny: number;
  fetchedAtKST: string;

  current: {
    tempC: number | null;
    humidityPct: number | null;
    windSpeedMs: number | null;
    // skyCode는 실황에 없어서 예보 기반(가장 가까운 시간대)
    skyCode: SkyCode | null;
    // ptyCode는 실황(관측) 우선, 없으면 예보 fallback
    ptyCode: PtyCode | null;
  };

  today: {
    minTempC: number | null;
    maxTempC: number | null;
  };

  hourly3h: Array<{
    date: string;
    time: string;
    tempC: number | null;
    humidityPct: number | null;
    windSpeedMs: number | null;
    skyCode: SkyCode | null;
    ptyCode: PtyCode | null;
  }>;
};
