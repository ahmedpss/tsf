/**
 * تشفير بيانات دفترة على الجهاز (AES-256-GCM + PBKDF2-SHA-256).
 * لا تُرسل كلمة المرور أو المفتاح إلى الخادم.
 * هذا الملف يوفر primitives فقط؛ لا تفعّل المزامنة المشفّرة قبل ترحيل مخطط Supabase.
 */
const VERSION = 1;
const ITERATIONS = 310000;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function webCrypto() {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error('التشفير غير مدعوم في هذا الجهاز أو السياق غير آمن');
  }
  return globalThis.crypto;
}

function toBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

export function createEncryptionSalt() {
  const salt = new Uint8Array(16);
  webCrypto().getRandomValues(salt);
  return toBase64(salt);
}

/** اشتقاق مفتاح AES من عبارة مرور المحل؛ الملح ليس سرًا ويمكن مزامنته. */
export async function deriveShopKey(passphrase, saltBase64) {
  if (typeof passphrase !== 'string' || passphrase.length < 12) {
    throw new Error('عبارة التشفير يجب أن تكون 12 حرفًا على الأقل');
  }
  const salt = fromBase64(saltBase64);
  if (salt.length !== 16) throw new Error('ملح التشفير غير صالح');
  const wc = webCrypto();
  const material = await wc.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return wc.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** تشفير JSON مع ربط اختياري لهوية السجل لمنع نقل ciphertext بين السجلات. */
export async function encryptJson(value, key, associatedData = '') {
  const wc = webCrypto();
  const iv = new Uint8Array(12);
  wc.getRandomValues(iv);
  const algorithm = { name: 'AES-GCM', iv, tagLength: 128 };
  if (associatedData) algorithm.additionalData = encoder.encode(String(associatedData));
  const plaintext = encoder.encode(JSON.stringify(value));
  const encrypted = await wc.subtle.encrypt(algorithm, key, plaintext);
  return { v: VERSION, alg: 'A256GCM', iv: toBase64(iv), data: toBase64(new Uint8Array(encrypted)) };
}

export async function decryptJson(envelope, key, associatedData = '') {
  if (!envelope || envelope.v !== VERSION || envelope.alg !== 'A256GCM' || !envelope.iv || !envelope.data) {
    throw new Error('صيغة البيانات المشفّرة غير مدعومة');
  }
  const algorithm = { name: 'AES-GCM', iv: fromBase64(envelope.iv), tagLength: 128 };
  if (associatedData) algorithm.additionalData = encoder.encode(String(associatedData));
  try {
    const plain = await webCrypto().subtle.decrypt(algorithm, key, fromBase64(envelope.data));
    return JSON.parse(decoder.decode(plain));
  } catch {
    throw new Error('تعذّر فك التشفير: عبارة التشفير خاطئة أو البيانات عُدّلت');
  }
}

export const ENCRYPTION_INFO = Object.freeze({ version: VERSION, algorithm: 'AES-256-GCM', kdf: 'PBKDF2-SHA-256', iterations: ITERATIONS });
