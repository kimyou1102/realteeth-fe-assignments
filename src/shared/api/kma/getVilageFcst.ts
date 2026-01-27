import type { AxiosRequestConfig } from "axios";
import client from "../client";
import type { KmaItem } from "./types";

type KmaResponse = {
  response: {
    header: { resultCode: string; resultMsg: string };
    body: {
      items: { item: KmaItem[] };
    };
  };
};

export async function getVilageFcst(params: {
  base_date: string;
  base_time: string;
  nx: number;
  ny: number;
}): Promise<KmaItem[]> {
  const config: AxiosRequestConfig = {
    url: "/getVilageFcst",
    params: {
      serviceKey: import.meta.env.VITE_KMA_SERVICE_KEY,
      pageNo: 1,
      numOfRows: 1000,
      dataType: "JSON",
      ...params,
    },
  };

  const data = await client.get<KmaResponse>(config);

  const { resultCode, resultMsg } = data.response.header;
  if (resultCode !== "00") {
    throw new Error(resultMsg || `KMA Error(${resultCode})`);
  }

  return data.response.body.items.item ?? [];
}
