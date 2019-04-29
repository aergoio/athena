const { CompilerFactory, CompilerType } = require('@aergoio/athena-compiler');

module.exports = async function athenaLoader(source) {
  if (this.cacheable) {
    this.cacheable();
  }
  const loaderContext = this;
  const filePath = loaderContext.resource;
  const luaCompiler = new CompilerFactory().create(CompilerType.Lua);
  const compileResult = await luaCompiler.compile(source, filePath);
  compileResult.abi = JSON.parse(compileResult.abi);
  return `module.exports = ${JSON.stringify(compileResult)};`;
};
