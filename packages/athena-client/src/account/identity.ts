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

export interface Identity {
  address: string;
  publicKey: any;
  privateKey: Buffer;
  keyPair: any;
}

/**
 * Create new identity.
 * 
 * @return an new identity
 */
export const newIdentity = async (): Promise<Identity> => {
  const identity = createIdentity();
  return identity;
}

/**
 * Decrypt identity from encrypted one.
 *
 * @param encryptedPrivateKey an encrypted private key
 * @param password a password to decrypt encrypted one
 * 
 * @return a decrypted identity
 */
export const decryptIdentity = async (encryptedPrivateKey: string, password: string): Promise<Identity> => {
  assertNotEmpty(encryptedPrivateKey, "Encrypted private key should not be empty");
  assertNotEmpty(password, "Password to decrypt should not be empty");

  const encryptedBytes = decodePrivateKey(encryptedPrivateKey);
  const decryptedBytes = decryptPrivateKey(encryptedBytes, password);

  return identifyFromPrivateKey(decryptedBytes);
}

/**
 * Encrypt identity with password.
 *
 * @param identity an identity to encrypt
 * @param password a password to encrypt
 * 
 * @return an encrypted identity
 */
export const encryptIdentity = async (identity: Identity, password: string): Promise<string> => {
  assertNotEmpty(identity, "Identity should not be empty");
  assertNotEmpty(password, "Password to encrypt should not be empty");

  const encryptedBytes = encryptPrivateKey(identity.privateKey, password);
  const encryptedEncoded = encodePrivateKey(Buffer.from(encryptedBytes));

  return encryptedEncoded;
}

/**
 * Sign transaction with identity.
 *
 * @param identity an identity to sign
 * @param rawTx a raw transaction
 * 
 * @return a signed transaction
 */
export const signTx = async (identity: Identity, rawTx: any): Promise<any> => {
  assertNotEmpty(identity, "Identity should not be empty");
  assertNotEmpty(rawTx, "Raw tx should not be empty");

  const signedTx = _.cloneDeep(rawTx)
  signedTx.sign = await signTransaction(signedTx, identity.keyPair);
  signedTx.hash = await hashTransaction(signedTx, "base58");
  // TODO : acktsap's hack. there is a bug in signTransaction of @herajs/crypto^0.4.2
  // see also https://github.com/aergoio/herajs/pull/4
  signedTx.amount = rawTx.amount + " aer";
  return signedTx;
} 
