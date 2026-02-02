import { cn } from "../../lib/cn";

interface AddressSuggestion {
  raw: string;
  label: string;
  lat?: number;
  lon?: number;
}

interface AddressAutocompleteListProps {
  address: AddressSuggestion[];
  keyword: string;
  onAddressClick: (suggestion: AddressSuggestion) => void;
}

export function AddressAutoCompleteList({
  address,
  keyword,
  onAddressClick,
}: AddressAutocompleteListProps) {
  if (address.length === 0) return null;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#e2e2e2] bg-white shadow-sm"
      role="listbox"
      aria-label="주소 자동완성 목록"
    >
      <ul className="py-2">
        {address.map((s) => (
          <li key={s.raw} role="option">
            <button
              type="button"
              onClick={() => onAddressClick(s)}
              className={cn(
                "w-full px-4 py-3 text-left text-base text-gray-900",
                "hover:bg-gray-50",
              )}
            >
              {renderHighlightedLabel(s.label, keyword)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderHighlightedLabel(label: string, keyword: string) {
  if (!keyword) return label;

  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedKeyword})`, "gi");

  return label.split(regex).map((part, idx) => {
    const isMatch = part.toLowerCase() === keyword.toLowerCase();

    return (
      <span
        key={idx}
        className={isMatch ? "text-blue-500 font-medium" : undefined}
      >
        {part}
      </span>
    );
  });
}
