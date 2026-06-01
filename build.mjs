// Production build: bundle to dist/ and copy the HTML shell.
import * as esbuild from "esbuild";
import { buildOptions, copyHtml } from "./esbuild.config.mjs";

await copyHtml();
await esbuild.build({ ...buildOptions, minify: true });
console.log("Build complete -> dist/");
