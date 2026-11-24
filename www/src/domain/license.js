// ترخيص النسخة المجانية: استخدام دائم بلا تجربة أو اشتراك أو كود تفعيل.
export const TRIAL_DAYS = 0;
export const GRACE_DAYS = 0;
export const PRICES = Object.freeze({ monthly: 0, yearly: 0 });
export const PLAN_LABEL = Object.freeze({ free: 'مجاني', monthly: 'مجاني', yearly: 'مجاني', trial: 'مجاني', m: 'مجاني', y: 'مجاني' });
export const LICENSE_PREFIX = 'DCS-';
export const SIGN_CONTEXT = 'cashier-license-v1|';
export const LOCKED_TABLES = Object.freeze([]);
export function trustedNow(now) { return now; }
export function licenseState() { return { status: 'active', readOnly: false, daysLeft: Infinity, until: null, plan: 'free' }; }
export function deviceCode(hex) { return String(hex || '').replace(/[^0-9a-f]/gi, '').slice(0, 16) || 'مجاني'; }
export function codePayload({ device, expires, plan }) { return `${device}|${expires}|${plan}`; }
export function makeCode() { return ''; }
export function extractCode() { return null; }
export function unb64(str) { return Uint8Array.from(atob(str.trim()), c => c.charCodeAt(0)); }
export function verifyCode() { return { ok: false, reason: 'لا يحتاج التطبيق إلى كود تفعيل' }; }
export function subscribeMessage() { return 'دفترة كاشير — النسخة المجانية'; }
