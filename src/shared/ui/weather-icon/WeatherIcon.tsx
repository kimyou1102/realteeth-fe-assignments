import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
} from "lucide-react";

const weatherIconMap = {
  맑음: Sun,
  구름많음: Cloud,
  흐림: Cloud,
  비: CloudRain,
  소나기: CloudLightning,
  눈: CloudSnow,
  "비/눈": CloudSnow,
  빗방울: CloudDrizzle,
  빗방울눈날림: CloudSnow,
} as const;

import type { ComponentProps } from "react";
import type { WeatherIconKey } from "../../../entities/weather/model/type";

type Props = {
  name: WeatherIconKey | null;
  size?: number;
} & Omit<ComponentProps<"svg">, "name">;

export function WeatherIcon({ name, size = 24, ...props }: Props) {
  if (!name) return null;

  const Icon = weatherIconMap[name];
  if (!Icon) return null;

  return <Icon width={size} height={size} {...props} />;
}
