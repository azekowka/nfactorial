import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-interface": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "warn",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
      "prefer-const": "error",
    }
  }
];