/** Satori element node type. */
export type SatoriNode = {
  type: string;
  props: Record<string, any>;
};

/** Large circle with radial gradient. */
export function gradientOrb(
  x: number, y: number, size: number,
  color: string, opacity: number
): SatoriNode {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left: `${x - size / 2}px`,
        top: `${y - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
      },
    },
  };
}

/** Circle with only border — ring outline. */
export function ring(
  x: number, y: number, size: number,
  borderWidth: number, color: string, opacity: number
): SatoriNode {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left: `${x - size / 2}px`,
        top: `${y - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: `${borderWidth}px solid ${color}`,
        opacity,
      },
    },
  };
}

/** Positioned rectangle with gradient fill. */
export function roundedRect(
  x: number, y: number, w: number, h: number,
  radius: number, color: string, opacity: number
): SatoriNode {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${h}px`,
        borderRadius: `${radius}px`,
        background: color,
        opacity,
      },
    },
  };
}

/** Thin line/bar with gradient. */
export function gradientBar(
  x: number, y: number, w: number, h: number,
  colors: string, opacity: number
): SatoriNode {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${h}px`,
        background: colors,
        opacity,
        borderRadius: `${h / 2}px`,
      },
    },
  };
}

/** Grid of small dots. */
export function dotCluster(
  x: number, y: number,
  cols: number, rows: number,
  dotSize: number, gap: number,
  color: string, opacity: number
): SatoriNode {
  const dots: SatoriNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({
        type: 'div',
        props: {
          style: {
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: '50%',
            background: color,
          },
        },
      });
    }
  }
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        display: 'flex',
        flexWrap: 'wrap',
        width: `${cols * (dotSize + gap)}px`,
        gap: `${gap}px`,
        opacity,
      },
      children: dots,
    },
  };
}

/** Nested concentric rings. */
export function concentricRings(
  x: number, y: number,
  baseSize: number, count: number,
  color: string, opacity: number
): SatoriNode {
  const rings: SatoriNode[] = [];
  for (let i = 0; i < count; i++) {
    const s = baseSize + i * 60;
    rings.push(ring(0, 0, s, 1.5, color, opacity - i * 0.08));
  }
  // Wrap in a container positioned at (x, y)
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '1px',
        height: '1px',
        display: 'flex',
      },
      children: rings,
    },
  };
}

/** Large shape anchored to a corner, clipped by container overflow:hidden. */
export function cornerAccent(
  corner: 'tl' | 'tr' | 'bl' | 'br',
  size: number, color: string, opacity: number
): SatoriNode {
  const pos: Record<string, string> = {};
  if (corner.includes('t')) pos.top = `${-size * 0.4}px`;
  if (corner.includes('b')) pos.bottom = `${-size * 0.4}px`;
  if (corner.includes('l')) pos.left = `${-size * 0.4}px`;
  if (corner.includes('r')) pos.right = `${-size * 0.4}px`;

  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        ...pos,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
      },
    },
  };
}

/** Decorative cross / plus shape. */
export function crossShape(
  x: number, y: number, size: number,
  thickness: number, color: string, opacity: number
): SatoriNode {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        overflow: 'hidden',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              width: `${size}px`,
              height: `${thickness}px`,
              background: color,
              borderRadius: `${thickness / 2}px`,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              width: `${thickness}px`,
              height: `${size}px`,
              background: color,
              borderRadius: `${thickness / 2}px`,
            },
          },
        },
      ],
    },
  };
}
