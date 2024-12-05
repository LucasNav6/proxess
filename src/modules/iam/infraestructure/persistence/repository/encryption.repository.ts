import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import * as forge from 'node-forge';

@Injectable()
export class EncryptionRepository {
  private readonly secret = process.env.AES_SECRET;

  // Cifrar texto
  encrypt(plainText: string): string {
    // Cifra el texto y devuelve el resultado en base64
    const encrypted = CryptoJS.AES.encrypt(plainText, this.secret);
    return encrypted.toString(); // Este método ya devuelve base64
  }

  // Descifrar texto
  decrypt(encryptedBase64: string): string {
    // Descifra el texto cifrado en base64
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, this.secret);
    return decrypted.toString(CryptoJS.enc.Utf8); // Convierte el resultado a texto UTF-8 legible
  }
}

@Injectable()
export class RSAEncryptionRepository {
  // Generación de par de claves RSA
  private generateRSAKeyPair() {
    const keypair = forge.pki.rsa.generateKeyPair(2048);
    return keypair;
  }

  // Cifrado RSA con la clave pública
  public encryptWithRSA(publicKey: string, plainText: string): string {
    const publicKeyForge = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = publicKeyForge.encrypt(plainText, 'RSA-OAEP');
    return forge.util.encode64(encrypted); // Devuelve el cifrado en base64
  }

  // Descifrado RSA con la clave privada
  public decryptWithRSA(privateKey: string, encryptedBase64: string): string {
    const privateKeyForge = forge.pki.privateKeyFromPem(privateKey);
    const decrypted = privateKeyForge.decrypt(
      forge.util.decode64(encryptedBase64),
      'RSA-OAEP',
    );
    return decrypted;
  }

  publicKeyToPem(publicKey: forge.pki.PublicKey): string {
    return forge.pki.publicKeyToPem(publicKey);
  }

  // Convertir clave privada a formato PEM
  privateKeyToPem(privateKey: forge.pki.PrivateKey): string {
    return forge.pki.privateKeyToPem(privateKey);
  }

  // Ejemplo de uso de RSA
  generateAndGetKeys() {
    const keypair = this.generateRSAKeyPair();

    const publicKeyPem = this.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = this.privateKeyToPem(keypair.privateKey);

    return {
      publicKey: publicKeyPem,
      privateKey: privateKeyPem,
    };
  }
}
