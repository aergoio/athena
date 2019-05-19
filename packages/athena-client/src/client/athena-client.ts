import { AergoClient, GrpcProvider, Contract, Amount } from '@herajs/client';
import { Identity, signTx } from '../account';

import { assertNotEmpty } from '../utils';

export { Amount };

interface BlockchainStatus {
  bestHeight: number;
  bestBlockHash: string;
}

interface AccountState {
  nonce: number;
  balance: Amount;
}

interface DeployInfo {
  payload: string;
  args?: any[];
}

interface InvocationInfo {
  targetFunction: string;
  args?: any[];
}

interface Fee {
  price: string;
  limit: number;
}

interface DeployResult extends ExecuteResult {
  abi: object;
}

interface ExecuteResult {
  contractAddress: string;
  txHash: string;
  result: string;
  status: string;
  fee: Amount;
  cumulativefee: Amount;
}

const contractTxSuccesses = ["CREATED", "SUCCESS"];

export class AthenaClient {

  protected client: AergoClient; 
  protected contract: Contract | undefined;

  constructor() {
    this.client = new AergoClient();
  }

  use(endpoint: string): void {
    assertNotEmpty(endpoint, "Endpoint should not be empty");
    this.client.setProvider(new GrpcProvider({url: endpoint}));
  }

  async getBlockchainStatus(): Promise<BlockchainStatus> {
    const blockchainStatus = await this.client.blockchain();
    return { bestHeight: blockchainStatus.bestHeight, bestBlockHash: blockchainStatus.bestBlockHash.toString() };
  }

  async getState(accountAddress: string): Promise<AccountState> {
    assertNotEmpty(accountAddress, "Account address should not be empty");
    const state = await this.client.getState(accountAddress);
    return { nonce: state.nonce, balance: state.balance };
  }

  async getABI(contractAddress: string): Promise<object> {
    assertNotEmpty(contractAddress, "Contract address should not be empty");
    return await this.client.getABI(contractAddress);
  }

  prepare(contractAddress: string, abi: object): void {
    assertNotEmpty(contractAddress, "Contract address should not be empty");
    assertNotEmpty(abi, "Abi should not be empty");
    this.contract = Contract.fromAbi(abi).setAddress(contractAddress);
  }

  async deploy(identity: Identity, deployInfo: DeployInfo, fee: Fee, amount?: string): Promise<DeployResult> {
    assertNotEmpty(identity, "Identity should not be empty");
    assertNotEmpty(deployInfo, "Deploy info should not be empty");
    assertNotEmpty(fee, "Fee should not be empty");

    const from = identity.address;
    const chainIdHash = await this.client.getChainIdHash();
    const actualAmount = typeof amount === "undefined" ? "0" : amount;
    const payload = Contract.fromCode(deployInfo.payload).asPayload(deployInfo.args);

    const trier = async (nonce: number): Promise<string> => {
      const rawTx = {
        chainIdHash: chainIdHash,
        from: from,
        to: "",
        nonce: nonce,
        amount: actualAmount,
        payload: payload
      };
      const signedTx = await signTx(identity, rawTx);
      return await this.client.sendSignedTransaction(signedTx);
    };
    const txHash = await this.tryWithNonceRefresh(from, trier);
    const receipt = await this.pollingReceipt(txHash);

    const contractAddress = receipt.contractaddress.toString();
    const abi = await this.getABI(contractAddress);

    const deployResult = this.buildExecuteResult(contractAddress, txHash, receipt.result, receipt.status, receipt.fee, receipt.cumulativefee);
    deployResult.abi = abi;

    return deployResult;
  }

  async execute(identity: Identity, invocationInfo: InvocationInfo, fee: Fee, amount?: string): Promise<ExecuteResult> {
    assertNotEmpty(identity, "Identity should not be empty");
    assertNotEmpty(invocationInfo, "Invocation info should not be empty");
    assertNotEmpty(fee, "Fee should not be empty");

    if (typeof this.contract === "undefined") {
      throw new Error("Contract abi is not ready");
    }

    const from = identity.address;
    const chainIdHash = await this.client.getChainIdHash();
    const actualAmount = typeof amount === "undefined" ? "0" : amount;

    // @ts-ignore
    const functionCall = this.contract[invocationInfo.targetFunction](...invocationInfo.args);
    const trier = async (nonce: number): Promise<string> => {
      const rawTx = functionCall.asTransaction({
        chainIdHash: chainIdHash,
        from: from,
        nonce: nonce,
        amount: actualAmount
      });
      const signedTx = await signTx(identity, rawTx);
      return await this.client.sendSignedTransaction(signedTx);
    };
    const txHash = await this.tryWithNonceRefresh(from, trier);
    const receipt = await this.pollingReceipt(txHash);

    const contractAddress = receipt.contractaddress.toString();
    const executeResult = this.buildExecuteResult(contractAddress, txHash, receipt.result, receipt.status, receipt.fee, receipt.cumulativefee);

    return executeResult;
  }

  async query(invocationInfo: InvocationInfo): Promise<any> {
    assertNotEmpty(invocationInfo, "Invocation info should not be empty");

    if (typeof this.contract === "undefined") {
      throw new Error("Contract abi is not ready");
    }

    // @ts-ignore
    const functionCall = this.contract[invocationInfo.targetFunction](...invocationInfo.args);
    return await this.client.queryContract(functionCall);
  }

  protected async tryWithNonceRefresh(from: string, trier: (nonce: number) => Promise<string>): Promise<string> {
    const nonce = await this.fetchNextNonceOf(from);
    return await trier(nonce);
  }

  protected async fetchNextNonceOf(accountAddress: string): Promise<number> {
    const state = await this.getState(accountAddress);
    return state.nonce + 1;
  }

  protected pollingReceipt(txHash: string): Promise<any> {
    let receipt: any = null;
    const receiptRequest = async (): Promise<void> => {
      receipt = await this.client.getTransactionReceipt(txHash);
    };

    const timerId = setInterval(receiptRequest, 1000);
    return new Promise((resolve, reject): void => {
      (function waitForComplete(): void {
        if (receipt) {
          clearInterval(timerId);
          if (contractTxSuccesses.indexOf(receipt.status) !== -1) {
            resolve(receipt);
          } else {
            reject(receipt.result);
          }
        }
        setTimeout(waitForComplete, 250);
      })();
    });
  }

  protected buildExecuteResult(contractAddress: string, txHash: string, result: string, status: string, fee: Amount, cumulativefee: Amount): any {
    return {
      contractAddress: contractAddress,
      txHash: txHash,
      result: result,
      status: status,
      fee: fee,
      cumulativefee: cumulativefee
    };
  }

}

export default AthenaClient;