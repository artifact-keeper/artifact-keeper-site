// Copy to clipboard with inline feedback on the button's <span> label (no alerts).
export function copyText(text: string, btn: HTMLElement) {
  const label = btn.querySelector('span');
  const old = label ? label.textContent : '';
  const done = (ok: boolean) => {
    if (!label) return;
    label.textContent = ok ? 'Copied' : 'Select and copy';
    setTimeout(() => { label.textContent = old; }, 1600);
  };
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    ta.remove(); done(ok);
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => done(true), fallback);
  else fallback();
}

/** Wire every <button data-copy="text"> on the page. */
export function bindCopyButtons(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('button[data-copy]').forEach((b) => {
    b.addEventListener('click', () => copyText(b.dataset.copy || '', b));
  });
}
