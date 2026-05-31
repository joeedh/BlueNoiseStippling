// Dev server: rebuild on change and serve dist/ over HTTP.
import * as esbuild from "esbuild";
import { buildOptions, copyHtml, outdir } from "./esbuild.config.mjs";

const port = Number(process.env.PORT) || 8000;

await copyHtml();
const ctx = await esbuild.context(buildOptions);
await ctx.watch();

const { hosts, port: servePort } = await ctx.serve({ servedir: outdir, port });
const host = hosts.includes("127.0.0.1") ? "127.0.0.1" : hosts[0];
console.log(`Dev server running at http://${host}:${servePort}/`);
