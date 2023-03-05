import { Body, Box, Sphere, Vec3 } from "cannon-es";
import { BoxGeometry, Mesh, MeshStandardMaterial, SphereGeometry } from "three";
import environmentMapTexture from "./textures";
import scene from "./scene";
import world from "./world";

export const objectManager: Array<{
  mesh: Mesh<SphereGeometry | BoxGeometry, MeshStandardMaterial>;
  body: Body;
  type: "box" | "sphere";
}> = [];

const hitSound = new Audio("/21-physics/sounds/hit.mp3");
export function playHitSound(collision) {
  const impactStrengh = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrengh <= 1.5) return;
  //   hitSound.volume = impactStrengh * 0.1;
  hitSound.currentTime = 0;
  hitSound.play();
}

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
  body.addEventListener("collide", playHitSound);
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

  body.addEventListener("collide", playHitSound);
  world.addBody(body);
  objectManager.push({ mesh, body, type: "box" });
}
