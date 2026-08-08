// Util kecil bikin varian gelap/terang dari satu warna hex admin,
// supaya cukup isi 1 warna di Pengaturan Situs, bukan 3.
function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return "#" + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("");
}

export function shade(hex: string, percent: number) {
  // percent negatif = lebih gelap, positif = lebih terang
  try {
    const { r, g, b } = hexToRgb(hex);
    const amt = 255 * (percent / 100);
    return rgbToHex(r + amt, g + amt, b + amt);
  } catch {
    return hex;
  }
}

export function hexToRgbTriplet(hex: string): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    return `${r}, ${g}, ${b}`;
  } catch {
    return "254, 80, 0";
  }
}
