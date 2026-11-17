import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// WO-WEB-27: Next 16 go lenh "next lint"; ESLint chay truc tiep voi
// cau hinh phang (flat config) cua eslint-config-next 16.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
