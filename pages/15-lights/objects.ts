import {
  Mesh,
  SphereGeometry,
  BoxGeometry,
  PlaneGeometry,
  TorusGeometry,
} from "three";
import material from "./material";

const sphere = new Mesh(new SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new Mesh(new BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new Mesh(new TorusGeometry(0.3, 0.2, 32, 64), material);
torus.position.x = 1.5;

const plane = new Mesh(new PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

export { sphere, plane, torus, cube };
