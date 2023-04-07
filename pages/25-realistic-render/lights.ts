import gui from "@/modules/gui";
import { DirectionalLight } from "three";

export const sun = new DirectionalLight("#ffffff", 3);
sun.position.set(0.25, 3, -2.25);

gui.add(sun, "intensity").min(0).max(10).step(0.001).name("light intensity");
gui.add(sun.position, "x").min(-5).max(5).step(0.001).name("light x");
gui.add(sun.position, "y").min(-5).max(5).step(0.001).name("light y");
gui.add(sun.position, "z").min(-5).max(5).step(0.001).name("light z");
