export default function rgbToHex(r: number, g: number, b: number): string {
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
