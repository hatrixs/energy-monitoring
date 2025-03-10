// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'mongo-init.js'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Allows using 'any' type without warnings
      '@typescript-eslint/no-explicit-any': 'off',

      // Warns when promises are not properly handled (no await, then, catch)
      '@typescript-eslint/no-floating-promises': 'off',

      // Warns when passing potentially unsafe arguments to functions
      '@typescript-eslint/no-unsafe-argument': 'off',

      // Allows assigning values of unknown type to variables
      '@typescript-eslint/no-unsafe-assignment': 'off',

      // Allows accessing properties on objects of unknown type
      '@typescript-eslint/no-unsafe-member-access': 'off',

      // Allows calling methods on objects of unknown type
      '@typescript-eslint/no-unsafe-call': 'off',

      // Allows returning values of unknown type from functions
      '@typescript-eslint/no-unsafe-return': 'off',

      // Warns when using literal values that could be declared as const
      '@typescript-eslint/prefer-as-const': 'warn',

      // Allows using non-null assertion operator (!)
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Allows redundant type assertions
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',

      // Allows using @ts-ignore, @ts-nocheck, etc. comments
      '@typescript-eslint/ban-ts-comment': 'off',

      // Allows using delete operator on non-optional properties
      '@typescript-eslint/no-dynamic-delete': 'off',

      // Warns when declaring variables that are not used in the code
      // But allows variables that start with underscore (_)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Disables prettier formatting errors
      'prettier/prettier': 'off',
    },
  },
);
