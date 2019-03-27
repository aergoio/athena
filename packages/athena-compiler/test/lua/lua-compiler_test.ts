import fs from 'fs';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import {LuaCompiler} from '../../src/lua';

describe('LuaCompiler', () => {

  it('should return compiler result', async () => {
    const filePath = __dirname + "/../res/contract.lua";
    const source = fs.readFileSync(filePath, "utf8");
    const luaCompiler = new LuaCompiler();
    const compiltResult = await luaCompiler.compile(source, filePath);
    assert.isNotNull(compiltResult.abi);
    assert.isNotNull(compiltResult.payload);
  });

  it('should throw error on no abi.register', async () => {
    const filePath = __dirname + "/../res/withoutregister.lua";
    const source = fs.readFileSync(filePath, "utf8");
    const luaCompiler = new LuaCompiler();
    try {
      await luaCompiler.compile(source, filePath);
      assert.fail("Should throw err");
    } catch (err) {
      // good we expected this
    }
  });

  it('should throw error on no syntax error', async () => {
    const filePath = __dirname + "/../res/syntaxerror.lua";
    const source = fs.readFileSync(filePath, "utf8");
    const luaCompiler = new LuaCompiler();
    try {
      await luaCompiler.compile(source, filePath);
      assert.fail("Should throw err");
    } catch (err) {
      // good we expected this
    }
  });

});