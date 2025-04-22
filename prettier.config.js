const config = {
  bracketSpacing: true,
  printWidth: 120,
  tabWidth: 4,
  singleQuote: false,
  importOrder: [
    // Core libraries
    'react',

    // External libraries (e.g., Material-UI)
    '^@mui/(.*)$',

    // Third-party modules
    '<THIRD_PARTY_MODULES>',

    // Project-specific modules
    'utils/', // Utility functions
    'hooks/', // Custom hooks
    'packages/', // Packages
    'components/', // Components
    'partials/', // Partial components
    'contexts/', // Contexts
    'services/', // Service modules
    'pages/', // Pages

    // Relative and parent directory imports
    '^./(.*)$', // Relative imports
    '^../(.*)$', // Parent directory imports

    // Assets and styles
    '.svg', // SVG files
    '(?=./styles.module.scss)', // Lookahead assertion for styles
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

module.exports = config;
