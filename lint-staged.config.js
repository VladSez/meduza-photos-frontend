const path = require("path");

module.exports = {
  // Run ESLint on changes to JavaScript/TypeScript files
  // Run type-check on changes to TypeScript files
  // https://github.com/okonet/lint-staged#example-run-tsc-on-changes-to-typescript-files-but-do-not-pass-any-filename-arguments
  "**/*.ts?(x)": (filenames) => [
    `pnpm run type-check`,
    `pnpm run lint ${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" ")}`,
    `pnpm run knip`,
    `pnpm run prettify`,
  ],
  "**/package.json": () => [
    "pnpm run type-check",
    "pnpm run lint",
    "pnpm run knip",
  ],
};
