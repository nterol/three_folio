import { canvas, sizes } from "@/modules/from-html";
import { WebGLRenderer, sRGBEncoding } from "three";

/**
 * Renderer
 */
export const renderer = new WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = sRGBEncoding;
