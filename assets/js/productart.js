/* ChemSurplus — generated product imagery.
   Each lot gets a distinct, original SVG "product photo" composed from:
     packaging silhouette (drum/tote/supersack/pail/bottle/tanker/cylinder)
     + material treatment (category colour, liquid vs powder)
     + GHS hazard pictogram (corrosive / flammable) where relevant
     + a label with category code + CAS.
   No external/binary images — fast, license-clean, on-brand. */

const MATERIAL = {
  "solvents":            { fill: "#cfe6ff", deep: "#8fc1f0", code: "SOL" },
  "specialty-chemicals": { fill: "#e3efe9", deep: "#bcd7cb", code: "SPC" },
  "resins-coatings":     { fill: "#f0cf8f", deep: "#d6a44e", code: "RES" },
  "lab-reagents":        { fill: "#bcdcff", deep: "#6aa6e6", code: "LAB" },
  "surfactants":         { fill: "#f3e7a6", deep: "#e0c95f", code: "SUR" },
  "acids-bases":         { fill: "#ffd9c2", deep: "#f0935f", code: "ACD" },
  "polymers-additives":  { fill: "#eef1ef", deep: "#cfd8d3", code: "POL" },
  "intermediates":       { fill: "#d7efe7", deep: "#8fcdba", code: "INT" }
};
const HAZARD = { "acids-bases": "corrosive", "solvents": "flammable" };

function ghsPictogram(kind, x, y) {
  const sym = kind === "corrosive"
    ? '<path d="M-8 -3h6v-4M-3 -4l4 4M6 -3v5M3 2h6" stroke="#111" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M-9 5q9 4 18 0" stroke="#111" stroke-width="1.3" fill="none"/>'
    : '<path d="M0 -8C5 -3 6 0 3 4 2 6 -1 6 -2 3 -3 1 -2 -1 0 -8Z" fill="#111"/>';
  return `<g transform="translate(${x},${y}) rotate(45)">
      <rect x="-12" y="-12" width="24" height="24" rx="3" fill="#fff" stroke="#e0202a" stroke-width="3"/>
      <g transform="rotate(-45)">${sym}</g></g>`;
}

function label(cx, topY, w, m, cas) {
  return `<g>
    <rect x="${cx - w/2}" y="${topY}" width="${w}" height="34" rx="4" fill="#ffffff" stroke="#d8e3de"/>
    <rect x="${cx - w/2}" y="${topY}" width="${w}" height="9" rx="4" fill="${m.deep}"/>
    <text x="${cx}" y="${topY+23}" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="11" fill="#0a1f1b" text-anchor="middle">${m.code}</text>
    <text x="${cx}" y="${topY+31}" font-family="Inter, sans-serif" font-size="6.5" fill="#5d726c" text-anchor="middle">CAS ${cas}</text>
  </g>`;
}

const SHAPES = {
  "Drums": (m, cas) => `
    <ellipse cx="100" cy="58" rx="40" ry="11" fill="${m.deep}"/>
    <rect x="60" y="58" width="80" height="92" fill="${m.fill}"/>
    <ellipse cx="100" cy="150" rx="40" ry="11" fill="${m.deep}"/>
    <rect x="60" y="80" width="80" height="5" fill="${m.deep}" opacity=".7"/>
    <rect x="60" y="123" width="80" height="5" fill="${m.deep}" opacity=".7"/>
    <ellipse cx="100" cy="58" rx="40" ry="11" fill="none" stroke="${m.deep}" stroke-width="2"/>
    ${label(100, 90, 56, m, cas)}`,
  "IBC Totes": (m, cas) => `
    <rect x="56" y="60" width="88" height="92" rx="5" fill="${m.fill}" stroke="${m.deep}" stroke-width="2"/>
    <path d="M56 88h88M56 116h88M84 60v92M114 60v92" stroke="${m.deep}" stroke-width="2" opacity=".55"/>
    <rect x="90" y="152" width="20" height="12" rx="2" fill="${m.deep}"/>
    <rect x="52" y="56" width="96" height="6" rx="3" fill="#9fb0a9"/>
    ${label(100, 78, 50, m, cas)}`,
  "Supersacks": (m, cas) => `
    <path d="M62 70q38 -16 76 0v66q-38 10 -76 0Z" fill="${m.fill}" stroke="${m.deep}" stroke-width="2"/>
    <path d="M70 62q0 -16 12 -18M130 62q0 -16 -12 -18" stroke="#9fb0a9" stroke-width="4" fill="none"/>
    <path d="M62 70q38 -14 76 0" stroke="${m.deep}" stroke-width="2" fill="none" opacity=".5"/>
    ${label(100, 92, 52, m, cas)}`,
  "Pails": (m, cas) => `
    <ellipse cx="100" cy="74" rx="34" ry="9" fill="${m.deep}"/>
    <path d="M66 74 72 150q28 8 56 0L134 74Z" fill="${m.fill}"/>
    <ellipse cx="100" cy="74" rx="34" ry="9" fill="none" stroke="${m.deep}" stroke-width="2"/>
    <path d="M70 70q30 -22 60 0" stroke="#9fb0a9" stroke-width="3" fill="none"/>
    ${label(100, 96, 46, m, cas)}`,
  "Bottles": (m, cas) => `
    <rect x="90" y="46" width="20" height="16" rx="2" fill="${m.deep}"/>
    <path d="M86 62q14 6 28 0v78q-14 8 -28 0Z" fill="${m.fill}" stroke="${m.deep}" stroke-width="2"/>
    ${label(100, 92, 40, m, cas)}`,
  "Bulk / Tanker": (m, cas) => `
    <rect x="40" y="84" width="96" height="40" rx="20" fill="${m.fill}" stroke="${m.deep}" stroke-width="2"/>
    <rect x="92" y="74" width="14" height="12" rx="2" fill="${m.deep}"/>
    <path d="M40 104h96" stroke="${m.deep}" stroke-width="2" opacity=".4"/>
    <rect x="40" y="124" width="120" height="20" rx="4" fill="#cdd8d2"/>
    <circle cx="62" cy="150" r="11" fill="#3a4a44"/><circle cx="150" cy="150" r="11" fill="#3a4a44"/>
    <circle cx="62" cy="150" r="4" fill="#9fb0a9"/><circle cx="150" cy="150" r="4" fill="#9fb0a9"/>
    ${label(150, 92, 26, m, cas)}`,
  "Cylinders": (m, cas) => `
    <rect x="86" y="48" width="28" height="14" rx="3" fill="#9fb0a9"/>
    <rect x="80" y="60" width="40" height="92" rx="18" fill="${m.fill}" stroke="${m.deep}" stroke-width="2"/>
    <path d="M80 96h40" stroke="${m.deep}" stroke-width="2" opacity=".4"/>
    ${label(100, 104, 34, m, cas)}`
};

/* main: returns a full <svg> string for a listing */
function productArt(l) {
  const m = MATERIAL[l.cat] || MATERIAL["specialty-chemicals"];
  const shapeFn = SHAPES[l.pkg] || SHAPES["Drums"];
  const inner = shapeFn(m, l.cas || "—");
  const haz = HAZARD[l.cat] ? ghsPictogram(HAZARD[l.cat], 150, 66) : "";
  const gid = "bg-" + l.id;
  return `<svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${l.name}">
    <defs><radialGradient id="${gid}" cx="50%" cy="36%" r="78%">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${m.fill}" stop-opacity=".5"/>
    </radialGradient></defs>
    <rect width="200" height="200" fill="url(#${gid})"/>
    <ellipse cx="100" cy="166" rx="58" ry="10" fill="#0a1f1b" opacity=".07"/>
    ${inner}
    ${haz}
  </svg>`;
}
