import scene from "@/modules/scene";
import { Mesh, MeshStandardMaterial } from "three";
import environmentMapTexture from "./environentMap-loader";
import { debugObject } from "./debug-object";

function updateAllMaterials() {
  scene.traverse((child) => {
    if (
      child instanceof Mesh &&
      child.material instanceof MeshStandardMaterial
    ) {
      child.material.envMapIntensity = debugObject.envMapIntensity as number;
    }
  });
}

export default updateAllMaterials;
