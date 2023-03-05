import { CubeTextureLoader } from "three";

const cubeTextureLoader = new CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/21-physics/textures/environmentMaps/0/px.png",
  "/21-physics/textures/environmentMaps/0/nx.png",
  "/21-physics/textures/environmentMaps/0/py.png",
  "/21-physics/textures/environmentMaps/0/ny.png",
  "/21-physics/textures/environmentMaps/0/pz.png",
  "/21-physics/textures/environmentMaps/0/nz.png",
]);

export default environmentMapTexture;
