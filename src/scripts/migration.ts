// @ts-nocheck
// Migration flow diagram and stage bar (story prototype, chapter 6), used on /migrate/.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mkPk, along } from './svg-packets';

const $ = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));

export function initMigration() {
  gsap.registerPlugin(ScrollTrigger);
  /* ---------- CHAPTER 6: migration flow ---------- */
  (function () {
    var svg = $("#migflow"); if (!svg) return;
    var pk = $(".mpk", svg), w = $$(".mwires path", svg), tl = gsap.timeline({ paused: true });
    tl.fromTo(w, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }, 0);
    for (var i = 0; i < 4; i++) { along(tl, w[0], mkPk(pk), 0.6 + i * 0.3, 0.8); along(tl, w[1], mkPk(pk), 0.75 + i * 0.3, 0.8); }
    [1.4, 1.7, 2.0, 2.3].forEach(function (t) { tl.fromTo($(".mhub .ring", svg), { opacity: 0.8, scale: 1 }, { opacity: 0, scale: 1.6, duration: 0.5, immediateRender: false }, t); });
    for (var j = 0; j < 3; j++) along(tl, w[2], mkPk(pk), 2.2 + j * 0.3, 0.5);
    tl.from($(".mver .b", svg), { scale: 0.3, opacity: 0.3, duration: 0.4, ease: "back.out(2.5)" }, 2.8);
    tl.from($(".mver .ok", svg), { opacity: 0, duration: 0.25 }, 3.0);
    for (var k = 0; k < 3; k++) along(tl, w[3], mkPk(pk), 3.2 + k * 0.25, 0.45);
    ScrollTrigger.create({ trigger: svg, start: "top 75%", once: true, onEnter: function () { tl.play(0); } });
  })();

  /* ---------- CHAPTER 5: migration stage bar ---------- */
  (function () {
    var tl = gsap.timeline({ paused: true }), dots = $$("#stages .dot");
    tl.fromTo("#stages .bar i", { scaleX: 0 }, { scaleX: 1, duration: 2.1, ease: "power1.inOut" }, 0.2);
    dots.forEach(function (dt, i) { tl.from(dt, { scale: 0.45, opacity: 0.2, duration: 0.35, ease: "back.out(2.5)" }, 0.1 + i * 0.7); });
    tl.from(".steps li", { opacity: 0, x: -14, duration: 0.45, stagger: 0.7, ease: "power2.out" }, 0.1);
    tl.from(".cmp-tbl tbody tr", { opacity: 0, y: 8, duration: 0.35, stagger: 0.06 }, 0.6);
    ScrollTrigger.create({ trigger: "#migrate", start: "top 55%", once: true, onEnter: function () { tl.play(0); } });
  })();
}
