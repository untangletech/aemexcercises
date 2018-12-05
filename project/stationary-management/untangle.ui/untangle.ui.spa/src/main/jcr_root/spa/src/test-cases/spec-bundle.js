/*
 * Create a context for all tests files below the src folder and all sub-folders.
 */

// requires all tests in `project/test/src/components/**/index.js`
const tests = require.context('./', true, /\.spec\.js$/);

tests.keys().forEach(tests);

// requires all components in `project/src/components/**/index.js`
const modules = require.context('../modules/', true, /\.js$/);

modules.keys().forEach(modules);