import { normalize } from "./normalize";

export type AddressItem = {
  raw: string;
  label: string;
};

export const MAX_SUGGESTIONS = 8;

type ScoredAddress = AddressItem & {
  score: number;
  length: number;
};

function getScore(normalizedQuery: string, normalizedAddress: string) {
  if (normalizedAddress === normalizedQuery) return 1000;
  if (normalizedAddress.startsWith(normalizedQuery)) return 700;
  if (normalizedAddress.includes(normalizedQuery)) return 400;
  return 0;
}

export function searchAddresses(
  addresses: string[],
  query: string,
  maxSuggestions = MAX_SUGGESTIONS,
) {
  if (query.trim() === "") return [];

  const normalizedQuery = normalize(query);
  if (normalizedQuery.length === 0) return [];

  const matches: ScoredAddress[] = [];

  for (const raw of addresses) {
    const normalizedAddress = normalize(raw);
    const score = getScore(normalizedQuery, normalizedAddress);
    if (score === 0) continue;

    matches.push({
      raw,
      label: raw.replace(/-/g, " "),
      score,
      length: raw.length,
    });
  }

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.length - b.length;
  });

  return matches.slice(0, maxSuggestions).map(({ raw, label }) => ({
    raw,
    label,
  }));
}
