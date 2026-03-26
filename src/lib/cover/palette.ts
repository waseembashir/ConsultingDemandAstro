export interface CoverPalette {
  primary: string;
  secondary: string;
  glow: string;
  bg: string;
  gradientStops: [string, string, string];
}

const palettes: Record<string, CoverPalette> = {
  orange: {
    primary: '#ff971a',
    secondary: '#ce1483',
    glow: 'rgba(255,151,26,0.25)',
    bg: '#000000',
    gradientStops: ['#ff971a', '#ffb347', '#ce1483'],
  },
  magenta: {
    primary: '#ce1483',
    secondary: '#ff971a',
    glow: 'rgba(206,20,131,0.25)',
    bg: '#000000',
    gradientStops: ['#ce1483', '#e84aac', '#ff971a'],
  },
  mint: {
    primary: '#48e5c2',
    secondary: '#ce1483',
    glow: 'rgba(72,229,194,0.25)',
    bg: '#000000',
    gradientStops: ['#48e5c2', '#36c4a5', '#ce1483'],
  },
};

const CATEGORY_MAP: Record<string, string> = {
  'Marketing Consulting': 'orange',
  'Hiring Guides': 'orange',
  'Strategy': 'magenta',
  'Management': 'magenta',
  'Tech Consulting': 'mint',
  'Technology': 'mint',
  'Operations': 'mint',
  'Ops Consulting': 'mint',
};

export function getCoverPalette(category: string): CoverPalette {
  const key = CATEGORY_MAP[category] || 'orange';
  return palettes[key];
}
