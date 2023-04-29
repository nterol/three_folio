import gui from "@/modules/gui";
import scene from "@/modules/scene";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import updateAllMaterials from "./updateMaterials";

/* Models */
export const handleSuccess = (gltf: GLTF) => {
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(0, 0, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("Helmet rotation");

  updateAllMaterials();
};
