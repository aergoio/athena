import {
  createIdentity, identifyFromPrivateKey,
  encodePrivateKey, decodePrivateKey,
  encryptPrivateKey, decryptPrivateKey,
  signTransaction, hashTransaction,
  identityFromKeystore, keystoreFromPrivateKey,
} from '@herajs/crypto';
import _ from 'lodash';

import { assertNotEmpty } from '../utils';

/**
 * In charge of creating account, signing tx, import / exporting account
 */
export class Account {

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
   * Decrypt account identity from wallet import format.
   *
   * @param encryptedPrivateKey an encrypted wallet import format
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
   * Decrypt account identity from json keystore.
   *
   * @param json a keystore in json
   * @param password a password to decrypt encrypted one
   *
   * @return a decrypted identity
   */
  static fromKeyStore = async (json: string, password: string): Promise<Account> => {
    assertNotEmpty(json, "Key json file should not be empty");
    assertNotEmpty(password, "Password to decrypt should not be empty");

    const keystore = JSON.parse(json);
    const identity = await identityFromKeystore(keystore, password);
    return new Account(identity.address, identity.publicKey, identity.privateKey, identity.keyPair);
  }

  public readonly address: string;
  protected readonly publicKey: any;
  protected readonly privateKey: Buffer;
  protected readonly keyPair: any;

  protected constructor(address: string, publicKey: any, privateKey: Buffer, keyPair: any) {
    this.address = address;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.keyPair = keyPair;
  }

  /**
   * Encrypt account identity with password.
   *
   * @param password a password to encrypt
   *
   * @return an encrypted identity
   */
  export = async (password: string): Promise<string> => {
    assertNotEmpty(password, "Password to encrypt should not be empty");

    const encryptedBytes = encryptPrivateKey(this.privateKey, password);
    const encryptedEncoded = encodePrivateKey(Buffer.from(encryptedBytes));

    return encryptedEncoded;
  }

  /**
   * Encrypt account identity with password as json keystore.
   *
   * @param password a password to encrypt
   *
   * @return a json keystore
   */
  exportAsKeyStore = async (password: string): Promise<string> => {
    assertNotEmpty(password, "Password to encrypt should not be empty");

    const keystore = await keystoreFromPrivateKey(this.privateKey, password, { n: 1 << 10 });
    return JSON.stringify(keystore);
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

export default Account;