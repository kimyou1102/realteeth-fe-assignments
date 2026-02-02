type KakaoAddressDoc = {
  address_name: string;
  x: string; // longitude
  y: string; // latitude
};

type KakaoAddressSearchResponse = {
  documents: KakaoAddressDoc[];
};

export async function geocodeByKakao(label: string) {
  const url = new URL("https://dapi.kakao.com/v2/local/search/address.json");
  url.searchParams.set("query", label);

  const apiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
  // Vite client env vars are exposed via import.meta.env.
  if (!apiKey) {
    throw new Error("Missing VITE_KAKAO_REST_API_KEY");
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${apiKey}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch geocode");
  }

  const data = (await res.json()) as KakaoAddressSearchResponse;
  const doc = data.documents[0];

  if (!doc) {
    throw new Error("No geocode results");
  }

  const lat = Number(doc.y);
  const lon = Number(doc.x);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("Invalid geocode result");
  }

  return { lat, lon };
}
