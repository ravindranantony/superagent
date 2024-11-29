import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;

export async function encrypt(text: string, key: string): Promise<string> {
  const iv = randomBytes(IV_LENGTH);
  const salt = randomBytes(SALT_LENGTH);
  
  const derivedKey = await deriveKey(key, salt);
  const cipher = createCipheriv(ALGORITHM, derivedKey, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}

export async function decrypt(encryptedText: string, key: string): Promise<string> {
  const data = Buffer.from(encryptedText, 'base64');
  
  const salt = data.slice(0, SALT_LENGTH);
  const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = data.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = data.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  
  const derivedKey = await deriveKey(key, salt);
  const decipher = createDecipheriv(ALGORITHM, derivedKey, iv);
  decipher.setAuthTag(tag);
  
  return decipher.update(encrypted) + decipher.final('utf8');
}

async function deriveKey(key: string, salt: Buffer): Promise<Buffer> {
  // In a real implementation, use a proper key derivation function like PBKDF2
  // This is a simplified version for demonstration
  return Buffer.from(key.slice(0, 32).padEnd(32, '0'));
}