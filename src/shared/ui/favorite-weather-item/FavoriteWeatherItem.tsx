import { useId, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { WeatherIcon } from "../weather-icon/WeatherIcon";
import type { WeatherIconKey } from "../../../entities/weather/model/type";

interface FavoriteWeatherItemProps {
  name: string;
  current: number;
  min: number;
  max: number;
  conditionText: WeatherIconKey;

  onChangeName: (nextName: string) => void;
  onDelete: () => void;

  editable?: boolean;
}

export function FavoriteWeatherItem({
  name,
  current,
  min,
  max,
  conditionText,
  onChangeName,
  onDelete,
  editable = true,
}: FavoriteWeatherItemProps) {
  const inputId = useId();
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);

  const commit = () => {
    const next = draftName.trim();
    if (next && next !== name) onChangeName(next);
    setIsEditing(false);
  };

  return (
    <article className="relative w-full rounded-2xl bg-white px-6 py-6 shadow-sm">
      {editable && (
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDraftName(name);
              setIsEditing(true);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm hover:bg-blue-600"
            aria-label="이름 수정"
          >
            <Pencil className="h-5 w-5" aria-hidden />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-50"
            aria-label="즐겨찾기 삭제"
          >
            <Trash2 className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}

      {isEditing ? (
        <div className="max-w-[70%]">
          <label htmlFor={inputId} className="sr-only">
            장소 이름
          </label>
          <input
            id={inputId}
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraftName(name);
                setIsEditing(false);
              }
            }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-lg font-semibold text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            autoFocus
          />
          <p className="mt-2 text-xs text-gray-500">
            Enter로 저장 · Esc로 취소
          </p>
        </div>
      ) : (
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <WeatherIcon name={conditionText} />

          <div>
            <div className="flex items-start">
              <span className="text-4xl font-light leading-none text-gray-900">
                {current}
              </span>
              <span className="ml-1 text-lg font-medium text-gray-900">°</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{conditionText}</p>
          </div>
        </div>

        <div className="text-right text-sm text-gray-600">
          <div className="flex items-center justify-end gap-2">
            <span className="text-gray-500">최고</span>
            <span className="font-medium text-gray-900">{max}°</span>
          </div>
          <div className="mt-2 flex items-center justify-end gap-2">
            <span className="text-gray-500">최저</span>
            <span className="font-medium text-gray-900">{min}°</span>
          </div>
        </div>
      </div>
    </article>
  );
}
