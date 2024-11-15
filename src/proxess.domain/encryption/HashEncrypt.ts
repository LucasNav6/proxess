export interface IHashEncrypt {
  hashText(text: string): Promise<string>;
  compareHash(text: string, hash: string): Promise<boolean>;
}

export const SALT_ROUNDS = 5;
