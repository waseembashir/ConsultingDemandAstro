import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let fontsLoaded: { name: string; data: ArrayBuffer; weight: number; style: string }[] | null = null;

export function loadFonts() {
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
