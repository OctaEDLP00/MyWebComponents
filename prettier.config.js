/**
 * @type {import('prettier').Config}
*/
export default {
  semi: false,
  printWidth: 120,
  singleQuote: true,
  quoteProps: "as-needed",
  proseWrap: "preserve",
  tabWidth: 2,
  useTabs: false,
  arrowParens: "avoid",
  endOfLine: "lf",
  singleAttributePerLine: false,
  experimentalTernaries: true,
  trailingComma: "all",
  plugins: ["prettier-plugin-tailwindcss"],
};
