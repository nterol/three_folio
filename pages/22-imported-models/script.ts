import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import scene from "./scene";
import { ambientLight, directionalLight } from "./lights";
import sizes from "./sizes";
import camera from "./camera";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

const handleSuccess = (gltf) => {
  while (gltf.scene.children.length) {
    scene.add(gltf.scene.children[0]);
  }
};

const handleProgress = (e) => {
  console.log(console.log("progress", e));
};
const handleError = (e) => {
  console.log(console.log("GLTF error", e));
};

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/22-imported-models/draco");
// const gltfLoader = new GLTFLoader();
// gltfLoader.load(
//   "/22-imported-models/models/Duck/glTF/Duck.gltf",
//   handleSuccess,
//   handleProgress,
//   handleError
// );

// gltfLoader.load(
//   "/22-imported-models/models/FlightHelmet/glTF/FlightHelmet.gltf",
//   handleSuccess,
//   handleProgress,
//   handleError
// );

// dracoLoader.load(
//   "/22-imported-models/models/Duck/glTF-Draco/Duck.gltf",
//   handleSuccess,
//   handleProgress,
//   handleError
// );

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */

scene.add(ambientLight);
scene.add(directionalLight);

/**
 * Sizes
 */

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
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas as any);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
