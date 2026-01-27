function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toKstDate(d: Date): Date {
  return new Date(d.getTime() + 9 * 60 * 60 * 1000);
}

export function formatYmdKST(d: Date): string {
  const kst = toKstDate(d);
  return `${kst.getUTCFullYear()}${pad2(kst.getUTCMonth() + 1)}${pad2(
    kst.getUTCDate(),
  )}`;
}

export function formatHmKST(d: Date): string {
  const kst = toKstDate(d);
  return `${pad2(kst.getUTCHours())}${pad2(kst.getUTCMinutes())}`;
}

export function getUltraNcstBase(now = new Date()): {
  base_date: string;
  base_time: string;
} {
  const base_date = formatYmdKST(now);
  const hm = formatHmKST(now);
  const hh = hm.slice(0, 2);
  return { base_date, base_time: `${hh}00` };
}

const VILAGE_BASE_TIMES = [
  "2300",
  "2000",
  "1700",
  "1400",
  "1100",
  "0800",
  "0500",
  "0200",
] as const;

export function getVilageFcstBase(now = new Date()): {
  base_date: string;
  base_time: string;
} {
  const base_date = formatYmdKST(now);
  const hm = formatHmKST(now);
  const current = Number(hm);

  for (const t of VILAGE_BASE_TIMES) {
    if (current >= Number(t)) return { base_date, base_time: t };
  }

  const prev = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return { base_date: formatYmdKST(prev), base_time: "2300" };
}
