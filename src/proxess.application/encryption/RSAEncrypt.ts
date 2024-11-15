import * as forge from 'node-forge';
import {
  IRSAEncrypt,
  IRSAEncryptApplication,
  IRSAPrivateKey,
  IRSAPublicKey,
  RSA_BITS,
  RSA_PROTOCOL,
} from '@/proxess.domain/encryption/RSAEncrypt';

export class RSAEncryptApplication implements IRSAEncryptApplication {
  /**
   * Generate a pair of keys, one public and one private. The public key can be used to encrypt the text and the private key can be used to decrypt it.
   * @returns A pair of keys, one public and one private.
   */
  public async generateRSAKeyPair(): Promise<IRSAEncrypt> {
    try {
      const keyPair = forge.pki.rsa.generateKeyPair({ bits: RSA_BITS });

      const publicPemKey = forge.pki.publicKeyToPem(
        keyPair.publicKey,
      ) as IRSAPublicKey;
      const privatePemKey = forge.pki.privateKeyToPem(
        keyPair.privateKey,
      ) as IRSAPrivateKey;

      return {
        PUBLIC_KEY: publicPemKey,
        PRIVATE_KEY: privatePemKey,
      };
    } catch (error) {
      console.error('Error generating RSA key pair:', error);
      throw new Error('Error generating RSA key pair');
    }
  }

  /**
   * Encrypt a text using the public key.
   * @param publicKey The public key to encrypt the text.
   * @param text The text to encrypt.
   * @returns The encrypted text.
   */
  public async encryptWithPublicKey({
    publicKey,
    text,
  }: {
    publicKey: string;
    text: string;
  }): Promise<string> {
    try {
      const publicKeyPem = forge.pki.publicKeyFromPem(publicKey);
      const encryptedText = publicKeyPem.encrypt(
        forge.util.encodeUtf8(text),
        RSA_PROTOCOL,
      );
      return forge.util.encode64(encryptedText);
    } catch (error) {
      console.error('Error encrypting text with public key:', error);
      throw new Error('Error encrypting text with public key');
    }
  }

  /**
   * Decrypt a text using the private key.
   * @param privateKey The private key to decrypt the text.
   * @param text The text to decrypt.
   * @returns The decrypted text.
   */
  public async decryptWithPrivateKey({
    privateKey,
    text,
  }: {
    privateKey: string;
    text: string;
  }): Promise<string> {
    try {
      const privateKeyPem = forge.pki.privateKeyFromPem(privateKey);
      const encryptedTextBytes = forge.util.decode64(text);
      const unencryptedText = privateKeyPem.decrypt(
        encryptedTextBytes,
        RSA_PROTOCOL,
      );
      return forge.util.decodeUtf8(unencryptedText);
    } catch (error) {
      console.error('Error decrypting text with private key:', error);
      throw new Error('Error decrypting text with private key');
    }
  }

  /**
   * Validate a pair of keys, one public and one private. The public key can be used to encrypt the text and the private key can be used to decrypt it.
   * @param PUBLIC_KEY The public key to validate.
   * @param PRIVATE_KEY The private key to validate.
   * @returns true if the pair of keys is valid and false otherwise.
   */
  public async validateRSAKeyPair({
    PUBLIC_KEY,
    PRIVATE_KEY,
  }: IRSAEncrypt): Promise<boolean> {
    try {
      const publicKey = forge.pki.publicKeyFromPem(PUBLIC_KEY);
      const privateKey = forge.pki.privateKeyFromPem(PRIVATE_KEY);
      const testText = 'test';
      const encryptedText = publicKey.encrypt(
        forge.util.encodeUtf8(testText),
        RSA_PROTOCOL,
      );
      const decryptedText = privateKey.decrypt(encryptedText, RSA_PROTOCOL);
      return forge.util.decodeUtf8(decryptedText) === testText;
    } catch (error) {
      console.error('Error validating RSA key pair:', error);
      throw new Error('Error validating RSA key pair');
    }
  }
}
