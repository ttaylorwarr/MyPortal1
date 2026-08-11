import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");
mkdirSync(outDir, { recursive: true });

const themes = [
  { slug: "malibu-villa", colors: ["#0ea5e9", "#38bdf8"], icons: ["🏖️", "🌊", "🏊", "🌅"] },
  { slug: "chicago-suite", colors: ["#334155", "#64748b"], icons: ["🏙️", "🛏️", "💼", "🌃"] },
  { slug: "aspen-cabin", colors: ["#166534", "#4d7c0f"], icons: ["🏔️", "🔥", "🛁", "🌲"] },
  { slug: "austin-loft", colors: ["#7c3aed", "#a78bfa"], icons: ["💻", "🛋️", "☕", "🏢"] },
  { slug: "boston-hotel", colors: ["#92400e", "#c2703d"], icons: ["🏛️", "🛏️", "🍽️", "🕰️"] },
  { slug: "tahoe-house", colors: ["#0369a1", "#0ea5e9"], icons: ["🛶", "🚤", "🌲", "🌇"] },
  { slug: "nyc-hotel", colors: ["#1e1b4b", "#4338ca"], icons: ["🌆", "🛏️", "🏢", "✨"] },
  { slug: "scottsdale-house", colors: ["#c2410c", "#f59e0b"], icons: ["🌵", "🏊", "🌅", "🏡"] },
  { slug: "seattle-studio", colors: ["#0f766e", "#14b8a6"], icons: ["📚", "🛏️", "☕", "🌧️"] },
  { slug: "keywest-bungalow", colors: ["#059669", "#34d399"], icons: ["🌴", "🌺", "🏝️", "🚲"] },
  { slug: "dallas-hotel", colors: ["#1e40af", "#3b82f6"], icons: ["✈️", "🛏️", "🚕", "🏢"] },
  { slug: "napa-house", colors: ["#7f1d1d", "#b91c1c"], icons: ["🍇", "🍷", "🏡", "🌄"] },
];

function svg({ colors, icon, label }) {
  const [c1, c2] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <circle cx="1000" cy="150" r="220" fill="#ffffff" fill-opacity="0.08"/>
  <circle cx="150" cy="700" r="260" fill="#ffffff" fill-opacity="0.08"/>
  <text x="600" y="440" font-size="220" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  <text x="600" y="620" font-size="40" font-family="Arial, sans-serif" font-weight="700" fill="#ffffff" fill-opacity="0.9" text-anchor="middle">${label}</text>
</svg>`;
}

for (const theme of themes) {
  theme.icons.forEach((icon, i) => {
    const content = svg({ colors: theme.colors, icon, label: `Photo ${i + 1}` });
    writeFileSync(path.join(outDir, `${theme.slug}-${i + 1}.svg`), content, "utf8");
  });
}

console.log(`Generated ${themes.length * 4} placeholder images in public/images/`);
