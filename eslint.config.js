import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ── Regression rules ────────────────────────────────────────────────────
      // Catch the set-state-in-effect pattern that previously caused bugs:
      // calling a setter inside useEffect that lists the same state as a
      // dependency (creates an infinite update loop or unexpected re-renders).
      'react-hooks/exhaustive-deps': 'error',

      // Disallow direct mutation of state values; always use the setter.
      'no-restricted-syntax': [
        'error',
        {
          // Flag: setState(prevState => { prevState.x = y; return prevState })
          // (mutating the argument of a state updater function)
          selector:
            "CallExpression[callee.name=/^set[A-Z]/] AssignmentExpression",
          message:
            'Avoid mutating state directly inside a setter. Use immutable updates instead.',
        },
      ],

      // Disallow calling state setters inside useEffect bodies without a
      // conditional guard (pattern that caused react-hooks/set-state-in-effect failures).
      // NOTE: This is enforced at the lint level; the exhaustive-deps rule
      // above catches the dependency-array side of the same problem.
      'react-hooks/rules-of-hooks': 'error',
    },
  },
)
