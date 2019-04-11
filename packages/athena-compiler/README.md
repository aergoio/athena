# athena-compiler

Provides compiler for [aergo smart contract](https://docs.aergo.io/en/latest/smart-contracts/index.html)

* [lua](https://docs.aergo.io/en/latest/smart-contracts/lua/index.html)
* [ascl](https://docs.aergo.io/en/latest/smart-contracts/scl/index.html)

## Api

lua

```js
const filePath = "${LUA_SOURCE_FILE_PATH}";
const source = "${LUA_SOURCE}";
const luaCompiler = new CompilerFactory().create(CompilerType.Lua);

luaCompiler.compile(source, filePath).then(compileResult => {
  console.log("Compile result");
  console.log("Payload", compileResult.payload);
  console.log("Abi", compileResult.abi);
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
* Test : `yarn run test`
* Build : `yarn run build`
