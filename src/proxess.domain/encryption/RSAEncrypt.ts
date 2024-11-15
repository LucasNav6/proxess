export interface IRSAEncryptApplication {
  generateRSAKeyPair(): Promise<IRSAEncrypt>;
  encryptWithPublicKey({
    publicKey,
    text,
  }: {
    publicKey: IRSAPublicKey;
    text: string;
  }): Promise<string>;
  decryptWithPrivateKey({
    privateKey,
    text,
  }: {
    privateKey: IRSAPrivateKey;
    text: string;
  }): Promise<string>;
  validateRSAKeyPair({
    PUBLIC_KEY,
    PRIVATE_KEY,
  }: IRSAEncrypt): Promise<boolean>;
}

export type IRSAEncrypt = {
  PUBLIC_KEY: string;
  PRIVATE_KEY: string;
};

export type IRSAPublicKey = '--------BEGIN PUBLIC KEY-----\n' &
  string &
  '\n---------END PUBLIC KEY-----';

export type IRSAPrivateKey = '-----BEGIN RSA PRIVATE KEY-----\n' &
  string &
  '\n-----END RSA PRIVATE KEY-----';

export const RSA_BITS = 2048;
export const RSA_PROTOCOL = 'RSA-OAEP';
