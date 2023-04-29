import gui from "@/modules/gui";

import { DirectionalLight, Vector2 } from "three";

export const sun = new DirectionalLight("#ffffff", 3);
sun.position.set(0.25, 3, -2.25);
sun.shadow.normalBias = 0.05;
sun.castShadow = true;
sun.shadow.camera.far = 15;
sun.shadow.mapSize.set(1024, 1024);

// export const directionalLightCameraHelper = new CameraHelper(sun.shadow.camera);

gui.add(sun, "intensity").min(0).max(10).step(0.001).name("light intensity");
gui.add(sun.position, "x").min(-5).max(5).step(0.001).name("light x");
gui.add(sun.position, "y").min(-5).max(5).step(0.001).name("light y");
gui.add(sun.position, "z").min(-5).max(5).step(0.001).name("light z");
