const path = require('path');

module.exports = {
  externalDeps: ['react', 'zod'],
  pluginRoot: path.resolve(__dirname, './web'),
  outDir: path.resolve(__dirname, '../../public'),
};
