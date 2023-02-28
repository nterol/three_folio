import * as T from "three";

export const params = {
  count: 100_000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  //   chaos: 0.5,
  power: 3,
  inner: "#ff6030",
  outer: "#1b3984",
};

let galaxyGeometry: T.BufferGeometry | null = null;
let galaxyMaterial: T.PointsMaterial | null = null;
let points: T.Points | null = null;

export function withScene(scene: T.Scene) {
  return function galaxyGenerator() {
    if (points !== null) {
      galaxyGeometry?.dispose();
      galaxyMaterial?.dispose();
      scene.remove(points);
    }

    const { count, size, radius, branches, spin, power, inner, outer } = params;

    galaxyGeometry = new T.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const innerColor = new T.Color(inner);
    const outerColor = new T.Color(outer);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Positions
      const randomRadius = Math.random() * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = randomRadius * spin;

      const randomX =
        Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1);
      positions[i3] =
        Math.cos(branchAngle + spinAngle) * randomRadius + randomX; // x
      positions[i3 + 1] = randomY; // y
      positions[i3 + 2] =
        Math.sin(branchAngle + spinAngle) * randomRadius + randomZ; // z

      // Colors
      const mixed = innerColor.clone();
      mixed.lerp(outerColor, randomRadius / radius);
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    galaxyGeometry.setAttribute(
      "position",
      new T.BufferAttribute(positions, 3)
    );

    galaxyGeometry.setAttribute("color", new T.BufferAttribute(colors, 3));

    galaxyMaterial = new T.PointsMaterial({
      size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      vertexColors: true,
    });

    points = new T.Points(galaxyGeometry, galaxyMaterial);
    scene.add(points);
  };
}
