import { Contract } from '@herajs/client';

import { Deployment, Invocation } from "../model";

export class Transaction {

  static deployTx(creator: string, deployment: Deployment, feeLimit: number): any {
    const amount = typeof deployment.amount === "undefined" ? "0" : deployment.amount;
    const payload = Contract.fromCode(deployment.payload.trim()).asPayload(deployment.args);

    // TODO : process fee limit
    const rawTx = {
      from: creator,
      to: "",
      amount: amount,
      payload: payload
    };

    return rawTx;
  }

  static executeTx(executor: string, invocation: Invocation, feeLimit?: number): any {
    const amount = typeof invocation.amount === "undefined" ? "0" : invocation.amount;

    // TODO : process fee limit
    const rawTx = invocation.functionCall.asTransaction({
      from: executor,
      amount: amount
    });

    return rawTx;
  }

}

export default Transaction;