module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  rules: {
    // 🚫 Kill the exact issues we saw in prod:
    'no-undef': 'error',
    'react/jsx-no-undef': 'error',
    'import/no-unresolved': 'error',
    // Keep hooks correct:
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // Keep imports tidy and remove cruft:
    'unused-imports/no-unused-imports': 'error',
    'import/order': ['warn', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always'
    }],
    // Modern React, no need for React in scope:
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};