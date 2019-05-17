import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { 
  newIdentity,
  decryptIdentity,
  encryptIdentity,
  signTx
} from '../../src/account';

describe('Account', () => {

  it('should create identity', async () => {
    const identity = await newIdentity();
    assert.isNotNull(identity);
  });

  it('should decrypt identity', async () => {
    const encrypted = "47NoLteKjMtEGenYRba1xFjmAeibp454gZCgPUCX12TkPyfEZMCN6ZxcYQ1yWXsoXQLBGuCUA";
    const password = "1234";
    const expectedAddress = "AmNXLukoTgDjHYaHWg1CbsAgcNbTt8Cy9ERNhdwYfpXTms9wkpFa";
    const identity = await decryptIdentity(encrypted, password);
    assert.equal(identity.address, expectedAddress);
  });

  it('should encrypt and decrypt identity', async () => {
    const originIdentity = await newIdentity();
    const password = "1234";
    const encrypted = await encryptIdentity(originIdentity, password);
    const restoredIdentity = await decryptIdentity(encrypted, password);
    assert.equal(restoredIdentity.address, originIdentity.address);
  });

  it('should sign tx with identity', async () => {
    const identity = await newIdentity();
    const rawTx = {
      chainIdHash: "test",
      from: identity.address,
      to: identity.address,
      amount: "0",
    };
    const signedTx = await signTx(identity, rawTx);
    assert.isNotNull(signedTx);
  });

});