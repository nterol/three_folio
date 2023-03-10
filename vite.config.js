import { writeFileSync } from "fs";
import { resolve } from "path";

import { defineConfig } from "vite";
import getPages from "./get-pages";

/* 
I know this solution sucks, 
but I don't quite understand how to vanilla SSR 🤷
*/
const pages = getPages();

const content = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Three folio</title>
  </head>
  <body>
    <section class="flex justify-center items-center w-full">
      <div class="flex flex-col justify-center items-start gap-4">
    ${Object.keys(pages)

      .map(
        (page) =>
          `<a class="text-link hover:text-linkHover font-bold" href="${pages[
            page
          ].replace(__dirname, "http://127.0.0.1:5173")}">${page.replaceAll(
            "-",
            " "
          )}</a>`
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
