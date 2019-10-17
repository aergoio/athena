# athena-compiler

[![npm](https://img.shields.io/npm/v/@aergo/athena-compiler.svg)](https://www.npmjs.com/package/@aergo/athena-compiler)
[![npm](https://img.shields.io/npm/dm/@aergo/athena-compiler.svg)](https://www.npmjs.com/package/@aergo/athena-compiler)

Provides compiler for [aergo smart contract](https://docs.aergo.io/en/latest/smart-contracts/index.html)

* [lua](https://docs.aergo.io/en/latest/smart-contracts/lua/index.html)
* [ascl](https://docs.aergo.io/en/latest/smart-contracts/scl/index.html)

aergoluac version : [v1.3.0](https://github.com/aergoio/aergo/releases/tag/v1.3.0)

## Api

lua

```js
const filePath = "${LUA_SOURCE_FILE_PATH}";
const source = "${LUA_SOURCE}";
const luaCompiler = new CompilerFactory().create(CompilerType.Lua);

luaCompiler.compile(source, filePath).then(compileResult => {
  console.log("Payload", compileResult.payload); // as a trimmed string form
  console.log("Abi", compileResult.abi); // as a json object
}).catch(err => {
  console.log("Error", err);
});
```

ascl

```js
// TODO
```

## Usage

* Install dependenty : `yarn install`
* Lint : `yarn run lint`
* Test : `yarn run test`
* Build : `yarn run build`
