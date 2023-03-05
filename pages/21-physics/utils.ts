import { Body, Box, Sphere, Vec3 } from "cannon";
import { BoxGeometry, Mesh, MeshStandardMaterial, SphereGeometry } from "three";
import environmentMapTexture from "./textures";
import scene from "./scene";
import world from "./world";

export const objectManager = [];

const geometry = new SphereGeometry(1, 20, 20);
const material = new MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

export function createSphere(radius: number, position: any) {
  const mesh = new Mesh(geometry, material);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  const shape = new Sphere(radius);
  const body = new Body({
    shape,
    mass: 1,
    position: new Vec3(0, 3, 0),
  });

  body.position.copy(position);
  objectManager.push({
    mesh,
    body,
    type: "sphere",
  });
  world.addBody(body);
}

const boxGeometry = new BoxGeometry(1, 1, 1);

export function createBox(
  width: number,
  height: number,
  depth: number,
  position
) {
  console.log("BOX");
  const mesh = new Mesh(boxGeometry, material);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  const shape = new Box(new Vec3(width * 0.5, height * 0.5, depth * 0.5));
  const body = new Body({
    shape,
    mass: 1,
    position: new Vec3(0, 3, 0),
  });

  body.position.copy(position);
  world.addBody(body);
  objectManager.push({ mesh, body, type: "box" });
}
