import {
  AmbientLight,
  PointLight,
  DirectionalLight,
  HemisphereLight,
  RectAreaLight,
  Vector3,
} from "three";

const ambientLight = new AmbientLight(0xffffff, 0.5);

const pointLight = new PointLight(0xff9000, 0.5, 3);
pointLight.position.set(1, -0.5, 1);

const directionalLight = new DirectionalLight(0xffe364, 0.5);
directionalLight.position.set(1, 0.25, 0);

const hemisphere = new HemisphereLight(0xff0000, 0x0000ff, 0.3);

const rectAreaLight = new RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new Vector3());

export default function addLights(scene, gui) {
  scene.add(ambientLight);
  gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);

  scene.add(directionalLight);

  scene.add(hemisphere);
  scene.add(pointLight);

  scene.add(rectAreaLight);
}
