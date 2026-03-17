import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importX from "eslint-plugin-import-x";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "*.config.js",
    "*.config.mjs",
  ]),

  {
    plugins: {
      "import-x": importX,
    },

    // ─── Wire up typed linting ────────────────────────────────────────
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,          // auto-finds tsconfig.json from each file's dir
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      // ─── TypeScript: strict & safe ───────────────────────────────────
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/return-await": ["error", "in-try-catch"],

      // ─── Imports ──────────────────────────────────────────────────────
      "import-x/no-duplicates": ["error", { "prefer-inline": true }],
      "import-x/no-cycle": "error",
      "import-x/no-self-import": "error",

      // ─── React ───────────────────────────────────────────────────────
      "react/jsx-boolean-value": ["error", "never"],
      "react/self-closing-comp": "error",
      "react/no-array-index-key": "warn",
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      "react/hook-use-state": "error",

      // ─── General ─────────────────────────────────────────────────────
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message: "Avoid enums — use const objects or union types instead.",
        },
      ],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: ["error", "all"],
      "object-shorthand": "error",
      "prefer-template": "error",
      "no-nested-ternary": "error",
      "no-unneeded-ternary": "error",
    },
  },
]);

export default eslintConfig;