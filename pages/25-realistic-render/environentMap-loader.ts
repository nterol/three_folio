import { CubeTextureLoader, sRGBEncoding } from "three";
import { debugObject } from "./debug-object";
import gui from "@/modules/gui";
import updateAllMaterials from "./updateMaterials";

export const cubeTextureLoader = new CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/1_0/px.jpg",
  "/textures/environmentMaps/1_0/nx.jpg",
  "/textures/environmentMaps/1_0/py.jpg",
  "/textures/environmentMaps/1_0/ny.jpg",
  "/textures/environmentMaps/1_0/pz.jpg",
  "/textures/environmentMaps/1_0/nz.jpg",
]);
environmentMapTexture.encoding = sRGBEncoding;

export default environmentMapTexture;
