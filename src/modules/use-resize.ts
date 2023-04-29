import { type PerspectiveCamera, type WebGLRenderer } from "three";
import { sizes } from "./from-html";

type UseResizeArgs = {
    renderer:  WebGLRenderer;
    camera: PerspectiveCamera
}

export default function useResize({ renderer, camera }: UseResizeArgs) {
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
