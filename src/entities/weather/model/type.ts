export type WeatherSummary = {
  nx: number;
  ny: number;
  fetchedAtKST: string;

  current: {
    tempC: number | null;
    humidityPct: number | null;
    windSpeedMs: number | null;
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
  }>;
};
