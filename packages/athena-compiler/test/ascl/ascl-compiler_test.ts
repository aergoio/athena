import fs from 'fs';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import {AsclCompiler} from '../../src/ascl';

describe('AsclCompiler', () => {

  it('should return compiler result', async () => {
    const filePath = __dirname + "/../res/contract.lua";
    const source = fs.readFileSync(filePath, "utf8");

    const luaCompiler = new AsclCompiler();
    const compiltResult = await luaCompiler.compile(source, filePath);
    assert.isNotNull(compiltResult.abi);
    assert.isNotNull(compiltResult.payload);
  });
});