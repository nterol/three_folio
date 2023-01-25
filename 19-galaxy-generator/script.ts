import * as T from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { params, withScene } from "./generator";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl") ?? undefined;

// Scene
const scene = new T.Scene();

/**
 * Galaxy
 */

const galaxyGenerator = withScene(scene);

galaxyGenerator();

gui
  .add(params, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(galaxyGenerator);
gui
  .add(params, "size")
  .min(0.001)
  .max(0.1)
  .step(0.01)
  .onFinishChange(galaxyGenerator);

gui
  .add(params, "radius")
  .min(2)
  .max(100)
  .step(1)
  .onFinishChange(galaxyGenerator);

gui
  .add(params, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(galaxyGenerator);

gui
  .add(params, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(galaxyGenerator);

// gui
//   .add(params, "chaos")
//   .min(0)
//   .max(2)
//   .step(0.001)
//   .onFinishChange(galaxyGenerator);

gui
  .add(params, "power")
  .min(1)
  .max(20)
  .step(0.001)
  .onFinishChange(galaxyGenerator);
gui.addColor(params, "inner");
gui.addColor(params, "outer");

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
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new T.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new T.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
