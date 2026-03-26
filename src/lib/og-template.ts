import satori from 'satori';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let fontsLoaded: { name: string; data: ArrayBuffer; weight: number; style: string }[] | null = null;

function loadFonts() {
  if (fontsLoaded) return fontsLoaded;
  const fontsDir = join(process.cwd(), 'public', 'fonts');
  fontsLoaded = [
    {
      name: 'Playfair Display',
      data: readFileSync(join(fontsDir, 'PlayfairDisplay-Bold.ttf')),
      weight: 700,
      style: 'normal',
    },
    {
      name: 'Instrument Sans',
      data: readFileSync(join(fontsDir, 'InstrumentSans-SemiBold.ttf')),
      weight: 600,
      style: 'normal',
    },
  ];
  return fontsLoaded;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Marketing Consulting': '#ff971a',
  'Strategy': '#ce1483',
  'Tech Consulting': '#48e5c2',
  'Technology': '#48e5c2',
  'Operations': '#48e5c2',
  'Ops Consulting': '#48e5c2',
  'Hiring Guides': '#ff971a',
  'Management': '#ce1483',
};

export async function generateOgSvg(title: string, category: string): Promise<string> {
  const fonts = loadFonts();
  const accent = CATEGORY_COLORS[category] || '#ff971a';
  const fontSize = title.length > 70 ? 44 : title.length > 50 ? 52 : title.length > 35 ? 58 : 64;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px 90px',
          backgroundColor: '#000000',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Decorative orb top-right
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-120px',
                right: '-80px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${accent}35 0%, transparent 70%)`,
              },
            },
          },
          // Decorative orb bottom-left
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '-100px',
                left: '-60px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #48e5c220 0%, transparent 70%)',
              },
            },
          },
          // Bottom gradient bar
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '6px',
                background: 'linear-gradient(90deg, #ff971a, #48e5c2, #ce1483)',
              },
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: '1',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'Playfair Display',
                      fontSize: `${fontSize}px`,
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.15,
                      letterSpacing: '-0.03em',
                      maxWidth: '900px',
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          // Footer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontFamily: 'Instrument Sans',
                      fontSize: '18px',
                      fontWeight: 600,
                      color: accent,
                      letterSpacing: '0.06em',
                    },
                    children: 'consultingdemand.com',
                  },
                },
              ],
            },
          },
        ],
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
