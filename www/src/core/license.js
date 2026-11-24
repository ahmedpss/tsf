// خدمة الترخيص للنسخة المجانية: لا اشتراك ولا قفل ولا تحقق من الخادم.
export const LICENSE_META = [];
export class LicenseError extends Error { constructor() { super(''); this.license = false; } }
export function createLicense({ emit = () => {} } = {}) {
  const state = { status: 'active', readOnly: false, daysLeft: Infinity, until: null, plan: 'free' };
  return {
    async init() { emit(state); return state; },
    compute() { return state; },
    async redeem() { return { ok: false, reason: 'لا يحتاج التطبيق إلى كود تفعيل' }; },
    async gate() { return true; },
    async refreshPlay() { return null; },
    async buyPlay() { return null; },
    get state() { return state; },
    get device() { return 'FREE'; },
    get deviceKey() { return ''; },
    get hasBilling() { return false; },
    guard() {},
  };
}
