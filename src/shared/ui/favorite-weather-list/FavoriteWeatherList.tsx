import type { WeatherIconKey } from "../../../entities/weather/model/type";
import { FavoriteWeatherItem } from "../favorite-weather-item/FavoriteWeatherItem";

interface FavoriteWeatherRow {
  id: string;
  name: string;
  current: number;
  min: number;
  max: number;
  conditionText: WeatherIconKey;
}

interface FavoriteWeatherListProps {
  items: FavoriteWeatherRow[];
  onChangeName: (id: string, nextName: string) => void;
  onDelete: (id: string) => void;
  editable?: boolean;
}

export function FavoriteWeatherList({
  items,
  onChangeName,
  onDelete,
  editable = true,
}: FavoriteWeatherListProps) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => (
        <FavoriteWeatherItem
          key={item.name}
          name={item.name}
          current={item.current}
          min={item.min}
          max={item.max}
          conditionText={item.conditionText}
          onChangeName={(next) => onChangeName(item.id, next)}
          onDelete={() => onDelete(item.id)}
          editable={editable}
        />
      ))}
    </div>
  );
}
