// @ts-nocheck
// Use-case strip animation (story prototype, chapter 3), used on /use-cases/.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mkPk, along } from './svg-packets';

const $ = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));

/** Scrubbed stage-bar timeline for every .uc strip on the page. Call after checking reduced motion. */
export function initUseCaseStrips() {
  gsap.registerPlugin(ScrollTrigger);
  $$(".uc").forEach(function (uc) {
    var svg = $(".uc-svg", uc), pk = $(".upk", svg), wires = $$(".uw", svg), nodes = $$(".us", svg), labels = $$(".ul", uc);
    var tl = gsap.timeline({ paused: true });
    var x0 = Number.parseFloat($(".ubar", svg).getAttribute("x1")), y0 = Number.parseFloat($(".ubar", svg).getAttribute("y1"));
    tl.fromTo($(".ubar-fill", svg), { scaleX: 0, svgOrigin: x0 + " " + y0 }, { scaleX: 1, duration: 4.6, ease: "none" }, 0.4);
    nodes.forEach(function (n, i) {
      var at = i * 1.1, w = wires[i];
      tl.fromTo(w, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, at);
      tl.from(labels[i], { opacity: 0.15, y: 10, duration: 0.4, ease: "power2.out" }, at + 0.1);
      tl.fromTo($(".uhub .ring", svg), { opacity: 0.8, scale: 1 }, { opacity: 0, scale: 1.6, duration: 0.6, immediateRender: false }, at);
      along(tl, w, mkPk(pk), at + 0.15, 0.7);
      along(tl, w, mkPk(pk), at + 0.4, 0.7);
      if (n.classList.contains("rf")) {
        var r = mkPk(pk, true), hit = at + 0.55 + 0.75;
        along(tl, w, r, at + 0.55, 0.75, 0.93);
        tl.fromTo(r, { x: 0 }, { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, hit);
        tl.to(r, { y: 26, opacity: 0, duration: 0.4, ease: "power2.in" }, hit + 0.3);
        tl.fromTo($(".ring", n), { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.9, duration: 0.6, immediateRender: false }, hit);
        var ref = $(".refusal", labels[i]);
        tl.from(ref, { opacity: 0, scale: 0.7, duration: 0.3, ease: "back.out(2.5)" }, hit);
        tl.fromTo(ref, { x: 0 }, { x: 4, duration: 0.05, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, hit + 0.3);
      }
      tl.from($(".on", n), { scale: 0, duration: 0.3, ease: "back.out(2.5)" }, at + 0.85);
      tl.from($(".ok", n), { opacity: 0, duration: 0.2 }, at + 1.0);
    });
    tl.from($$(".uc-stats div", uc), { opacity: 0, y: 14, duration: 0.4, stagger: 0.12 }, 5.4);
    tl.to({}, { duration: 0.4 }, 6.0);
    ScrollTrigger.create({ trigger: $(".uc-stage", uc), start: "top 88%", end: "bottom 62%", scrub: 0.6, animation: tl });
  });
}
