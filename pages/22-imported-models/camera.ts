import { PerspectiveCamera } from "three";
import sizes from "./sizes";

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(2, 2, 2);
export default camera;
