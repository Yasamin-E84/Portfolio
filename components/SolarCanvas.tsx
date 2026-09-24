"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { planets } from "@/lib/content";
import { planetLayout, sunLayout, type SolarFrame } from "./solar-layout";
import {
  pigments,
  pigmentTexture,
  pencilShading,
  inkContours,
  sketchedRings,
} from "./planet-ink";

export default function SolarCanvas({
  active,
  reduced,
  onReady,
  onFailure,
  onFrame,
}: {
  active: number;
  reduced: boolean;
  onReady: () => void;
  onFailure: () => void;
  onFrame: (frame: SolarFrame) => void;
}) {
  const host = useRef<HTMLDivElement>(null),
    selected = useRef(active);
  useEffect(() => {
    selected.current = active;
  }, [active]);
  useEffect(() => {
    if (!host.current) return;
    const target = host.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      onFailure();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    target.appendChild(renderer.domElement);
    const scene = new THREE.Scene(),
      camera = new THREE.OrthographicCamera(-500, 500, 250, -250, 0.1, 2000);
    camera.position.z = 900;
    // Region: physical spheres with baked pigment and hand-drawn construction lines.
    scene.add(new THREE.AmbientLight("#fff6e4", 0.48));
    const light = new THREE.DirectionalLight("#fff8ed", 1.65);
    light.position.set(-500, 300, 380);
    scene.add(light);
    const geometry = new THREE.SphereGeometry(1, 40, 28);
    const vertices = geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i),
        y = vertices.getY(i),
        z = vertices.getZ(i);
      const irregularity =
        1 + Math.sin(x * 13 + y * 7) * Math.cos(z * 11) * 0.006;
      vertices.setXYZ(i, x * irregularity, y * irregularity, z * irregularity);
    }
    geometry.computeVertexNormals();
    const gradientMap = pencilShading();
    const surfaces: THREE.Mesh<THREE.SphereGeometry, THREE.MeshToonMaterial>[] =
      [];
    const meshes = planets.map((_, i) => {
      const body = new THREE.Group();
      const surface = new THREE.Mesh(
        geometry,
        new THREE.MeshToonMaterial({
          map: pigmentTexture(pigments[i], i + 1),
          gradientMap,
        }),
      );
      surfaces.push(surface);
      body.add(surface, inkContours(i + 1));
      scene.add(body);
      return body;
    });
    surfaces[5].add(sketchedRings());
    const sun = new THREE.Group();
    const sunSurface = new THREE.Mesh(
      geometry,
      new THREE.MeshToonMaterial({
        map: pigmentTexture("#bc944f", 31, true),
        gradientMap,
      }),
    );
    sun.add(sunSurface, inkContours(31, true));
    scene.add(sun);
    const start = performance.now();
    let w = 1000,
      h = 490,
      frame = 0,
      visible = true,
      last = 0,
      completed = false;
    const returned = (() => {
      try {
        return sessionStorage.getItem("ys-intro") === "1";
      } catch {
        return false;
      }
    })();
    function resize() {
      w = target.clientWidth;
      h = target.clientHeight;
      renderer.setSize(w, h);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(target);
    resize();
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "100px" },
    );
    intersection.observe(target);
    function draw(time: number) {
      frame = requestAnimationFrame(draw);
      if (!visible || document.hidden || time - last < (reduced ? 150 : 32))
        return;
      last = time;
      const points = planetLayout(w, h, time - start, reduced);
      const progress =
        reduced || returned ? 1 : Math.min(1, (time - start) / 1450);
      const ease = progress * progress * (3 - 2 * progress);
      const solar = sunLayout(w, h);
      sun.position.set(
        THREE.MathUtils.lerp(0, solar.x - w / 2, ease),
        THREE.MathUtils.lerp(0, h / 2 - solar.y, ease),
        70,
      );
      sun.scale.setScalar(solar.radius);
      if (!reduced) sunSurface.rotation.y = time * 0.00007;
      meshes.forEach((mesh, i) => {
        const point = points[i];
        // The whole system begins physically behind the centered sun and opens together.
        // Tiny initial offsets keep the planets distinct without revealing them early.
        mesh.position.set(
          THREE.MathUtils.lerp((i - 3) * 8, point.x - w / 2, ease),
          THREE.MathUtils.lerp(Math.sin(i) * 10, h / 2 - point.y, ease),
          0,
        );
        const destinationScale =
          point.radius * (selected.current === i ? 1.1 : 1);
        mesh.scale.setScalar(
          reduced || progress < 1
            ? destinationScale
            : mesh.scale.x + (destinationScale - mesh.scale.x) * 0.15,
        );
        if (!reduced) surfaces[i].rotation.y = time * (0.00008 + i * 0.000008);
      });
      onFrame({ points, width: w, height: h });
      renderer.render(scene, camera);
      if (progress === 1 && !completed) {
        completed = true;
        try {
          sessionStorage.setItem("ys-intro", "1");
        } catch {}
        onReady();
      }
    }
    frame = requestAnimationFrame(draw);
    function lost(event: Event) {
      event.preventDefault();
      onFailure();
    }
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      // Materials and geometry are shared by pencil strokes; dispose each once.
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          geometries.add(object.geometry);
          const collection = Array.isArray(object.material)
            ? object.material
            : [object.material];
          collection.forEach((material: THREE.Material) =>
            materials.add(material),
          );
        }
      });
      geometries.forEach((item) => item.dispose());
      materials.forEach((material) => {
        if (material instanceof THREE.MeshToonMaterial) material.map?.dispose();
        material.dispose();
      });
      gradientMap.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reduced, onReady, onFailure, onFrame]);
  return <div ref={host} className="solar-canvas" aria-hidden="true" />;
}
