import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import scene from "@/modules/scene";
import { canvas } from "@/modules/from-html";
import { sizes } from "@/modules/from-html";
import useResize from "@/modules/use-resize";
import vertexShader from "./vertex-shader.glsl";
import fragmentShader from "./fragment-shader.glsl";
import gui from "@/modules/gui";

// Geometry

const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
// const { count } = geometry.attributes.position;

// const randomCount = Float32Array.from({ length: count }, () => Math.random());

// geometry.setAttribute("aRandom", new THREE.BufferAttribute(randomCount, 1));

const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/textures/french-flag.jpg");
// Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,

  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("salmon") },
    uTexture: { value: flagTexture },
  },
});

gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(1)
  .max(20)
  .step(0.01)
  .name("frequency x");
gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(1)
  .max(20)
  .step(0.01)
  .name("frequency y");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

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
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas as any);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

useResize({ renderer, camera });
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
