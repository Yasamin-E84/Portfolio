import * as THREE from "three";

// Muted pencil pigments on warm paper, independent of the brighter UI category chips.
export const pigments = [
  "#a3b4bd",
  "#bea8c4",
  "#abbc91",
  "#d0b47d",
  "#d0a29b",
  "#b3abcb",
  "#96bdb1",
];

function randomGenerator(seed: number) {
  let value = seed * 7919;
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) | 0;
    return (value >>> 0) / 4294967296;
  };
}

/** Baked pigment, paper tooth, and crossed pencil marks; no work per animation frame. */
export function pigmentTexture(color: string, seed: number, solar = false) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const random = randomGenerator(seed);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 256);

  // Uneven, translucent patches imitate a lightly worked colored-pencil surface.
  for (let i = 0; i < 180; i++) {
    const x = random() * 512,
      y = random() * 256;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      12 + random() * 45,
      3 + random() * 12,
      random(),
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = i % 3 ? "rgba(242,227,197,.055)" : "rgba(78,67,51,.045)";
    ctx.fill();
  }

  // Short strokes are deliberately broken and slightly misregistered, not a grid filter.
  for (let pass = 0; pass < 2; pass++) {
    for (let y = -24; y < 280; y += 6) {
      for (let x = -32; x < 544; x += 12) {
        if (random() > (pass ? 0.59 : 0.87)) continue;
        const px = x + random() * 8,
          py = y + random() * 5;
        const length = 10 + random() * 21;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(
          px + length,
          py + length * (pass ? -0.65 : 0.72) + random() * 2,
        );
        ctx.strokeStyle = `rgba(49,43,34,${0.13 + random() * (solar ? 0.17 : 0.23)})`;
        ctx.lineWidth = 0.65 + random() * 0.65;
        ctx.stroke();
      }
    }
  }

  // A few drifting contour marks suggest land, clouds, and pencil construction studies.
  for (let row = 0; row < 12; row++) {
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 3) {
      const y =
        row * 23 +
        Math.sin(x * 0.026 + seed + row) * 7 +
        Math.sin(x * 0.083) * 2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(58,50,38,.14)";
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = i % 3 ? "rgba(250,239,214,.19)" : "rgba(55,45,32,.12)";
    ctx.fillRect(
      random() * 512,
      random() * 256,
      0.5 + random(),
      0.4 + random(),
    );
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  return map;
}

export function pencilShading() {
  const tones = new Uint8Array([65, 125, 195, 245]);
  const map = new THREE.DataTexture(tones, tones.length, 1, THREE.RedFormat);
  map.minFilter = THREE.NearestFilter;
  map.magFilter = THREE.NearestFilter;
  map.generateMipmaps = false;
  map.needsUpdate = true;
  return map;
}

function imperfectCircle(
  radius: number,
  seed: number,
  z = 0,
  start = 0,
  end = Math.PI * 2,
) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 180; i++) {
    const angle = start + ((end - start) * i) / 180;
    const r =
      radius +
      Math.sin(angle * 7 + seed) * 0.006 +
      Math.sin(angle * 19 + seed) * 0.003;
    points.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, z));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

/** Camera-facing contour marks stay legible while the physical sphere turns underneath. */
export function inkContours(seed: number, solar = false) {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: solar ? "#dbc18a" : "#dbd1b9",
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
  });
  group.add(new THREE.Line(imperfectCircle(1.014, seed), material));
  const second = new THREE.Line(
    imperfectCircle(1.047, seed + 4),
    material.clone(),
  );
  second.material.opacity = 0.32;
  second.position.set(0.008, -0.008, 0);
  group.add(second);
  if (!solar) {
    const construction = new THREE.Line(
      imperfectCircle(1.19, seed, -0.03, 0.4 + seed, 4.8 + seed),
      new THREE.LineDashedMaterial({
        color: "#c8c2d2",
        transparent: true,
        opacity: 0.43,
        dashSize: 0.08,
        gapSize: 0.055,
        depthWrite: false,
      }),
    );
    construction.computeLineDistances();
    construction.rotation.z = seed * 0.7;
    group.add(construction);
  } else {
    const random = randomGenerator(seed);
    const rays: THREE.Vector3[] = [];
    for (let i = 0; i < 82; i++) {
      const angle = (i / 82) * Math.PI * 2 + random() * 0.024;
      const inner = 1.07 + random() * 0.04;
      const outer = inner + (i % 3 ? 0.08 : 0.19) + random() * 0.1;
      rays.push(
        new THREE.Vector3(
          Math.cos(angle) * inner,
          Math.sin(angle) * inner,
          -0.03,
        ),
        new THREE.Vector3(
          Math.cos(angle + 0.014) * outer,
          Math.sin(angle + 0.014) * outer,
          -0.03,
        ),
      );
    }
    group.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(rays),
        material.clone(),
      ),
    );
  }
  return group;
}

export function sketchedRings() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: "#d1c0a0",
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
  });
  for (let i = 0; i < 4; i++) {
    group.add(
      new THREE.Line(imperfectCircle(1.37 + i * 0.18, 12 + i), material),
    );
  }
  const marks: THREE.Vector3[] = [];
  for (let i = 0; i < 95; i++) {
    const angle = (i / 95) * Math.PI * 2;
    marks.push(
      new THREE.Vector3(Math.cos(angle) * 1.39, Math.sin(angle) * 1.39, 0),
      new THREE.Vector3(
        Math.cos(angle + 0.06) * 1.91,
        Math.sin(angle + 0.06) * 1.91,
        0,
      ),
    );
  }
  group.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(marks),
      material,
    ),
  );
  group.rotation.x = 1.08;
  group.rotation.z = -0.34;
  return group;
}
