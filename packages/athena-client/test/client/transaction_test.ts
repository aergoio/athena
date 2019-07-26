import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import { Account } from '../../src/account';
import { Transaction } from '../../src/client/transaction';

describe('Account', () => {

  const payload = "CjmCLqGZypZ8XtQXYZcehbdjErGkDg1H6qzH7jw5bMe22Wx9Cb2yAbtCx4rj93RAPWvkfN1cjjrVJgjR4cvB6RYNf54kKkzUXxx5tiit7msMbVwrp33gKmHEVq5hXTQwiLqGhi9XpK8A1pQBgw9HHpF6RHRqVcB3Qgg7VWMJRTih8ghCfsmkCZfn2z5i9N8DLZH4r6oZVanhoPWogFRN";

  it('should create deploy tx', async () => {
    // given
    const account = await Account.new();
    const creator = account.address;
    const deployment = {
      payload: payload
    }
    const feeLimit = 10;

    // when
    const rawTx = Transaction.deployTx(creator, deployment, feeLimit)
    assert.isNotNull(rawTx);
  });

  it('should create execute tx', async () => {
    // given
    const account = await Account.new();
    const creator = account.address;
    const invocation = {
      functionCall: {
        asTransaction: () => {}
      }
    }
    const feeLimit = 10;

    // when
    const rawTx = Transaction.executeTx(creator, invocation, feeLimit)
    assert.isNotNull(rawTx);
  });

});