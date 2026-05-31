// Shared esbuild build options for the dev server and production build.
// Entry is extensionless so esbuild resolves scripts/appstate.ts (after the
// TypeScript port) or scripts/appstate.js (before it) transparently.
import { copyFile, mkdir } from "node:fs/promises";

export const outdir = "dist";

/** @type {import('esbuild').BuildOptions} */
export const buildOptions = {
  entryPoints: { bundle: "./scripts/appstate" },
  outdir,
  bundle: true,
  format: "esm",
  splitting: true,
  sourcemap: true,
  target: ["es2022"],
  logLevel: "info",
};

// esbuild does not template HTML, so we copy index.html into the served dir.
export async function copyHtml() {
  await mkdir(outdir, { recursive: true });
  await copyFile("index.html", `${outdir}/index.html`);
}
