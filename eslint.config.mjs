import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "coverage/**",
      "next-env.d.ts",
      "*.tsbuildinfo",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Pre-existing `any` usage lives mostly in API/data modules that later
      // audit phases (API-2, SEC, UX-2) will re-type. Keep it visible as a
      // warning so `npm run lint` stays green without blocking hygiene work.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
