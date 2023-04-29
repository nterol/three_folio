import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import scene from "@/modules/scene";
import { sun } from "./lights";
import { canvas, sizes } from "@/modules/from-html";
import { renderer } from "./renderer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { handleSuccess } from "./model-loader";
import environmentMapTexture from "./environentMap-loader";
import gui from "@/modules/gui";
import { debugObject } from "./debug-object";
import updateAllMaterials from "./updateMaterials";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/**
 * Base
 */

/**
 * Loaders
 */

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("/models/Hamburger/hamburger.glb", handleSuccess);

scene.background = environmentMapTexture;
scene.environment = environmentMapTexture;

gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

scene.add(sun);

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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas as any);
controls.enableDamping = true;

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
