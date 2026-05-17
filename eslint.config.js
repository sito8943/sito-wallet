import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // ── Regression rules ────────────────────────────────────────────────────
      // Catch the set-state-in-effect pattern that previously caused bugs:
      // calling a setter inside useEffect that lists the same state as a
      // dependency (creates an infinite update loop or unexpected re-renders).
      "react-hooks/exhaustive-deps": "error",

      // Disallow direct mutation of state values; always use the setter.
      "no-restricted-syntax": [
        "error",
        {
          // Flag: setState(prevState => { prevState.x = y; return prevState })
          // (mutating the argument of a state updater function)
          selector:
            "CallExpression[callee.name=/^set[A-Z]/] AssignmentExpression",
          message:
            "Avoid mutating state directly inside a setter. Use immutable updates instead.",
        },
      ],

      // Disallow calling state setters inside useEffect bodies without a
      // conditional guard (pattern that caused react-hooks/set-state-in-effect failures).
      // NOTE: This is enforced at the lint level; the exhaustive-deps rule
      // above catches the dependency-array side of the same problem.
      "react-hooks/rules-of-hooks": "error",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/**/__tests__/**",
      "src/test/**",
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "src/**/*.spec.ts",
      "src/**/*.spec.tsx",
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: true,
          },
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
    },
  },
  {
    files: ["src/test/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);
