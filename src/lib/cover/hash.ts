/** DJB2 hash — returns a 32-bit unsigned integer from a string. */
export function hashSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) + h + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** LCG-based seeded PRNG. Returns a function that yields floats in [0, 1). */
export function createSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/** Random integer in [min, max] inclusive. */
export function rangeInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Random float in [min, max). */
export function rangeFloat(rng: () => number, min: number, max: number): number {
  return rng() * (max - min) + min;
}

/** Pick a random element from an array. */
export function rangePick<T>(rng: () => number, items: T[]): T {
  return items[Math.floor(rng() * items.length)];
}
