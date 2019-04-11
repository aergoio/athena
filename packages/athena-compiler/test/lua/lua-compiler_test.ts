import fs from 'fs';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import {LuaCompiler} from '../../src/lua';

describe('LuaCompiler', () => {

  const luaCompiler = new LuaCompiler();

  it('should return compiler result on import', async () => {
    const filePath = __dirname + "/../res/withimport.lua";
    const source = fs.readFileSync(filePath, "utf8");
    const compiltResult = await luaCompiler.compile(source, filePath);
    assert.isNotNull(compiltResult.abi);
    assert.isNotNull(compiltResult.payload);
  });

  it('should throw error on no abi.register', async () => {
    const filePath = __dirname + "/../res/withoutregister.lua";
    const source = fs.readFileSync(filePath, "utf8");
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
    try {
      await luaCompiler.compile(source, filePath);
      assert.fail("Should throw err");
    } catch (err) {
      // good we expected this
    }
  });

});