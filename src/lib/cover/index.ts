import satori from 'satori';
import { loadFonts } from '../fonts';
import { hashSlug, createSeededRandom, rangePick } from './hash';
import { getCoverPalette } from './palette';
import { ALL_LAYOUTS } from './layouts';
import type { SatoriNode } from './shapes';

export async function generateCoverSvg(slug: string, category: string): Promise<string> {
  const fonts = loadFonts();
  const seed = hashSlug(slug);
  const rng = createSeededRandom(seed);
  const palette = getCoverPalette(category);

  // Pick a layout based on the slug hash
  const layoutFn = rangePick(rng, ALL_LAYOUTS);
  const shapes = layoutFn(rng, palette);

  const children: SatoriNode[] = [
    // All generated shapes
    ...shapes,
    // Bottom gradient bar — brand constant
    {
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '5px',
          background: 'linear-gradient(90deg, #ff971a, #48e5c2, #ce1483)',
          opacity: 0.7,
        },
      },
    },
    // Small watermark — bottom right
    {
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          bottom: '20px',
          right: '32px',
          fontFamily: 'Instrument Sans',
          fontSize: '14px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.04em',
        },
        children: 'consultingdemand.com',
      },
    },
  ];

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#000000',
          position: 'relative',
          overflow: 'hidden',
        },
        children,
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: fonts as any,
    }
  );

  return svg;
}
