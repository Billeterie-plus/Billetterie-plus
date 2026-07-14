// Modèles de plan de salle générés automatiquement : plutôt que de demander à
// l'organisateur de photographier sa salle et de cliquer siège par siège, on
// génère un plan stylisé réaliste (arène en arc de cercle façon Adidas Arena,
// théâtre à rangées droites, stade à deux tribunes) directement en SVG, avec
// les sièges positionnés mathématiquement dessus.
//
// Toutes les coordonnées (seat.x / seat.y, mais aussi le viewBox du SVG) sont
// exprimées en pourcentage 0-100, exactement comme pour un plan importé
// manuellement — le backend et l'acheteur n'ont donc aucune différence à
// gérer entre les deux modes.

import { Landmark, Theater, Trophy, type LucideIcon } from "lucide-react";

export type SeatMapTemplateId = "theatre" | "arena" | "stadium";

export interface GeneratedSeat {
  x: number;
  y: number;
  row: string;
  number: string;
}

export interface SeatMapTemplate {
  id: SeatMapTemplateId;
  labelKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  svg: () => string;
  /** Calcule les positions des sièges d'un tarif donné (bande dédiée dans la forme). */
  generateSeats: (tierIndex: number, tierCount: number, rows: number, seatsPerRow: number) => GeneratedSeat[];
}

function rowLetter(i: number): string {
  let n = i + 1;
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/** Répartit `n` points uniformément entre `a` et `b` inclus. */
function spread(a: number, b: number, n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [(a + b) / 2];
  const step = (b - a) / (n - 1);
  return Array.from({ length: n }, (_, i) => a + step * i);
}

function svgDataUrl(inner: string, width: number, height: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none" width="${width}" height="${height}">${inner}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const BG = "#eef1f8";
const INK = "#1e2749";
const LINE = "#cbd5e1";

export const SEAT_MAP_TEMPLATES: Record<SeatMapTemplateId, SeatMapTemplate> = {
  theatre: {
    id: "theatre",
    labelKey: "organizerForm.seatMapTemplateTheatreLabel",
    descriptionKey: "organizerForm.seatMapTemplateTheatreDesc",
    icon: Theater,
    svg: () =>
      svgDataUrl(
        `<rect width="100" height="100" fill="${BG}"/>
         <rect x="20" y="4" width="60" height="14" rx="2" fill="${INK}"/>
         <text x="50" y="12.5" font-size="4" fill="#fff" text-anchor="middle" font-family="sans-serif">SCÈNE</text>
         <rect x="8" y="22" width="84" height="74" rx="2" fill="none" stroke="${LINE}" stroke-width="0.6"/>`,
        520,
        640
      ),
    generateSeats(tierIndex, tierCount, rows, seatsPerRow) {
      const areaTop = 24;
      const areaBottom = 94;
      const bandH = (areaBottom - areaTop) / Math.max(tierCount, 1);
      const yStart = areaTop + tierIndex * bandH;
      const rowGap = bandH / Math.max(rows, 1);
      const seats: GeneratedSeat[] = [];
      for (let r = 0; r < rows; r++) {
        const y = yStart + rowGap * (r + 0.5);
        const leftCount = Math.ceil(seatsPerRow / 2);
        const rightCount = seatsPerRow - leftCount;
        const xs = [...spread(9, 47, leftCount), ...spread(53, 91, rightCount)];
        xs.forEach((x, si) => seats.push({ x, y, row: rowLetter(r), number: String(si + 1) }));
      }
      return seats;
    },
  },

  arena: {
    id: "arena",
    labelKey: "organizerForm.seatMapTemplateArenaLabel",
    descriptionKey: "organizerForm.seatMapTemplateArenaDesc",
    icon: Landmark,
    svg: () =>
      svgDataUrl(
        `<rect width="100" height="100" fill="${BG}"/>
         <circle cx="50" cy="50" r="20" fill="${INK}"/>
         <text x="50" y="51.5" font-size="3.3" fill="#fff" text-anchor="middle" font-family="sans-serif">AIRE CENTRALE</text>
         <circle cx="50" cy="50" r="48" fill="none" stroke="${LINE}" stroke-width="0.6"/>`,
        600,
        600
      ),
    generateSeats(tierIndex, tierCount, rows, seatsPerRow) {
      const innerR = 23;
      const outerR = 48;
      const bandR = (outerR - innerR) / Math.max(tierCount, 1);
      const r0 = innerR + tierIndex * bandR;
      const rowGap = bandR / Math.max(rows, 1);
      // Arc de 280° (laisse un vide de 80° en bas, façon tunnel d'entrée).
      const sweepStart = -140;
      const sweepEnd = 140;
      const seats: GeneratedSeat[] = [];
      for (let r = 0; r < rows; r++) {
        const radius = r0 + rowGap * (r + 0.5);
        for (let s = 0; s < seatsPerRow; s++) {
          const t = seatsPerRow <= 1 ? 0.5 : s / (seatsPerRow - 1);
          const angle = ((sweepStart + t * (sweepEnd - sweepStart)) * Math.PI) / 180;
          const x = 50 + radius * Math.sin(angle);
          const y = 50 - radius * Math.cos(angle);
          seats.push({ x, y, row: rowLetter(r), number: String(s + 1) });
        }
      }
      return seats;
    },
  },

  stadium: {
    id: "stadium",
    labelKey: "organizerForm.seatMapTemplateStadiumLabel",
    descriptionKey: "organizerForm.seatMapTemplateStadiumDesc",
    icon: Trophy,
    svg: () =>
      svgDataUrl(
        `<rect width="100" height="100" fill="${BG}"/>
         <rect x="15" y="37" width="70" height="26" rx="1" fill="#166534"/>
         <text x="50" y="52" font-size="4" fill="#fff" text-anchor="middle" font-family="sans-serif">TERRAIN</text>`,
        700,
        460
      ),
    generateSeats(tierIndex, tierCount, rows, seatsPerRow) {
      const isBottom = tierIndex % 2 === 0;
      const groupIndex = Math.floor(tierIndex / 2);
      const groupCount = Math.max(Math.ceil(tierCount / 2), 1);
      let yStart: number;
      let rowGap: number;
      if (isBottom) {
        const areaTop = 65;
        const areaBottom = 96;
        const bandH = (areaBottom - areaTop) / groupCount;
        yStart = areaTop + groupIndex * bandH;
        rowGap = bandH / Math.max(rows, 1);
      } else {
        const areaTop = 4;
        const areaBottom = 35;
        const bandH = (areaBottom - areaTop) / groupCount;
        yStart = areaBottom - (groupIndex + 1) * bandH;
        rowGap = bandH / Math.max(rows, 1);
      }
      const seats: GeneratedSeat[] = [];
      for (let r = 0; r < rows; r++) {
        const y = yStart + rowGap * (r + 0.5);
        const xs = spread(9, 91, seatsPerRow);
        xs.forEach((x, si) => seats.push({ x, y, row: rowLetter(r), number: String(si + 1) }));
      }
      return seats;
    },
  },
};

export const SEAT_MAP_TEMPLATE_LIST = Object.values(SEAT_MAP_TEMPLATES);
