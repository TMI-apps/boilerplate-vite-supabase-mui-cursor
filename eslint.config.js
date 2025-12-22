import gtsConfig from './node_modules/gts/build/src/index.js';
import ignores from './eslint.ignores.js';
import {defineConfig} from 'eslint/config';

export default defineConfig([
  {ignores},
  ...gtsConfig,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.app.json'],
      },
    },
    rules: {
      // Override GTS's quote rule to match Prettier (double quotes)
      // GTS defaults to single quotes, but Prettier is configured for double quotes
      // This ensures ESLint doesn't conflict with Prettier's formatting
      quotes: ['warn', 'double', { avoidEscape: true }],
      // Disable React import requirement (using new JSX transform with jsx: "react-jsx")
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      // Prevent imports from wrong layers - Architecture enforcement
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@features/*/components',
                '@features/*/hooks',
                '@features/*/services',
              ],
              message:
                'Components cannot import from hooks or services. Use hooks instead.',
            },
            {
              group: ['@features/*/hooks'],
              message: 'Hooks cannot import from components.',
            },
            {
              group: ['@common/*'],
              message: 'Common components cannot import from features.',
            },
          ],
        },
      ],
    },
  },
]);

