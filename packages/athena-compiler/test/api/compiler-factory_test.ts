import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import CompilerFactory from '../../src/api/compiler-factory';
import { CompilerType } from '../../src/model';
import { LuaCompiler } from '../../src/lua';
import { AsclCompiler } from '../../src/ascl';

describe('CompilerFactory', () => {
  it('should return LuaCompiler', () => {
    const compiler = new CompilerFactory().create(CompilerType.Lua);
    assert.isTrue(compiler instanceof LuaCompiler);
  });

  it('should return AsclCompiler', () => {
    const compiler = new CompilerFactory().create(CompilerType.Ascl);
    assert.isTrue(compiler instanceof AsclCompiler);
  });
});