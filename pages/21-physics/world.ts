import * as C from "cannon";

/** World */
const world = new C.World();
world.gravity.set(0, -9.82, 0);
world.allowSleep = true;
world.broadphase = new C.SAPBroadphase(world);

/** Materials */
const defaultMaterial = new C.Material("default");
const defaultContactMaterial = new C.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

/** Floor */
const floorShape = new C.Plane();
export const floorBody = new C.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new C.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

export default world;
