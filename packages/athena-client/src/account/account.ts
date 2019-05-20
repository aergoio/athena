import {
  createIdentity,
  identifyFromPrivateKey,
  decodePrivateKey,
  decryptPrivateKey,
  encryptPrivateKey,
  encodePrivateKey,
  signTransaction,
  hashTransaction
} from '@herajs/crypto';
import _ from 'lodash';

import { assertNotEmpty } from '../utils';

export class Account {

  public address: string;
  protected publicKey: any;
  protected privateKey: Buffer;
  protected keyPair: any;

  protected constructor(address: string, publicKey: any, privateKey: Buffer, keyPair: any) {
    this.address = address;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.keyPair = keyPair;
  }

  /**
   * Create an new account.
   *
   * @return an new account
   */
  static new = async (): Promise<Account> => {
    const identity = createIdentity();
    return new Account(identity.address, identity.publicKey, identity.privateKey, identity.keyPair);
  }

  /**
   * Decrypt account identity from encrypted one.
   *
   * @param encryptedPrivateKey an encrypted private key
   * @param password a password to decrypt encrypted one
   *
   * @return a decrypted identity
   */
  static from = async (encryptedPrivateKey: string, password: string): Promise<Account> => {
    assertNotEmpty(encryptedPrivateKey, "Encrypted private key should not be empty");
    assertNotEmpty(password, "Password to decrypt should not be empty");

    const encryptedBytes = decodePrivateKey(encryptedPrivateKey);
    const decryptedBytes = decryptPrivateKey(encryptedBytes, password);

    const identity = identifyFromPrivateKey(decryptedBytes);
    return new Account(identity.address, identity.publicKey, identity.privateKey, identity.keyPair);
  }

  /**
   * Encrypt account identity with password.
   *
   * @param password a password to encrypt
   *
   * @return an encrypted identity
   */
  encrypt = async (password: string): Promise<string> => {
    assertNotEmpty(password, "Password to encrypt should not be empty");

    const encryptedBytes = encryptPrivateKey(this.privateKey, password);
    const encryptedEncoded = encodePrivateKey(Buffer.from(encryptedBytes));

    return encryptedEncoded;
  }

  /**
   * Sign transaction.
   *
   * @param rawTx a raw transaction
   *
   * @return a signed transaction
   */
  signTx = async (rawTx: any): Promise<any> => {
    assertNotEmpty(rawTx, "Raw tx should not be empty");

    const signedTx = _.cloneDeep(rawTx)
    signedTx.sign = await signTransaction(signedTx, this.keyPair);
    signedTx.hash = await hashTransaction(signedTx, "base58");
    // TODO : acktsap's hack. there is a bug in signTransaction of @herajs/crypto^0.4.2
    // see also https://github.com/aergoio/herajs/pull/4
    signedTx.amount = rawTx.amount + " aer";
    return signedTx;
  }

}
