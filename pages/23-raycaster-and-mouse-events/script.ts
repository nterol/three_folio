import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ambientLight, directionalLight } from "../../src/lights";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
let model: THREE.Group | null = null;
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000" });
const sphereMaterial2 = new THREE.MeshBasicMaterial({ color: "#ff0000" });
const sphereMaterial3 = new THREE.MeshBasicMaterial({ color: "#ff0000" });
const object1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
object1.position.x = -2;

const object2 = new THREE.Mesh(sphereGeometry, sphereMaterial2);

const object3 = new THREE.Mesh(sphereGeometry, sphereMaterial3);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Lights
 */

scene.add(ambientLight);
scene.add(directionalLight);

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();

/**
 * Models
 */
const handleSuccess = (gltf: GLTF) => {
  model = gltf.scene;
  scene.add(gltf.scene);
  gltf.scene.position.y = -1.2;
};
const handleProgress = (e) => {
  console.log("PROGRESS", e);
};
const handleError = (error) => {
  console.log("GLTF Error", error);
};

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(
  "/models/Duck/glTF/Duck.gltf",
  handleSuccess,
  handleProgress,
  handleError
);

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
 * Mouse handlers
 */

const mouse = new THREE.Vector2();
let currentIntersect: THREE.Intersection<
  THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
> | null = null;
function handleMouseMove(e: MouseEvent): void {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
}

function handleClick(e: MouseEvent) {
  if (currentIntersect === null) {
    return;
  }
  if (currentIntersect.object === object1) {
    console.log("CLICK ON OBJECT 1");
  }

  if (currentIntersect.object === object2) {
    console.log("CLICK ON OBJECT 2");
  }
  if (currentIntersect.object === object3) {
    console.log("CLICK ON OBJECT 3");
  }
}
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("click", handleClick);

function handleCustomEnter(event) {
  currentIntersect = event.detail.target;
}
function handleCustomLeave() {
  currentIntersect = null;
}
document.addEventListener("object-mouse-enter", handleCustomEnter);
document.addEventListener("object-mouse-leave", handleCustomLeave);

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
camera.position.z = 3;
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

/**
 * Animate
 */
const clock = new THREE.Clock();
const objects = [object1, object2, object3];

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  objects[0].position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  objects[1].position.y = Math.cos(elapsedTime * 0.3) * 1.5;
  objects[2].position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  /**
   * Raycast
   */
  raycaster.setFromCamera(mouse, camera);

  //   const rayOrigin = new Vector3(-3, 0, 0);
  //   const rayDirection = new Vector3(1, 0, 0);
  //   rayDirection.normalize();
  //   raycaster.set(rayOrigin, rayDirection);

  const intersects =
    raycaster.intersectObjects<
      THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
    >(objects);

  if (intersects.length) {
    if (currentIntersect === null) {
      document.dispatchEvent(
        new CustomEvent("object-mouse-enter", {
          detail: { target: intersects[0] },
        })
      );
    }
    // currentIntersect = intersects[0];
  } else {
    if (currentIntersect !== null) {
      document.dispatchEvent(new CustomEvent("object-mouse-leave"));
    }
    // currentIntersect = null;
  }

  for (const object of objects) {
    object.material.color.set("#ff0000");
  }

  intersects[0]?.object.material.color.set("#00ff00");

  // Find the duck
  if (model !== null) {
    const modelIntersect = raycaster.intersectObject(model);
    if (modelIntersect.length) {
      console.log(modelIntersect);
    }
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
