import { encrypt, decrypt } from '../utils/encryption';

export class CredentialManager {
  private encryptionKey: string;

  constructor(encryptionKey: string = process.env.ENCRYPTION_KEY || 'default-encryption-key') {
    this.encryptionKey = encryptionKey;
  }

  // Rest of the code remains the same
}