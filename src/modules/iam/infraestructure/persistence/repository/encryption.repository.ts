export class EncryptionRepository {
  public async hashText(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const BUFFER_CODE = encoder.encode(text);
    const HASH_BUFFER_CODE = await crypto.subtle.digest('SHA-256', BUFFER_CODE);
    const BASE64_HASH_TEXT = Buffer.from(HASH_BUFFER_CODE).toString('base64');
    return BASE64_HASH_TEXT;
  }
}
