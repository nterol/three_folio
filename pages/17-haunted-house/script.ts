import "./style.css";
import * as T from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl") ?? undefined;

// Scene
const scene = new T.Scene();

// Fog
const fog = new T.Fog("#262837", 1, 15);
scene.fog = fog;
/**
 * Textures
 */
const textureLoader = new T.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

const bushColorTexture = textureLoader.load("/textures/grass/color.jpg");
const bushAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const bushNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const bushRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassColorTexture.wrapS = T.RepeatWrapping;
grassColorTexture.wrapT = T.RepeatWrapping;
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.wrapS = T.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = T.RepeatWrapping;
grassNormalTexture.repeat.set(8, 8);
grassNormalTexture.wrapS = T.RepeatWrapping;
grassNormalTexture.wrapT = T.RepeatWrapping;
grassRoughnessTexture.repeat.set(8, 8);
grassRoughnessTexture.wrapS = T.RepeatWrapping;
grassRoughnessTexture.wrapT = T.RepeatWrapping;

/**
 * House
 */
// Group
const house = new T.Group();
scene.add(house);

// Walls
const wallsHeight = 2.5;
const walls = new T.Mesh(
  new T.BoxGeometry(4, wallsHeight, 4),
  new T.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new T.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = wallsHeight / 2;
house.add(walls);

// Roof
const roofHeight = 1;
const roof = new T.Mesh(
  new T.ConeGeometry(3.5, roofHeight, 4),
  new T.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = wallsHeight + roofHeight / 2;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const doorHeight = 2.2;
const door = new T.Mesh(
  new T.PlaneGeometry(doorHeight, doorHeight, 100, 100),
  new T.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new T.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new T.SphereGeometry(1, 16, 16);
const bushMaterial = new T.MeshStandardMaterial({
  map: bushColorTexture,
  aoMap: bushAmbientOcclusionTexture,
  normalMap: bushNormalTexture,
  roughnessMap: bushRoughnessTexture,
});

const positions = [
  [0.8, 0.2, 2.2],
  [1.4, 0.1, 2.1],
  [-0.8, 0.2, 2.2],
  [-1, 0.05, 2.6],
];
const scales = [
  [0.5, 0.5, 0.5],
  [0.25, 0.25, 0.25],
  [0.33, 0.33, 0.33],
  [0.15, 0.15, 0.15],
];
const bushes = Array.from({ length: 4 }, (_, i) => {
  const bush = new T.Mesh(bushGeometry, bushMaterial);
  const [x, y, z] = scales[i];
  const [px, py, pz] = positions[i];
  bush.scale.set(x, y, z);
  bush.position.set(px, py, pz);
  bush.castShadow = true;
  bush.geometry.setAttribute(
    "uv2",
    new T.Float32BufferAttribute(bush.geometry.attributes.uv.array, 2)
  );

  return bush;
});
house.add(...bushes);

// Grave group
const gravesGroup = new T.Group();
scene.add(gravesGroup);

const graveGeometry = new T.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new T.MeshStandardMaterial({ color: "#696969fb" });

const graves = Array.from({ length: 50 }, (_, i) => {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new T.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.z = (Math.random() - 0.5) * 0.5;
  grave.rotation.y = (Math.random() - 0.5) * 0.5;
  grave.castShadow = true;
  return grave;
});

gravesGroup.add(...graves);

// Floor
const floor = new T.Mesh(
  new T.PlaneGeometry(20, 20, 100, 100),
  new T.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new T.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new T.AmbientLight("#b9d5ff", 0.1);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new T.DirectionalLight("#ffffff", 0.5);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door Light
const doorLight = new T.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Ghosts
 */

const ghostColors = ["#ff00ff", "#00ffff", "#00ff00"];
const ghostShapeGeometry = new T.IcosahedronGeometry(1, 15);
const ghosts = ghostColors.map((ghostColor) => {
  // check this to make glowy balls
  // https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom_selective.html
  const ghost = new T.Group();
  const ghostShape = new T.Mesh(
    ghostShapeGeometry,
    new T.MeshStandardMaterial({ color: ghostColor })
  );
  ghostShape.scale.set(0.25, 0.25, 0.25);
  const ghostLight = new T.PointLight(ghostColor, 2, 3);
  ghost.castShadow = true;

  ghostLight.shadow.mapSize.width = 256;
  ghostLight.shadow.mapSize.height = 256;
  ghostLight.shadow.camera.far = 7;
  ghost.add(ghostShape);
  ghost.add(ghostLight);
  return ghost;
});

scene.add(...ghosts);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new T.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement | undefined);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new T.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");
/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
moonLight.castShadow = true;
doorLight.castShadow = true;

walls.castShadow = true;
floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

/**
 * Animate
 */
const clock = new T.Clock();
const [ghost1, ghost2, ghost3] = ghosts;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.25;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.16;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(-elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // ghosts.forEach((ghost, index) => {
  //   const ghostAngle = elapsedTime * ghostDelay[index];
  //   ghost.position.set(
  //     Math.cos(ghostAngle) * 4 * index,
  //     Math.sin(elapsedTime) * 4 * index,
  //     Math.sin(ghostAngle) * 4 * index
  //   );
  // });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
