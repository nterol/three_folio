import { writeFileSync } from "fs";
import { resolve } from "path";

import { defineConfig } from "vite";
import getPages from "./get-pages";

const pages = getPages();

const content = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <section class="link-list">
      <div class="container">
    ${Object.keys(pages)

      .map(
        (page) =>
          `<a class="link" href="${pages[page].replace(
            __dirname,
            "http://127.0.0.1:5173"
          )}">${page
            .replace(`${__dirname}/pages/`, "")
            .replaceAll("-", " ")}</a>`
      )
      .join("")}
      </div></section>
    <script type="module" src="http://localhost:5173/main.ts"></script>

  </body>
</html>
`;

writeFileSync(resolve(__dirname, "index.html"), content);

export default defineConfig({
  server: { open: true },
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...getPages(),
      },
    },
  },
});
