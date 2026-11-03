// @ts-nocheck
// Chapter 2: the six-gates pipeline animation and gate-card flashes (story prototype, unchanged), used on /security/.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const d = document;
const $ = (s, c) => (c || d).querySelector(s);
const $$ = (s, c) => Array.prototype.slice.call((c || d).querySelectorAll(s));

export function initGates() {
  gsap.registerPlugin(ScrollTrigger);
  /* ---------- CHAPTER 2: gates pipeline ---------- */
  (function () {
    var NS = "http://www.w3.org/2000/svg", gpk = $("#gpk");
    var X = $$("#gnodes .gn").map(function (g) { return parseFloat(g.getAttribute("transform").match(/translate\(([\d.]+)/)[1]); });
    var SPEED = 360, tl = gsap.timeline({ paused: true });
    var mk = function (red) {
      var g = d.createElementNS(NS, "g"); g.setAttribute("class", "pk");
      g.innerHTML = '<circle class="halo" r="11"/><circle r="5"/>';
      if (red) { g.querySelector(".halo").style.fill = "rgba(248,113,113,.25)"; g.lastChild.style.fill = "#F87171"; }
      g.setAttribute("transform", "translate(" + X[0] + " 56)"); g.style.opacity = 0; gpk.appendChild(g); return g;
    };
    var logIn = function (g, at) {
      tl.from('#glog li[data-g="' + g + '"]', { opacity: 0, x: -10, duration: 0.35, ease: "power2.out" }, at);
      tl.fromTo('#glog li[data-g="' + g + '"]', { backgroundColor: "rgba(8,124,244,.22)" }, { backgroundColor: "rgba(8,124,244,0)", duration: 1.2, immediateRender: false }, at);
    };
    var cardFlash = function (g, cls, at) {
      var c = $('#gatecards .gate[data-g="' + g + '"]');
      tl.call(function () { c.classList.add(cls); }, null, at);
      tl.call(function () { c.classList.remove(cls); }, null, at + 1.4);
    };
    tl.fromTo("#trackfill", { scaleX: 0, svgOrigin: "70 56" }, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 0);
    tl.from("#gnodes .gn", { opacity: 0, scale: 0.6, transformOrigin: "50% 50%", duration: 0.4, stagger: 0.07, ease: "back.out(2)" }, 0);
    function pass(start, logs) {
      var p = mk(false), dur = (X[7] - X[0]) / SPEED;
      tl.set(p, { opacity: 1 }, start);
      tl.fromTo(p, { x: X[0], y: 56 }, { x: X[7], duration: dur, ease: "none" }, start);
      var tScan = start + (X[3] - X[0]) / SPEED;
      tl.to(p.lastChild, { fill: "#34D399", duration: 0.2 }, tScan);
      tl.to(p.firstChild, { fill: "rgba(52,211,153,.25)", duration: 0.2 }, tScan);
      if (logs) { logIn(3, tScan); cardFlash(3, "pass", tScan); var tPro = start + (X[6] - X[0]) / SPEED; logIn(6, tPro); cardFlash(6, "pass", tPro); }
      tl.to(p, { opacity: 0, duration: 0.25 }, start + dur);
      tl.fromTo("#gnodes .gn.end:last-child .b", { attr: { r: 24 } }, { attr: { r: 28 }, duration: 0.18, yoyo: true, repeat: 1, immediateRender: false }, start + dur - 0.05);
    }
    function refuse(start, gi) {
      var p = mk(true), stop = X[gi] - 32, dur = (stop - X[0]) / SPEED, at = start + dur;
      var node = $$("#gnodes .gn")[gi];
      tl.set(p, { opacity: 1 }, start);
      tl.fromTo(p, { x: X[0], y: 56 }, { x: stop, duration: dur, ease: "none" }, start);
      tl.fromTo(p, { x: stop }, { x: stop + 6, duration: 0.05, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, at);
      tl.fromTo(node.querySelector(".ring"), { opacity: 1, scale: 1, transformOrigin: "50% 50%" }, { opacity: 0, scale: 1.7, duration: 0.6, ease: "power2.out", immediateRender: false }, at);
      tl.to(p, { y: 100, opacity: 0, duration: 0.5, ease: "power2.in" }, at + 0.32);
      logIn(gi, at); cardFlash(gi, "hit", at);
    }
    pass(0.6, true);
    refuse(1.1, 1);
    refuse(1.6, 2);
    refuse(2.1, 4);
    refuse(2.6, 5);
    pass(3.4, false);
    ScrollTrigger.create({ trigger: "#pipe", start: "top 65%", once: true, onEnter: function () { tl.play(0); } });
  })();
}
