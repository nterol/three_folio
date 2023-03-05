import * as C from "cannon";

/** World */
const world = new C.World();
world.gravity.set(0, -9.82, 0);

/** Materials */
const concreteMaterial = new C.Material("concrete");
const plasticMaterial = new C.Material("plastic");

const concreteToPlasticContactMaterial = new C.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

world.addContactMaterial(concreteToPlasticContactMaterial);

/** Sphere */
const sphereShape = new C.Sphere(0.5);
export const sphereBody = new C.Body({
  mass: 1,
  position: new C.Vec3(0, 3, 0),
  shape: sphereShape,
  material: plasticMaterial,
});

/** Floor */
const floorShape = new C.Plane();
export const floorBody = new C.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new C.Vec3(-1, 0, 0), Math.PI * 0.5);
floorBody.material = concreteMaterial;

world.addBody(floorBody);
world.addBody(sphereBody);

export default world;
