export type SolarPoint = { x: number; y: number; radius: number };
export type SolarFrame = {
  points: SolarPoint[];
  width: number;
  height: number;
};

const desktop = [
  [27, 47],
  [42, 20],
  [54, 74],
  [62, 34],
  [77, 62],
  [86, 19],
  [89, 87],
];
const mobile = [
  [32, 16],
  [68, 13],
  [85, 42],
  [34, 38],
  [61, 56],
  [31, 82],
  [78, 78],
];
const radii = [39, 35, 46, 29, 43, 39, 34];

export function sunLayout(width: number, height: number) {
  const small = width < 700;
  const region = small ? height * 0.56 : height;
  return {
    radius: small ? Math.min(170, width * 0.43) : Math.min(300, height * 0.43),
    x: -width * (small ? 0.28 : 0.115),
    y: region * 0.47,
  };
}

function orbit(width: number, height: number, index: number) {
  const small = width < 700;
  const [px, py] = (small ? mobile : desktop)[index];
  const region = small ? height * 0.56 : height;
  const sun = sunLayout(width, height);
  const tilt = [-0.08, 0.12, -0.16, 0.18, -0.12, 0.08, -0.2][index];
  const dx = (width * px) / 100 - sun.x,
    dy = (region * py) / 100 - sun.y;
  const localX = dx * Math.cos(tilt) + dy * Math.sin(tilt);
  const localY = -dx * Math.sin(tilt) + dy * Math.cos(tilt);
  const ry = Math.max(
    Math.abs(localY) + region * 0.12,
    region * (0.24 + index * 0.045),
  );
  const angle = Math.asin(localY / ry);
  return {
    cx: sun.x,
    cy: sun.y,
    rx: localX / Math.cos(angle),
    ry,
    angle,
    tilt,
  };
}

function onOrbit(shape: ReturnType<typeof orbit>, angle: number) {
  const x = Math.cos(angle) * shape.rx,
    y = Math.sin(angle) * shape.ry;
  return {
    x: shape.cx + x * Math.cos(shape.tilt) - y * Math.sin(shape.tilt),
    y: shape.cy + x * Math.sin(shape.tilt) + y * Math.cos(shape.tilt),
  };
}

export function planetLayout(
  width: number,
  height: number,
  time = 0,
  reduced = false,
): SolarPoint[] {
  return radii.map((radius, index) => {
    const shape = orbit(width, height, index);
    // A small, reversible journey along each actual ellipse, never a racing orbit.
    const drift = reduced
      ? 0
      : Math.sin(time / (18000 + index * 2100) + index) * 0.017;
    return {
      ...onOrbit(shape, shape.angle + drift),
      radius: width < 700 ? radius * 0.66 : radius,
    };
  });
}

export function orbitPath(width: number, height: number, index: number) {
  const shape = orbit(width, height, index);
  return Array.from({ length: 121 }, (_, i) => {
    const p = onOrbit(shape, (Math.PI * 2 * i) / 120);
    return `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
}

export function placePlanetNote(
  points: SolarPoint[],
  active: number,
  width: number,
  height: number,
  cardWidth: number,
  cardHeight: number,
) {
  const margin = 16,
    p = points[active],
    gap = p.radius + 43;
  if (width < 700)
    return { x: margin, y: Math.max(margin, height - cardHeight - 18) };
  const clamp = (value: number, low: number, high: number) =>
    Math.max(low, Math.min(value, high));
  const candidates = [
    [p.x + gap, p.y - cardHeight * 0.35],
    [p.x - cardWidth - gap, p.y - cardHeight * 0.35],
    [p.x - cardWidth * 0.5, p.y + gap + 22],
    [p.x - cardWidth * 0.5, p.y - cardHeight - gap],
    [p.x + gap, p.y - cardHeight + 35],
    [p.x - cardWidth - gap, p.y - cardHeight + 35],
  ];
  const ranked = candidates.map(([left, top]) => {
    const x = clamp(left, margin, width - cardWidth - margin);
    const y = clamp(top, margin, height - cardHeight - margin);
    let score =
      Math.hypot(x + cardWidth / 2 - p.x, y + cardHeight / 2 - p.y) * 0.05;
    points.forEach((other, index) => {
      const overlapX = Math.max(
        0,
        Math.min(x + cardWidth, other.x + 85) - Math.max(x, other.x - 85),
      );
      const overlapY = Math.max(
        0,
        Math.min(y + cardHeight, other.y + other.radius + 64) -
          Math.max(y, other.y - other.radius - 10),
      );
      score += overlapX * overlapY * (index === active ? 12 : 2);
    });
    score += Math.max(0, width * 0.14 - x) * cardHeight * 3;
    return { x, y, score };
  });
  ranked.sort((a, b) => a.score - b.score);
  return ranked[0];
}
