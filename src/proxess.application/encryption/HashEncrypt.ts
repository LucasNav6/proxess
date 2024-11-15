import { IHashEncrypt } from '@/proxess.domain/encryption/HashEncrypt';
import * as CryptoJS from 'crypto-js';

export class HashEncrypt implements IHashEncrypt {
  public async hashText(text: string): Promise<string> {
    return CryptoJS.MD5(text).toString();
  }

  public async compareHash(text: string, hash: string): Promise<boolean> {
    const hashedText = CryptoJS.MD5(text).toString();
    return hashedText === hash;
  }
}
