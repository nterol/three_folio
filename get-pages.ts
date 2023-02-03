import { resolve } from "path";
import { readdirSync } from "fs";

// TODO: Make it recursive
export default function getPages(): Record<string, string> {
  const basePagesPath = resolve(__dirname, "pages");
  const pages = readdirSync(basePagesPath).map((name) =>
    resolve(basePagesPath, name)
  );

  const pageConfig = Object.fromEntries(
    pages.map((page) => [page, resolve(__dirname, `${page}/index.html`)])
  );

  return pageConfig;
}
