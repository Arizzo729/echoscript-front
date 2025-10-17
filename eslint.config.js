// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      // 👇 This is the missing bit: enable JSX parsing
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
      },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": { node: { extensions: [".js", ".jsx"] } },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "no-undef": "error",
      "react/jsx-no-undef": "error",
      "import/no-unresolved": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "unused-imports/no-unused-imports": "error",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
        },
      ],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  // Keep Prettier last to disable conflicting stylistic rules
  prettier,
];
