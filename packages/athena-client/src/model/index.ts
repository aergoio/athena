import { Amount } from '@herajs/client';
import ContractInterface from '../contract';

export { Amount };  // @herajs Amount class is useful. So just use it


// contract related

export interface Deployment {
  payload: string;
  args?: any[];
  amount?: string;
}

export interface Invocation extends Query {
  amount?: string;
  feeDelegation?: boolean;
}

export interface Query {
  functionCall: any;
}

export interface DeployResult extends ExecuteResult {
  contractInterface: ContractInterface;
}

export interface ExecuteResult {
  contractAddress: string;
  txHash: string;
  result: string;
  status: string;
  fee: Amount;
  cumulativefee: Amount;
  blockno: number;
  blockhash: string;
}


// fetching state

export interface BlockchainStatus {
  bestHeight: number;
  bestBlockHash: string;
}

export interface AccountState {
  nonce: number;
  balance: Amount;
}
