// شاشة معلومات النسخة المجانية الدائمة.
import { h } from '../../ui/dom.js';
import { header } from '../../ui/components.js';

export function statusText() { return { tone: 'ok', title: 'دفترة كاشير — مجاني دائمًا', sub: 'جميع الوظائف متاحة دون اشتراك أو كود تفعيل' }; }
export function licenseBanner() { return null; }
export function renderSubscribe(el) {
  el.append(header('النسخة المجانية', { back: true }), h('div', { class: 'page' },
    h('div', { class: 'card lic-status lic-ok' }, h('strong', null, 'دفترة كاشير مجاني دائمًا'), h('p', null, 'لا توجد تجربة محدودة أو اشتراكات أو أكواد تفعيل. البيع والإضافة والتعديل متاحة باستمرار.'))));
  return () => {};
}
