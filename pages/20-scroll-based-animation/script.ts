import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  toonMaterial.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl") ?? undefined;

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * Objects
 */
let objectDistance = 4;
const toonMaterial = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  toonMaterial
);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), toonMaterial);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  toonMaterial
);

const sectionMeshes = [mesh1, mesh2, mesh3];

sectionMeshes.forEach((mesh, index) => {
  mesh.position.y = -objectDistance * index;
  mesh.position.x = index % 2 === 0 ? 2 : -2;
});

scene.add(mesh1, mesh2, mesh3);

/**
 * Particles
 */
// Geometry
const count = 200;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 10;
  positions[i3 + 1] =
    objectDistance * 0.5 -
    Math.random() * objectDistance * sectionMeshes.length;
  positions[i3 + 2] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  size: 0.03,
  sizeAttenuation: true,
  depthWrite: false,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
/**
 * Lights
 */

const directionaLight = new THREE.DirectionalLight("#ffffff", 1);
directionaLight.position.set(1, 1, 0);
scene.add(directionaLight);

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
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll values
 */

let { scrollY } = window;
function handleScroll() {
  scrollY = window.scrollY;
}
window.addEventListener("scroll", handleScroll);

/**
 * Cursor
 */

const cursor = new Map([
  ["x", 0],
  ["y", 0],
]);

function handleCursor(event: MouseEvent) {
  cursor.set("x", event.clientX / sizes.width - 0.5);
  cursor.set("y", event.clientY / sizes.height - 0.5);
}

window.addEventListener("mousemove", handleCursor);
let options: IntersectionObserverInit = {
  root: document,
  rootMargin: "0px",
  threshold: 0.5,
};
function intersectionCallback(index) {
  return (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      console.log(sections[index].textContent);
      gsap.to(sectionMeshes[index].rotation, {
        duration: 1.5,
        ease: "power2.inOut",
        x: "+=6",
        y: "+=3",
        z: "+=1.5",
      });
    }
  };
}

const sections = document.querySelectorAll(".section");
sections.forEach((section, index) => {
  let observer = new IntersectionObserver(intersectionCallback(index), options);
  observer.observe(section);
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Animation camera
  camera.position.y = (-scrollY / sizes.height) * objectDistance;
  const parallaxX = cursor.get("x") * 0.1;
  const parallaxY = -cursor.get("y") * 0.1;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  // Mesh animation
  for (let mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
