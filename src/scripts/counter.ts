// @ts-nocheck
// Count-up tween for [data-count] / [data-n] numbers (story prototype, unchanged).
import { gsap } from 'gsap';

export function counter(el, tl, at, dur) {
    var to = Number.parseFloat(el.dataset.count || el.dataset.n), o = { v: 0 }, sfx = el.dataset.suffix || "", comma = el.dataset.fmt === "comma";
    var fmt = function (v) { v = Math.round(v); return (comma ? v.toLocaleString("en-US") : String(v)) + sfx; };
    var tw = { v: to, duration: dur || 1.2, ease: "power2.out", onUpdate: function () { el.textContent = fmt(o.v); }, onComplete: function () { el.textContent = fmt(to); } };
    if (tl) tl.to(o, tw, at); else gsap.to(o, tw);
  }
