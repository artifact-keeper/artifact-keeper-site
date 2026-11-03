// Shared GSAP helpers for SVG packets that travel along a path (story prototype, unchanged).
const SVGNS = 'http://www.w3.org/2000/svg';

export function mkPk(parent: Element, red?: boolean) {
  const g = document.createElementNS(SVGNS, 'g'); if (red) g.setAttribute('class', 'red');
  g.innerHTML = '<circle class="halo" r="9"/><circle r="4"/>'; g.setAttribute('opacity', '0'); parent.appendChild(g); return g;
}

export function along(tl: any, path: SVGGeometryElement, el: Element, at: number, dur: number, upTo?: number) {
  const L = path.getTotalLength(), o = { t: 0 }, end = upTo || 1;
  const put = function () { const p = path.getPointAtLength(o.t * L); el.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')'); };
  tl.fromTo(o, { t: 0 }, { t: end, duration: dur, ease: 'power1.inOut', immediateRender: false, onUpdate: put, onStart: put }, at);
  tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.08, immediateRender: false }, at);
  if (!upTo) tl.to(el, { opacity: 0, duration: 0.12 }, at + dur - 0.08);
}
