// Copy to clipboard with inline feedback on the button's <span> label (no alerts).
// The site is served over HTTPS (and 127.0.0.1 in dev), so the async Clipboard API is
// always available; when a write is refused, the label tells the reader to select and copy.
export function copyText(text: string, btn: HTMLElement) {
  const label = btn.querySelector('span');
  const old = label ? label.textContent : '';
  const done = (ok: boolean) => {
    if (!label) return;
    label.textContent = ok ? 'Copied' : 'Select and copy';
    setTimeout(() => { label.textContent = old; }, 1600);
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
  else done(false);
}

/** Wire every <button data-copy="text"> on the page. */
export function bindCopyButtons(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('button[data-copy]').forEach((b) => {
    b.addEventListener('click', () => copyText(b.dataset.copy || '', b));
  });
}
