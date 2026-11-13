// Build-time encryption for protected case studies.
//
// The article is encrypted with a key made from CASE_PASSWORD, so the published page holds only
// scrambled text: search engines can't read it, and nobody can without the password. The browser
// makes the same key from the password the visitor types (PasswordGate) and decrypts it.
//
//   key        PBKDF2-SHA256(password, CASE_SALT, CASE_ITERATIONS) → 256 bits
//   payload    base64( 12-byte IV ‖ AES-256-GCM ciphertext ‖ 16-byte tag )
//
// The many iterations make each password guess slow, so a long password is safe against guessing.
// CASE_PASSWORD lives in .env only. It is never put into the site.
import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';

export const CASE_SALT = 'scottrobinson.co.uk/cases/v1';
export const CASE_ITERATIONS = 600_000;

let cachedKey: Buffer | null | undefined;

function caseKey(): Buffer | null {
  if (cachedKey !== undefined) return cachedKey;
  const password = String(import.meta.env.CASE_PASSWORD ?? process.env.CASE_PASSWORD ?? '').trim();
  if (!password) {
    console.warn('[case gate] CASE_PASSWORD is not set, so protected case studies are published without their article.');
    cachedKey = null;
  } else {
    cachedKey = pbkdf2Sync(password, CASE_SALT, CASE_ITERATIONS, 32, 'sha256');
  }
  return cachedKey;
}

/** Encrypt an article's HTML. Returns null when no password is set */
export function encryptArticle(html: string): string | null {
  const key = caseKey();
  if (!key) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([cipher.update(html, 'utf8'), cipher.final(), cipher.getAuthTag()]);
  return Buffer.concat([iv, body]).toString('base64');
}
