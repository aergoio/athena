import { AergoClient, GrpcProvider } from '@herajs/client';
import { Account } from '../account';

import { assertNotEmpty } from '../utils';
import { BlockchainStatus, AccountState, Deployment, Invocation, Query, DeployResult, ExecuteResult } from '../model';
import { ContractInterface } from '../contract';

import Transaction from './transaction';

const contractTxSuccesses = [ "CREATED", "SUCCESS","RECREATED" ];

/**
 * In charge of client interaction specially on aergo smart contract.
 */
export class AthenaClient {

  protected readonly client: AergoClient = new AergoClient();
  protected chainIdHash: string | Uint8Array = "";

  constructor(endpoint?: string) {
    if (endpoint) {
      this.use(endpoint);
    }
  }

  use(endpoint: string): void {
    assertNotEmpty(endpoint, "Endpoint should not be empty");
    this.client.setProvider(new GrpcProvider({url: endpoint}));
    this.chainIdHash = ""; // mark as dirty
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

  async getGasPrice(): Promise<string> {
    const price = await this.client.getChainInfo().then(i => i.gasprice);
    return price.formatNumber('aer');
  }

  async getContractInterface(contractAddress: string): Promise<ContractInterface> {
    assertNotEmpty(contractAddress, "Contract address should not be empty");

    const abi = await this.client.getABI(contractAddress);
    return new ContractInterface(contractAddress, abi);
  }

  async deploy(account: Account, deployment: Deployment, feeLimit: number): Promise<DeployResult> {
    assertNotEmpty(account, "Account should not be empty");
    assertNotEmpty(deployment, "Deployment should not be empty");
    assertNotEmpty(feeLimit, "Fee limit should not be empty");

    const chainIdHash = await this.getChainIdHash();
    const creator = account.address;

    const trier = async (nonce: number): Promise<string> => {
      const rawTx = Transaction.deployTx(creator, deployment, feeLimit);
      rawTx.chainIdHash = chainIdHash;
      rawTx.nonce = nonce;
      const signedTx = await account.signTx(rawTx);
      return await this.client.sendSignedTransaction(signedTx);
    };
    const txHash = await this.tryWithNonceRefresh(creator, trier);
    const receipt = await this.pollingReceipt(txHash);

    const contractAddress = receipt.contractaddress.toString();

    const deployResult = this.buildExecuteResult(contractAddress, txHash, receipt);

    const contractInterface = await this.getContractInterface(contractAddress);
    deployResult.contractInterface = contractInterface;

    return deployResult;
  }

  async redeploy(account: Account, target: string, deployment: Deployment, feeLimit: number): Promise<DeployResult> {
    assertNotEmpty(account, "Account should not be empty");
    assertNotEmpty(target, "Redeploy target should not be empty");
    assertNotEmpty(deployment, "Deployment should not be empty");
    assertNotEmpty(feeLimit, "Fee limit should not be empty");

    const chainIdHash = await this.getChainIdHash();
    const creator = account.address;

    const trier = async (nonce: number): Promise<string> => {
      const rawTx = Transaction.redeployTx(creator, target, deployment, feeLimit);
      rawTx.chainIdHash = chainIdHash;
      rawTx.nonce = nonce;
      const signedTx = await account.signTx(rawTx);
      return await this.client.sendSignedTransaction(signedTx);
    };
    const txHash = await this.tryWithNonceRefresh(creator, trier);
    const receipt = await this.pollingReceipt(txHash);

    const contractAddress = receipt.contractaddress.toString();

    const redeployResult = this.buildExecuteResult(contractAddress, txHash, receipt);

    const contractInterface = await this.getContractInterface(contractAddress);
    redeployResult.contractInterface = contractInterface;

    return redeployResult;
  }

  async execute(account: Account, invocation: Invocation, feeLimit: number): Promise<ExecuteResult> {
    assertNotEmpty(account, "Account should not be empty");
    assertNotEmpty(invocation, "Invocation should not be empty");
    assertNotEmpty(feeLimit, "Fee limit should not be empty");

    const chainIdHash = await this.getChainIdHash();
    const executor = account.address;

    const trier = async (nonce: number): Promise<string> => {
      const rawTx = Transaction.executeTx(executor, invocation, feeLimit);
      rawTx.chainIdHash = chainIdHash;
      rawTx.nonce = nonce;
      const signedTx = await account.signTx(rawTx);
      return await this.client.sendSignedTransaction(signedTx);
    };
    const txHash = await this.tryWithNonceRefresh(executor, trier);
    const receipt = await this.pollingReceipt(txHash);

    const contractAddress = receipt.contractaddress.toString();
    const executeResult = this.buildExecuteResult(contractAddress, txHash, receipt);

    return executeResult;
  }

  async query(query: Query): Promise<any> {
    assertNotEmpty(query, "Invocation info should not be empty");
    return await this.client.queryContract(query.functionCall);
  }

  protected async tryWithNonceRefresh(from: string, trier: (nonce: number) => Promise<string>): Promise<string> {
    const nonce = await this.fetchNextNonceOf(from);
    // TODO : try with nonce refresh
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

  protected async getChainIdHash(): Promise<string | Uint8Array> {
    if ("" === this.chainIdHash) {
      this.chainIdHash = await this.client.getChainIdHash();
    }
    return this.chainIdHash;
  }

  protected buildExecuteResult(contractAddress: string, txHash: string, receipt: any): any {
    return {
      contractAddress: contractAddress,
      txHash: txHash,
      result: receipt.result,
      status: receipt.status,
      fee: receipt.fee,
      cumulativefee: receipt.cumulativefee,
      blockno: receipt.number,
      blockhash: receipt.string
    };
  }

}

export default AthenaClient;