import { Test, TestingModule } from '@nestjs/testing';
import { RSAEncryptApplication } from './RSAEncrypt';
import * as forge from 'node-forge';

describe('RSAEncryptApplication', () => {
  let app: TestingModule;
  let rsaEncryptApplication: RSAEncryptApplication;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      providers: [RSAEncryptApplication],
    }).compile();

    rsaEncryptApplication = app.get<RSAEncryptApplication>(
      RSAEncryptApplication,
    );
  });

  describe('generateRSAKeyPair', () => {
    it('should generate a pair of keys', async () => {
      const keyPair = await rsaEncryptApplication.generateRSAKeyPair();
      expect(keyPair).toHaveProperty('PUBLIC_KEY');
      expect(keyPair).toHaveProperty('PRIVATE_KEY');
    });

    it('should throw an error if key generation fails', async () => {
      jest
        .spyOn(forge.pki.rsa, 'generateKeyPair')
        .mockImplementationOnce(() => {
          throw new Error('Key generation failed');
        });

      await expect(rsaEncryptApplication.generateRSAKeyPair()).rejects.toThrow(
        'Error generating RSA key pair',
      );
    });
  });

  describe('encryptWithPublicKey', () => {
    it('should encrypt a text using the public key', async () => {
      const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtIqbXynJRuyL1NOoPFOZ
cmfm6HQRKdXbZhQFDQIqZxPp8BDLP329K0Y8JKVDEPubZGmLVvS0yM/5x8qAnsaO
hz05CYqwAkmNk5l25lhlVE5+rQklfzy/H5BLKRHkRiI8DtwownxLl1iJ87cQpuRk
V+Q0exNCubXAdtsqRGLQn9gnG4S8V7pmd17TZw/Y8bMDuSXggLqSbqrFuD/fONWN
TrGdkgeJdr0kWMgfZe9iVa/OmObK1jeKA+9o4Kjm54UhXtm3RWEaSlVTkO5ItSNc
tFqeINVn5kNZBkp/4vPtwaI/nDaex3Zi91O5jsHPEgmHESbb/Q1/qAFiGyFQeXm+
AQIDAQAB
-----END PUBLIC KEY-----`;
      const text = 'some-text';
      const encryptedText = await rsaEncryptApplication.encryptWithPublicKey({
        publicKey,
        text,
      });
      expect(encryptedText).not.toBe(text);
    });
  });

  describe('decryptWithPrivateKey', () => {
    it('should decrypt a text using the private key', async () => {
      const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAuxu7HY3okWcxpfVJqG/CXiHydBy3qlp40kbY38sIdsbenYkb3+8h/8jhS+kNBCgEku6+hQvp6K47zwkvCUehTwIDAQABAkAa/hyn3lWLSG5WqUS3imvpZY9TJeNvLX8ZosPdwS4W6ElyJS2QLnbl1lkxP1gjv247xGzDl/s9pY+CKCq4oncZAiEA5iI2KmHG8+8wsi+/BfBglVufsJxY5+wfAzRxlU7cgPcCIQDQI4X24otcbRVAi4f2BCdXhK1c5GoX/yoLIreizewkaQIhAKug4ByDh0jtHbgF+8SGHMHG7zVbpMJySj6toffkNHbJAiBzLVUym4aW7N43y36/Sukiaw8sOlHjWZZAd0O7Wcx1EQIhAN53Reprt2UCWuOF/10EJOOQWdo+2ytaqi1NVng4JYgR
-----END RSA PRIVATE KEY-----`;
      const encryptedText = `UtKFnSyQcAkxGKjxeOUkD5/0pFbm1T/i8UC7a0meLxQHjLIQxbCzS1ItFJsmSiu4kShlpXZBdeIX7T5X0voIEg==`;
      const decryptedText = await rsaEncryptApplication.decryptWithPrivateKey({
        privateKey,
        text: encryptedText,
      });
      expect(decryptedText).not.toBe(encryptedText);
    });
  });

  describe('validateRSAKeyPair', () => {
    it('should validate a pair of keys', async () => {
      const publicKey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALsbux2N6JFnMaX1Sahvwl4h8nQct6paeNJG2N/LCHbG3p2JG9/vIf/I4UvpDQQoBJLuvoUL6eiuO88JLwlHoU8CAwEAAQ==
-----END PUBLIC KEY-----`;
      const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAuxu7HY3okWcxpfVJqG/CXiHydBy3qlp40kbY38sIdsbenYkb3+8h/8jhS+kNBCgEku6+hQvp6K47zwkvCUehTwIDAQABAkAa/hyn3lWLSG5WqUS3imvpZY9TJeNvLX8ZosPdwS4W6ElyJS2QLnbl1lkxP1gjv247xGzDl/s9pY+CKCq4oncZAiEA5iI2KmHG8+8wsi+/BfBglVufsJxY5+wfAzRxlU7cgPcCIQDQI4X24otcbRVAi4f2BCdXhK1c5GoX/yoLIreizewkaQIhAKug4ByDh0jtHbgF+8SGHMHG7zVbpMJySj6toffkNHbJAiBzLVUym4aW7N43y36/Sukiaw8sOlHjWZZAd0O7Wcx1EQIhAN53Reprt2UCWuOF/10EJOOQWdo+2ytaqi1NVng4JYgR
-----END RSA PRIVATE KEY-----`;
      const isValid = await rsaEncryptApplication.validateRSAKeyPair({
        PUBLIC_KEY: publicKey,
        PRIVATE_KEY: privateKey,
      });
      expect(isValid).toBe(true);
    });
  });

  describe('Uses cases', () => {
    it('case #1', async () => {
      const { PUBLIC_KEY, PRIVATE_KEY } =
        await rsaEncryptApplication.generateRSAKeyPair();
      const encryptedText = await rsaEncryptApplication.encryptWithPublicKey({
        publicKey: PUBLIC_KEY,
        text: 'test',
      });
      const decryptedText = await rsaEncryptApplication.decryptWithPrivateKey({
        privateKey: PRIVATE_KEY,
        text: encryptedText,
      });
      expect(decryptedText).toBe('test');
    });

    it('case #2', async () => {
      const publicKey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALsbux2N6JFnMaX1Sahvwl4h8nQct6paeNJG2N/LCHbG3p2JG9/vIf/I4UvpDQQoBJLuvoUL6eiuO88JLwlHoU8CAwEAAQ==
-----END PUBLIC KEY-----`;

      const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAuxu7HY3okWcxpfVJqG/CXiHydBy3qlp40kbY38sIdsbenYkb3+8h/8jhS+kNBCgEku6+hQvp6K47zwkvCUehTwIDAQABAkAa/hyn3lWLSG5WqUS3imvpZY9TJeNvLX8ZosPdwS4W6ElyJS2QLnbl1lkxP1gjv247xGzDl/s9pY+CKCq4oncZAiEA5iI2KmHG8+8wsi+/BfBglVufsJxY5+wfAzRxlU7cgPcCIQDQI4X24otcbRVAi4f2BCdXhK1c5GoX/yoLIreizewkaQIhAKug4ByDh0jtHbgF+8SGHMHG7zVbpMJySj6toffkNHbJAiBzLVUym4aW7N43y36/Sukiaw8sOlHjWZZAd0O7Wcx1EQIhAN53Reprt2UCWuOF/10EJOOQWdo+2ytaqi1NVng4JYgR
-----END RSA PRIVATE KEY-----`;

      const encryptedText = await rsaEncryptApplication.encryptWithPublicKey({
        publicKey,
        text: 'test',
      });
      const decryptedText = await rsaEncryptApplication.decryptWithPrivateKey({
        privateKey,
        text: encryptedText,
      });
      expect(decryptedText).toBe('test');
    });
  });
});
