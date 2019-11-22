import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { Tx } from '@herajs/client';

import { Account } from '../../src/account';
import { Transaction } from '../../src/client/transaction';
import { Invocation } from '../../src/model';

describe('Account', () => {

  const payload = "CjmCLqGZypZ8XtQXYZcehbdjErGkDg1H6qzH7jw5bMe22Wx9Cb2yAbtCx4rj93RAPWvkfN1cjjrVJgjR4cvB6RYNf54kKkzUXxx5tiit7msMbVwrp33gKmHEVq5hXTQwiLqGhi9XpK8A1pQBgw9HHpF6RHRqVcB3Qgg7VWMJRTih8ghCfsmkCZfn2z5i9N8DLZH4r6oZVanhoPWogFRN";

  it('should create deploy tx', async () => {
    // when
    const account = await Account.new();
    const creator = account.address;
    const deployment = {
      payload: payload
    }
    const feeLimit = 10;

    // then
    const rawTx = Transaction.deployTx(creator, deployment, feeLimit)
    assert.isNotNull(rawTx);
    assert.equal(rawTx.type, Tx.Type.DEPLOY);
  });

  it('should create deploy tx', async () => {
    // when
    const account = await Account.new();
    const creator = account.address;
    const target = "some_target";
    const deployment = {
      payload: payload
    }
    const feeLimit = 10;

    // then
    const rawTx = Transaction.redeployTx(creator, target, deployment, feeLimit)
    assert.isNotNull(rawTx);
    assert.equal(rawTx.type, Tx.Type.REDEPLOY);
  });

  it('should create execute tx', async () => {
    // when
    const account = await Account.new();
    const creator = account.address;
    const invocation = {
      functionCall: {
        asTransaction: (o) => o
      }
    }
    const feeLimit = 10;

    // then
    const rawTx = Transaction.executeTx(creator, invocation, feeLimit)
    assert.isNotNull(rawTx);
    assert.equal(rawTx.type, Tx.Type.CALL);
  });

  it('should create execute tx with fee delegation', async () => {
    // when
    const account = await Account.new();
    const creator = account.address;
    const invocation: Invocation = {
      functionCall: {
        asTransaction: (o) => o
      },
      feeDelegation: true
    }
    const feeLimit = 10;

    // then
    const rawTx = Transaction.executeTx(creator, invocation, feeLimit)
    assert.isNotNull(rawTx);
    assert.equal(rawTx.type, Tx.Type.FEEDELEGATION);
  });

});