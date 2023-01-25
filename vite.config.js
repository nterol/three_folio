import { resolve } from "path";
import { readdirSync, lstatSync } from "fs";
import { defineConfig } from "vite";

function getPages() {
  const elements = readdirSync(__dirname);
  const pages = elements.filter(
    (e) =>
      e !== "public" &&
      e !== "node_modules" &&
      lstatSync(resolve(__dirname, e)).isDirectory()
  );

  const pageConfig = Object.fromEntries(
    pages.map((page) => [page, resolve(__dirname, `${page}/index.html`)])
  );

  console.log({ pageConfig });
  return pageConfig;
}

export default defineConfig({
  server: { open: true },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...getPages(),
      },
    },
  },
});
