import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

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
