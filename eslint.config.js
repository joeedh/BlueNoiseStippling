import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      // Vendored / legacy / non-source files.
      "scripts/dat.gui.js",
      "scripts/require.js",
      "scripts/relax_worker.js",
      "scripts/spectrum.js",
      "scripts/typesystem.js",
      "serv.js",
      "smoothmask_file.js",
      // Giant inline-data modules (string blobs, not worth linting).
      "scripts/mask_file.*",
      "scripts/smoothmask_file.*",
      "scripts/flowersData.*",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["scripts/**/*.ts", "scripts/**/*.d.ts"],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // The port intentionally keeps many dynamic/legacy idioms (a hand-written
      // numeric codebase): `let this2 = this`, `arguments`, `if (1)`/`if (0 &&)`
      // debug toggles, chained assignments, `new Array(n)`, and the Vector
      // class+interface declaration-merging. Relax the rules that flag those so
      // eslint surfaces real problems as errors, idioms as warnings.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-array-constructor": "off",
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "prefer-rest-params": "off",
      "no-constant-condition": "off",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-var": "warn",
      "no-cond-assign": ["warn", "always"],
      "no-constant-binary-expression": "warn",
      "no-useless-escape": "warn",
      "no-self-assign": "warn",
      "prefer-const": "warn",
    },
  },
  {
    files: ["*.mjs", "*.config.js", "*.config.ts"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // Test files poke at internals; relax the same rules as the source override.
    files: ["tests/**/*.ts", "e2e/**/*.ts"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
