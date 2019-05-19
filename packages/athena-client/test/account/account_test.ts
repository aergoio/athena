import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { Account } from '../../src/account';

describe('Account', () => {

  it('should create new account', async () => {
    const account = await Account.new();
    assert.isNotNull(account);
  });

  it('should decrypt identity', async () => {
    const encrypted = "47NoLteKjMtEGenYRba1xFjmAeibp454gZCgPUCX12TkPyfEZMCN6ZxcYQ1yWXsoXQLBGuCUA";
    const password = "1234";
    const expectedAddress = "AmNXLukoTgDjHYaHWg1CbsAgcNbTt8Cy9ERNhdwYfpXTms9wkpFa";
    const account = await Account.from(encrypted, password);
    assert.equal(account.address, expectedAddress);
  });

  it('should encrypt and decrypt identity', async () => {
    const originAccount = await Account.new();
    const password = "1234";
    const encrypted = await originAccount.encrypt(password);
    const restoredAccount = await Account.from(encrypted, password);
    assert.equal(restoredAccount.address, originAccount.address);
  });

  it('should sign tx with identity', async () => {
    const account = await Account.new();
    const rawTx = {
      chainIdHash: "test",
      from: account.address,
      to: account.address,
      amount: "0",
    };
    const signedTx = await account.signTx(rawTx);
    assert.isNotNull(signedTx);
  });

});