const { CompilerFactory, CompilerType } = require('@aergo/athena-compiler');

module.exports = async function athenaLoader(source) {
  const loaderContext = this;
  const filePath = loaderContext.resource;
  const luaCompiler = new CompilerFactory().create(CompilerType.Lua);
  const compileResult = await luaCompiler.compile(source, filePath);
  compileResult.abi = compileResult.abi;
  compileResult.payload = compileResult.payload;
  return `module.exports = ${JSON.stringify(compileResult)};`;
};
