/// ENVVAR
// - COMPILE_MODE:      production modes enables optimizations (default: development)
// - COMPILE_VERSION:   compiler version (default: 0.8.21)

const fs = require('fs');
const path = require('path');

const argv = require('yargs/yargs')()
  .env('')
  .options({
    mode: {
      alias: 'compileMode',
      type: 'string',
      choices: ['production', 'development'],
      default: 'development',
    },
    ir: {
      alias: 'enableIR',
      type: 'boolean',
      default: false,
    },
    compiler: {
      alias: 'compileVersion',
      type: 'string',
      default: '0.8.21',
    },
  }).argv;

require('hardhat-exposed');
require('solidity-docgen');

for (const f of fs.readdirSync(path.join(__dirname, 'hardhat'))) {
  require(path.join(__dirname, 'hardhat', f));
}

const withOptimizations = argv.gas || argv.compileMode === 'production';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@bifproject/hardhat-bif-tool');
module.exports = {
  solidity: {
    version: argv.compiler,
    settings: {
      optimizer: {
        enabled: withOptimizations,
        runs: 200,
      },
      viaIR: withOptimizations && argv.ir,
      outputSelection: { '*': { '*': ['storageLayout'] } },
    },
  },
  exposed: {
    imports: true,
    initializers: true,
    exclude: ['vendor/**/*'],
  },
  docgen: require('./docs/config'),
};
