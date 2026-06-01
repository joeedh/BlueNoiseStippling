// Shared esbuild build options for the dev server and production build.
// Entry is extensionless so esbuild resolves scripts/appstate.ts (after the
// TypeScript port) or scripts/appstate.js (before it) transparently.
import { copyFile, mkdir } from "node:fs/promises";
import esbuildSvelte from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";

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
  // Svelte's package exports need the "svelte" condition/field to resolve.
  mainFields: ["svelte", "browser", "module", "main"],
  conditions: ["svelte", "browser"],
  resolveExtensions: [".ts", ".js", ".svelte", ".json"],
  plugins: [
    esbuildSvelte({
      preprocess: sveltePreprocess({
        // svelte-preprocess transpiles each <script> block in isolation, so it
        // can't see components referenced only in markup. Without
        // verbatimModuleSyntax, TS elides those "unused" component imports and
        // they become undefined at runtime. Force it on for the preprocess only
        // (the .svelte files use `import type` for all real type imports); the
        // tsgo tsconfig is left untouched.
        typescript: {
          compilerOptions: { verbatimModuleSyntax: true, isolatedModules: true },
        },
      }),
      compilerOptions: { runes: true },
    }),
  ],
};

// esbuild does not template HTML, so we copy index.html into the served dir.
export async function copyHtml() {
  await mkdir(outdir, { recursive: true });
  await copyFile("index.html", `${outdir}/index.html`);
}
