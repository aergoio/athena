const webpack = require('webpack');
const path = require('path');
const chai = require('chai');
const assert = chai.assert;

function requireFromString(src, filename) {
  const Module = module.constructor;
  const m = new Module();
  m._compile(src, filename);
  return m.exports;
}

describe('webpack loader', () => {
  it('should load a contract file', (done) => {
    webpack({
      module: {
        rules: [
          {
            test: /\.lua/,
            use: ['@aergo/athena-webpack-loader']
          }
        ]
      },
      entry: path.resolve(__dirname, 'contract.lua'),
    }, (err, stats) => {
      if (err) {
        throw new Error(err);
      }
      if (stats.hasErrors()) {
        throw new Error(stats.compilation.errors);
      }
      const compiledSource = stats.compilation.entries[0].originalSource().source();
      const mod = requireFromString(compiledSource, stats.compilation.entries[0].resource);
      assert.equal(mod.abi.language, 'lua');
      assert.equal(mod.abi.functions[0].name, 'getContractCreator');
      done();
    });
  }).timeout(5000);
});