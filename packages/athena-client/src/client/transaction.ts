import { Contract, Tx } from '@herajs/client';

import { Deployment, Invocation } from "../model";

export class Transaction {

  static deployTx(creator: string, deployment: Deployment, feeLimit: number): any {
    const amount = typeof deployment.amount === "undefined" ? "0" : deployment.amount;
    const payload = Contract.fromCode(deployment.payload.trim()).asPayload(deployment.args);

    const rawTx = {
      type: Tx.Type.DEPLOY,
      from: creator,
      to: "",
      amount: amount,
      payload: payload,
      limit: feeLimit
    };

    return rawTx;
  }

  static redeployTx(creator: string, target: string, deployment: Deployment, feeLimit: number): any {
    const amount = typeof deployment.amount === "undefined" ? "0" : deployment.amount;
    const payload = Contract.fromCode(deployment.payload.trim()).asPayload(deployment.args);

    const rawTx = {
      type: Tx.Type.REDEPLOY,
      from: creator,
      to: target,
      amount: amount,
      payload: payload,
      limit: feeLimit
    };

    return rawTx;
  }

  static executeTx(executor: string, invocation: Invocation, feeLimit?: number): any {
    const amount = typeof invocation.amount === "undefined" ? "0" : invocation.amount;

    const type = invocation.feeDelegation ? Tx.Type.FEEDELEGATION : Tx.Type.CALL;
    const rawTx = invocation.functionCall.asTransaction({
      type: type,
      from: executor,
      amount: amount,
      limit: feeLimit
    });

    return rawTx;
  }

}

export default Transaction;