import fs from 'fs';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import {LuaCompiler} from '../../src/lua';

describe('LuaCompiler', () => {

  const luaCompiler = new LuaCompiler();

  it('should return payload exactly', async () => {
    const filePath = __dirname + "/../res/contract.lua";
    const source = fs.readFileSync(filePath, "utf8");
    const compiltResult = await luaCompiler.compile(source, filePath);
    assert.isNotNull(compiltResult.abi);

    const expected = "sed6qtGGj26sTUcUQEzhisX5Ue7WGz95jmECm3EDoHqmJhb7kQR6KCNKHqyDoCaheq7NaURMXJJLifSZP4Zvgbn13SiTy6GACVZpAjRrVPc2g3x9y4Xjna44wQuZntpdQriR5geAqbaYxQGdDZmu2oRihbfrQAr3nGGRfF6Peq6KuAA9goABLaSGanDFZh8F2f5DmEpJsm9vtDxvvVcBpfckXCwZcAfVgnS5gHQkfbQyV9jUgYyuM75qpi44VMkcSTd6JijNy7VS6k1RAaWyf75NYJBs8hq9YyCYZJW3BMqRMNkh8UPxVPwctaW8qzDCGRQ3Mh4um4AQCMpF7xVwH29A5dyyZC6q5D1oWmjmybpk1AWMaKXtk3PVeRPzV7v67cZq7MxG9qZpRVzFVv2ZJ5o8FJrwXumUknDMwKmfcATd2DCyBEuBCE3rQXMevfE5926kPz1SMcHjUBdab5YPUyGGNPUodCAveF8ySBKmxFLEvAbK8Vrc312HNSRrYgAjTAzNphU6p88sRw7wxiQKtwhQujPMaXtBuXEH76ZvALQrAcTznuT4iPTxeZgdWLnNJSVbQfXVqcJmBoRQ4ZDsa224sTZGs9fxaTWwZW3kUgYpeRDA16Yn7emapAGTB9hQsDw5eRTxRF9VhsAtSE9thXJqHnfcNXqeQdNxi9UNNGHXWhrrKRkiHdNSAkckBT3d27KRPEQaCCriAqF6npXeLSLhH6Xe6bxMwgrG2biK2AyMMQ7pr3DRA9Ma4J";
    assert.equal(compiltResult.payload, expected);
  });

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