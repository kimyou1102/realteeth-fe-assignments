import { MapPinOff } from "lucide-react";

export function LocationPermissionDenied() {
  return (
    <div
      className={
        "flex w-full flex-col items-center justify-center gap-4 rounded-2xl bg-white px-6 py-10 text-center"
      }
      role="status"
      aria-live="polite"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
        <MapPinOff className="h-10 w-10 text-gray-500" aria-hidden="true" />
      </div>

      <p className="text-base font-medium text-gray-600">
        위치 권한이 거부되었습니다.
      </p>
    </div>
  );
}
