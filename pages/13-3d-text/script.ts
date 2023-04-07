import "./style.css";

import * as T from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { canvas, sizes } from "@/modules/from-html";

// preloadFont(
//   {
//     font: "/fonts/FiraCode-Regular.ttf",
//     characters: "()=>cestNico",
//     options: { chracters: ["=", ">", "=>"] },
//   },
//   (event) => console.log("Font preloaded", event)
// );

/**
 * Base
 */

// Scene
const scene = new T.Scene();

/**
 * Textures
 */
const textureLoader = new T.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/6.png");
// const matcapTextureBis = textureLoader.load("/textures/matcaps/8.png");

/**
 * FONTS
 */

/* With ligatures (not working) */
// const text = new Text();

// scene.add(text);

// text.font = "/fonts/FiraCode-Regular.ttf";
// text.text = "() => Salut c'est Nico";
// text.fontSize = 0.5;
// text.position.x = 0.5;
// text.sync();
/* */

const fontLoader = new FontLoader();
const bevelThickness = 0.03;
const bevelSize = 0.02;

const mainMaterial = new T.MeshMatcapMaterial({ matcap: matcapTexture });
fontLoader.load("/fonts/Fira Code_Regular.json", (font) => {
  const textGeometry = new TextGeometry("Hihi c'est rigolo", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness,
    bevelSize,
    bevelOffset: 0,
    bevelSegments: 6,
  });

  textGeometry.center();
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - bevelSize) * 0.5,
  //   -(textGeometry.boundingBox.max.y - bevelSize) * 0.5,
  //   -(textGeometry.boundingBox.max.z - bevelThickness) * 0.5
  // );

  //textMaterial.wireframe = true;
  const text = new T.Mesh(textGeometry, mainMaterial);

  scene.add(text);

  console.time("donuts");

  const donutGeom = new T.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < 500; i++) {
    const donut = new T.Mesh(donutGeom, mainMaterial);
    const factor = 24;
    donut.position.x = (Math.random() - 0.5) * factor;
    donut.position.y = (Math.random() - 0.5) * factor;
    donut.position.z = (Math.random() - 0.5) * factor;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.z = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
  console.timeEnd("donuts");
});

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement | undefined);
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
