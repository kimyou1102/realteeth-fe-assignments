export function normalize(value: string) {
  return value.replace(/[\s-]/g, "").toLowerCase();
}
