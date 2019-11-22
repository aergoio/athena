import { Contract as HerajsContract } from '@herajs/client';

import { Invocation } from '../model';
import { assertNotEmpty } from '../utils';

export class ContractInterface {

  protected readonly delegate: HerajsContract;
  protected readonly _address: any;
  protected readonly _abi: any;

  constructor(contractAddress: string, abi: any) {
    this.delegate = HerajsContract.fromAbi(abi).setAddress(contractAddress);
    this._address = contractAddress;
    this._abi = abi;
  }

  get address(): any {
    return this._address;
  }

  get abi(): any {
    return this._abi;
  }

  getInvocation(targetFunction: string, ...args: any): Invocation | undefined {
    assertNotEmpty(targetFunction);

    // @ts-ignore
    const funcObject = this.delegate[targetFunction];
    if (typeof funcObject === "undefined") {
      return undefined;
    }

    const functionCall = funcObject(...args);
    return {
      functionCall: functionCall,
      feeDelegation: false
    };
  }

}

export default ContractInterface;