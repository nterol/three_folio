import { CubeTextureLoader } from "three";

const cubeTextureLoader = new CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0_0/px.png",
  "/textures/environmentMaps/0_0/nx.png",
  "/textures/environmentMaps/0_0/py.png",
  "/textures/environmentMaps/0_0/ny.png",
  "/textures/environmentMaps/0_0/pz.png",
  "/textures/environmentMaps/0_0/nz.png",
]);

export default environmentMapTexture;
