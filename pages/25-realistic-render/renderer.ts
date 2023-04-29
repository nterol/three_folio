import { canvas, sizes } from "@/modules/from-html";
import gui from "@/modules/gui";
import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  LinearToneMapping,
  NoToneMapping,
  PCFSoftShadowMap,
  ReinhardToneMapping,
  WebGLRenderer,
  sRGBEncoding,
} from "three";

/**
 * Renderer
 */
export const renderer = new WebGLRenderer({
  canvas,
  // antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = sRGBEncoding;
renderer.toneMapping = ReinhardToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

gui.add(renderer, "toneMapping", {
  No: NoToneMapping,
  Linear: LinearToneMapping,
  Reinhard: ReinhardToneMapping,
  Cineon: CineonToneMapping,
  ACESFilmic: ACESFilmicToneMapping,
});
