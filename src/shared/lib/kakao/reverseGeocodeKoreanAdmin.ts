type KakaoCoord2RegionDoc = {
  region_type: "H" | "B";
  region_1depth_name: string; // 시/도
  region_2depth_name: string; // 시/군/구
  region_3depth_name: string; // 읍/면/동
};

type KakaoCoord2RegionResponse = {
  documents: KakaoCoord2RegionDoc[];
};

export async function reverseGeocodeKoreanAdmin({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}): Promise<string | null> {
  const url = new URL(
    "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json",
  );
  url.searchParams.set("x", String(lng));
  url.searchParams.set("y", String(lat));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
    },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as KakaoCoord2RegionResponse;

  const h = data.documents.find((d) => d.region_type === "H");
  const doc = h ?? data.documents[0];
  if (!doc) return null;

  return `${doc.region_1depth_name} ${doc.region_2depth_name} ${doc.region_3depth_name}`;
}
