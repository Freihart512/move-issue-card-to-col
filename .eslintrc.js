module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['standard', 'plugin:jsdoc/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['**/*.test.js', './__mocks__/**/*.js'],
      env: { jest: true },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['jsdoc', 'jest'],
  rules: {
    'comma-dangle': ['error', 'only-multiline'],
    semi: [2, 'always'],
    'space-before-function-paren': 'error',
    'jsdoc/no-defaults': [0]
  },
};
