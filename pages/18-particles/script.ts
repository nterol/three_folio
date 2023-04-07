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
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new T.Scene();

/**
 * Textures
 */
const textureLoader = new T.TextureLoader();
const particlesTexture = textureLoader.load(
  "/textures/particles/1.png"
);

/**
 * Particules
 */

const particlesGeometry = new T.BufferGeometry();
const count = 20000;
const positions = new Float32Array(3 * count);
const colors = new Float32Array(3 * count);

for (let index = 0; index < count; index++) {
  positions[index] = (Math.random() - 0.5) * 10;
  colors[index] = Math.random();
}

particlesGeometry.setAttribute("position", new T.BufferAttribute(positions, 3));
particlesGeometry.setAttribute("color", new T.BufferAttribute(colors, 3));

const particlesMaterial = new T.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,

  alphaMap: particlesTexture,
  //alphaTest: 0.001, // this kinda prevents the black background from being painted
  // depthTest: false, // this one will draw particules no matter what's in front
  depthWrite: false, // this is the right one
  blending: T.AdditiveBlending,
  transparent: true,
});

particlesMaterial.vertexColors = true;

const particles = new T.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

// const testCube = new T.Mesh(new T.BoxGeometry(), new T.MeshBasicMaterial());

// scene.add(testCube);

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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new T.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new T.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particles
  // ⚠️ Don't do this, use shaders
  for (let index = 0; index < count; index++) {
    const i3 = index * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime * 0.5 + x
    );
    particlesGeometry.attributes.position.needsUpdate = true;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
