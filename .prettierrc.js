/** @type {import('prettier').Config} */
/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig*/
const config = {
  arrowParens: "always",
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "es5",
  tabWidth: 2,
  // https://github.com/IanVS/prettier-plugin-sort-imports
  importOrder: [
    "<BUILT_IN_MODULES>",
    "", // use empty strings to separate groups with empty lines
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/(.*)$", // our imports from src folder (check tsconfig.json)
    "",
    "^[./]", // our imports
    "",
    "<TYPES>",
    "<TYPES>^[.]",
    "",
    "^(?!.*[.]css$)[./].*$", // css imports
    ".css$",
  ],
  plugins: [
    require.resolve("@ianvs/prettier-plugin-sort-imports"),
    /**
     * **NOTE** tailwind plugin must come last!
     * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss#compatibility-with-other-prettier-plugins
     */
    require.resolve("prettier-plugin-tailwindcss"),
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
};

module.exports = config;
