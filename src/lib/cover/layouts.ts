import type { CoverPalette } from './palette';
import type { SatoriNode } from './shapes';
import { rangeFloat, rangeInt, rangePick } from './hash';
import {
  gradientOrb, ring, roundedRect, gradientBar,
  dotCluster, concentricRings, cornerAccent, crossShape,
} from './shapes';

type Rng = () => number;

/** Layout A: Large gradient orbs + ring outlines + dot cluster. Spacious and modern. */
function layoutOrbital(rng: Rng, p: CoverPalette): SatoriNode[] {
  const shapes: SatoriNode[] = [];

  // Primary orb — right side
  shapes.push(gradientOrb(
    rangeInt(rng, 750, 1000), rangeInt(rng, 100, 400),
    rangeInt(rng, 400, 600), p.primary, rangeFloat(rng, 0.3, 0.5)
  ));

  // Secondary orb — left side
  shapes.push(gradientOrb(
    rangeInt(rng, 50, 300), rangeInt(rng, 200, 500),
    rangeInt(rng, 250, 400), p.secondary, rangeFloat(rng, 0.15, 0.3)
  ));

  // Ring outlines
  shapes.push(ring(
    rangeInt(rng, 600, 900), rangeInt(rng, 50, 200),
    rangeInt(rng, 150, 280), 2, p.primary, rangeFloat(rng, 0.2, 0.4)
  ));
  shapes.push(ring(
    rangeInt(rng, 100, 400), rangeInt(rng, 50, 180),
    rangeInt(rng, 80, 160), 1.5, p.secondary, rangeFloat(rng, 0.15, 0.3)
  ));

  // Dot cluster in a corner
  const dotCorner = rangePick(rng, ['tl', 'br'] as const);
  shapes.push(dotCluster(
    dotCorner === 'tl' ? rangeInt(rng, 60, 120) : rangeInt(rng, 900, 1020),
    dotCorner === 'tl' ? rangeInt(rng, 60, 120) : rangeInt(rng, 400, 520),
    rangeInt(rng, 3, 5), rangeInt(rng, 3, 4),
    4, 12, p.primary, 0.25
  ));

  return shapes;
}

/** Layout B: Partial dot grid + angled rounded rectangles + gradient bar accent. */
function layoutGeometricGrid(rng: Rng, p: CoverPalette): SatoriNode[] {
  const shapes: SatoriNode[] = [];

  // Dot grid in one quadrant
  const gridSide = rangePick(rng, ['left', 'right'] as const);
  shapes.push(dotCluster(
    gridSide === 'left' ? rangeInt(rng, 60, 140) : rangeInt(rng, 800, 920),
    rangeInt(rng, 80, 200),
    rangeInt(rng, 4, 5), rangeInt(rng, 4, 5),
    5, 16, p.primary, 0.2
  ));

  // Large rounded rectangle
  shapes.push(roundedRect(
    rangeInt(rng, 400, 700), rangeInt(rng, 60, 200),
    rangeInt(rng, 300, 500), rangeInt(rng, 200, 350),
    rangeInt(rng, 20, 40),
    `linear-gradient(${rangeInt(rng, 120, 200)}deg, ${p.primary}20, ${p.secondary}15)`,
    rangeFloat(rng, 0.6, 0.9)
  ));

  // Smaller accent rectangle
  shapes.push(roundedRect(
    rangeInt(rng, 100, 350), rangeInt(rng, 300, 450),
    rangeInt(rng, 150, 250), rangeInt(rng, 100, 180),
    rangeInt(rng, 12, 24),
    `linear-gradient(${rangeInt(rng, 30, 90)}deg, ${p.secondary}18, transparent)`,
    rangeFloat(rng, 0.5, 0.8)
  ));

  // Gradient bar
  shapes.push(gradientBar(
    rangeInt(rng, 80, 200), rangeInt(rng, 280, 380),
    rangeInt(rng, 300, 500), 3,
    `linear-gradient(90deg, ${p.primary}, ${p.secondary})`,
    rangeFloat(rng, 0.3, 0.5)
  ));

  // Subtle glow orb
  shapes.push(gradientOrb(
    rangeInt(rng, 800, 1100), rangeInt(rng, 350, 550),
    rangeInt(rng, 300, 450), p.primary, rangeFloat(rng, 0.12, 0.2)
  ));

  return shapes;
}

/** Layout C: Gradient bars sweeping across + orb + concentric rings. */
function layoutDiagonalFlow(rng: Rng, p: CoverPalette): SatoriNode[] {
  const shapes: SatoriNode[] = [];

  // Sweeping gradient bars
  const barCount = rangeInt(rng, 3, 5);
  for (let i = 0; i < barCount; i++) {
    shapes.push(gradientBar(
      rangeInt(rng, -50, 200) + i * 200,
      rangeInt(rng, 100, 450),
      rangeInt(rng, 200, 400), 2,
      `linear-gradient(90deg, ${p.gradientStops[i % 3]}60, transparent)`,
      rangeFloat(rng, 0.25, 0.45)
    ));
  }

  // Anchoring orb on one side
  const orbSide = rangePick(rng, ['left', 'right'] as const);
  shapes.push(gradientOrb(
    orbSide === 'left' ? rangeInt(rng, -50, 150) : rangeInt(rng, 950, 1150),
    rangeInt(rng, 150, 450),
    rangeInt(rng, 400, 550), p.primary, rangeFloat(rng, 0.25, 0.4)
  ));

  // Concentric rings opposite side
  shapes.push(concentricRings(
    orbSide === 'left' ? rangeInt(rng, 800, 1000) : rangeInt(rng, 100, 300),
    rangeInt(rng, 150, 350),
    rangeInt(rng, 60, 100), rangeInt(rng, 3, 4),
    p.secondary, 0.25
  ));

  return shapes;
}

/** Layout D: Large shapes anchored to corners with overflow:hidden creating cropped forms. */
function layoutCornerBloom(rng: Rng, p: CoverPalette): SatoriNode[] {
  const shapes: SatoriNode[] = [];
  const corners: ('tl' | 'tr' | 'bl' | 'br')[] = ['tl', 'tr', 'bl', 'br'];

  // Pick 2-3 corners
  const count = rangeInt(rng, 2, 3);
  const shuffled = corners.sort(() => rng() - 0.5).slice(0, count);
  const colors = [p.primary, p.secondary, p.gradientStops[1]];

  shuffled.forEach((corner, i) => {
    shapes.push(cornerAccent(
      corner, rangeInt(rng, 350, 550),
      colors[i % colors.length],
      rangeFloat(rng, 0.25, 0.45)
    ));
  });

  // Connecting gradient bar in the center
  shapes.push(gradientBar(
    rangeInt(rng, 300, 450), rangeInt(rng, 290, 340),
    rangeInt(rng, 250, 450), 3,
    `linear-gradient(90deg, ${p.primary}80, ${p.secondary}80)`,
    rangeFloat(rng, 0.3, 0.5)
  ));

  // Small cross accent
  shapes.push(crossShape(
    rangeInt(rng, 500, 700), rangeInt(rng, 200, 400),
    rangeInt(rng, 20, 35), 2, p.primary,
    rangeFloat(rng, 0.2, 0.35)
  ));

  return shapes;
}

/** Layout E: Single dominant glow orb + subtle rings + accent bar. Minimal and dramatic. */
function layoutMinimalGlow(rng: Rng, p: CoverPalette): SatoriNode[] {
  const shapes: SatoriNode[] = [];

  // Dominant center-right orb
  shapes.push(gradientOrb(
    rangeInt(rng, 600, 950), rangeInt(rng, 150, 400),
    rangeInt(rng, 500, 700), p.primary, rangeFloat(rng, 0.3, 0.5)
  ));

  // Subtle secondary orb
  shapes.push(gradientOrb(
    rangeInt(rng, 50, 350), rangeInt(rng, 300, 550),
    rangeInt(rng, 200, 350), p.secondary, rangeFloat(rng, 0.1, 0.2)
  ));

  // Ring overlay
  shapes.push(ring(
    rangeInt(rng, 600, 900), rangeInt(rng, 180, 380),
    rangeInt(rng, 200, 350), 1.5, p.primary, rangeFloat(rng, 0.15, 0.3)
  ));

  // Small ring
  shapes.push(ring(
    rangeInt(rng, 200, 450), rangeInt(rng, 80, 250),
    rangeInt(rng, 60, 120), 1, p.secondary, rangeFloat(rng, 0.12, 0.25)
  ));

  // Accent bar at bottom area
  shapes.push(gradientBar(
    rangeInt(rng, 60, 200), rangeInt(rng, 480, 540),
    rangeInt(rng, 250, 500), 2,
    `linear-gradient(90deg, ${p.primary}, transparent)`,
    rangeFloat(rng, 0.25, 0.4)
  ));

  return shapes;
}

export const ALL_LAYOUTS = [
  layoutOrbital,
  layoutGeometricGrid,
  layoutDiagonalFlow,
  layoutCornerBloom,
  layoutMinimalGlow,
];
