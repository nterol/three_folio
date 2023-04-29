import scene from "@/modules/scene";
import { Mesh, MeshStandardMaterial } from "three";
// import environmentMapTexture from "./environentMap-loader";
import { debugObject } from "./debug-object";

export default function updateAllMaterials() {
  scene.traverse((child) => {
    if (
      child instanceof Mesh &&
      child.material instanceof MeshStandardMaterial
    ) {
      child.material.envMapIntensity = debugObject.envMapIntensity as number;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}
