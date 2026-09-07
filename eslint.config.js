// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const vitest = require('@vitest/eslint-plugin');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@angular-eslint/component-class-suffix': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended],
    rules: {},
  },
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.spec.ts'],
    extends: [vitest.configs.recommended],
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'vitest/unbound-method': 'error',

      'vitest/require-top-level-describe': 'error',

      'vitest/padding-around-all': 'error',
    },
  },
]);
