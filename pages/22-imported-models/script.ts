import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import scene from "./scene";
import { ambientLight, directionalLight } from "../../src/lights";
import sizes from "./sizes";
import camera from "./camera";
import { AnimationAction, AnimationMixer } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");
let mixer: AnimationMixer | undefined = undefined;
const actions: AnimationAction[] = [];
let currentAction = 0;

const animationButtons = document.querySelectorAll("#animation-button");
const handleSuccess = (gltf: GLTF) => {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  mixer = new AnimationMixer(gltf.scene);

  for (const animation of gltf.animations) {
    actions.push(mixer.clipAction(animation));
  }

  animationButtons[currentAction].setAttribute("data-active", "true");
  actions[currentAction].play();
  // animationButtons[0].setAttribute("disabled", "true");
  // while (gltf.scene.children.length) {
  //     gltf.scene.children.
  //   }

  // scaling does not work with this solution
};

animationButtons.forEach((button, i) => {
  button.addEventListener("click", () => {
    animationButtons[currentAction].setAttribute("data-active", "false");
    if (actions.length) {
      actions[currentAction].stop();
      if (currentAction === i) return;

      currentAction = i;
      actions[i].play();
      animationButtons[currentAction].setAttribute("data-active", "true");
    }
  });
});

const handleProgress = (e) => {
  console.log(console.log("progress", e));
};
const handleError = (e) => {
  console.log(console.log("GLTF error", e));
};

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
  "/models/Fox/glTF/Fox.gltf",
  handleSuccess,
  handleProgress,
  handleError
);

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

  // Action mixer
  if (mixer) mixer.update(deltaTime);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
