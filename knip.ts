import type { KnipConfig } from "knip";

/**
 * Knip finds unused files, dependencies and exports in your JavaScript and TypeScript projects.
 * https://github.com/webpro/knip#%EF%B8%8F-knip
 */
const config: KnipConfig = {
  entry: [
    "next.config.{js,ts,cjs,mjs}",
    "pages/**/*.{js,jsx,ts,tsx}",
    "src/pages/**/*.{js,jsx,ts,tsx}",
    "app/**/*.{js,jsx,ts,tsx}",
    "src/app/**/*.{js,jsx,ts,tsx}",
  ],

  ignore: [],
  ignoreDependencies: ["sharp", "eslint-config-next"],
};

export default config;
