require('dotenv').config()
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  chromeWebSecurity: false,

  e2e: {
    baseUrl: 'https://master-dev.website.godsunchained.com/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    excludeSpecPattern: ['**/1-getting-started/*', '**/2-advanced-examples/*'],
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      config.env = process.env
      return config
    },
  },
});
