import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**", ".wrangler/**", ".sites-runtime/**",
    ".open-next/**",
    "dist/**",
    "tmp/**",
    "next-env.d.ts",
  ]),
  { rules: { "@next/next/no-img-element": "off" } },
]);
