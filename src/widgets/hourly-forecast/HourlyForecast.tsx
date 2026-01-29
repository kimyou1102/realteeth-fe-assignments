import type {
  PtyCode,
  SkyCode,
  WeatherIconKey,
} from "../../entities/weather/model/type";
import { WeatherIcon } from "../../shared/ui/weather-icon/WeatherIcon";

interface HourlyForecast {
  date: string;
  time: string;
  tempC: number | null;
  humidityPct: number | null;
  windSpeedMs: number | null;
  skyCode: SkyCode | null;
  ptyCode: PtyCode | null;
  conditionText: WeatherIconKey | null;
}

interface HourlyForecastProps {
  forecasts: HourlyForecast[];
}

export function HourlyForecast({ forecasts }: HourlyForecastProps) {
  return (
    <section
      className={
        "w-full rounded-2xl border border-[#e2e2e2] bg-white px-5 py-4 shadow-sm"
      }
      aria-label="시간별 예보"
    >
      <h3 className="text-sm font-semibold text-gray-700">시간별 예보</h3>

      <div className="mt-4 overflow-x-auto">
        <ul className="flex w-max gap-8 pr-4">
          {forecasts.map((forecast) => (
            <li
              key={`${forecast.date}-${forecast.time}`}
              className="flex w-[72px] shrink-0 flex-col items-center text-center"
            >
              <div className="text-sm text-gray-600">
                {getPeriodLabel(forecast.time)}
              </div>
              <div className="mt-1 text-sm text-gray-600">{forecast.time}</div>

              <WeatherIcon name={forecast.conditionText} size={56} />

              <div className="mt-4 text-lg font-medium text-gray-900">
                {forecast.tempC}°
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function getPeriodLabel(time: string) {
  const hour = Number(time.split(":")[0]);
  return hour < 12 ? "오전" : "오후";
}
