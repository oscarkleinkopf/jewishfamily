import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        BRAJOT_DATABASE: 'readonly',
        INITIAL_EVENTS: 'readonly',
        INITIAL_MEMBERS: 'readonly',
        DorLdorKernel: 'writable',
        DorLdorLite: 'writable',
        DorLdorCore: 'writable',
        DorLdorDom: 'writable',
        L: 'readonly',
        d3: 'readonly',
        html2pdf: 'readonly',
        initDB: 'readonly',
        getMembers: 'readonly',
        getEvents: 'readonly',
        getSetting: 'readonly',
        saveSetting: 'readonly',
        saveMember: 'readonly',
        deleteMember: 'readonly',
        saveEvent: 'readonly',
        deleteEvent: 'readonly',
        saveShorashimProject: 'readonly',
        getShorashimProject: 'readonly',
        exportDatabase: 'readonly',
        importDatabase: 'readonly',
        clearAllData: 'readonly'
      }
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
];
