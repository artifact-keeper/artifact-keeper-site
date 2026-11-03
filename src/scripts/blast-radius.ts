// @ts-nocheck
// Chapter 1: blast-radius console and rail (story prototype, unchanged). One instance per page
// (it is addressed by id); used on / and /security/. Call initBlastRadius(reduce) once.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { counter } from './counter';
const d = document;
const $ = (s, c) => (c || d).querySelector(s);
const $$ = (s, c) => Array.prototype.slice.call((c || d).querySelectorAll(s));

export function initBlastRadius(reduce) {
  /* ---------- blast-radius rail state ---------- */
  var railItems = $$("#rail li"), railFill = $("#rail .fill");
  function setStep(n) {
    railItems.forEach(function (li, i) { li.classList.toggle("on", i === n); li.classList.toggle("done", i < n); });
    if (railFill) railFill.style.transform = "scaleY(" + (n / 4) + ")";
  }

  if (reduce) { setStep(4); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- CHAPTER 1: blast radius console ---------- */
  /* Sticky console inside a tall track; one scrubbed ScrollTrigger on the track drives the five beats.
     The console is never empty: the CVE is mid-typing at progress 0, tiles and lists show skeletons until their beat. */
  ScrollTrigger.config({ ignoreMobileResize: true });
  var BEATS = [0, 1.6, 3.2, 4.7, 6.2];
  function buildBlast(tl) {
    var cve = $("#cve"), full = cve.textContent, t = { n: 4 };
    var typed = function () { cve.textContent = full.slice(0, Math.round(t.n)); };
    tl.addLabel("b1", 0);
    tl.fromTo(t, { n: 4 }, { n: full.length, duration: 0.9, ease: "none", onUpdate: typed, onStart: typed }, 0);
    typed();
    tl.fromTo(".cs-go", { opacity: 0.45 }, { opacity: 1, duration: 0.15 }, 0.9);
    tl.fromTo("#req", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.95);
    /* beat 2: skeleton dashes give way to counted values */
    tl.addLabel("b2", BEATS[1]);
    tl.fromTo("#tiles .skel", { opacity: 1 }, { opacity: 0, duration: 0.25, stagger: 0.08 }, BEATS[1]);
    tl.fromTo("#tiles .v", { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.08 }, BEATS[1] + 0.05);
    $$("#tiles .v[data-n]").forEach(function (el, i) { counter(el, tl, BEATS[1] + 0.1 + i * 0.08, 0.9); });
    tl.fromTo("#tiles .tile.alert", { borderColor: "rgba(27,58,97,1)" }, { borderColor: "rgba(248,113,113,.45)", duration: 0.3 }, BEATS[1] + 0.9);
    tl.fromTo("#tiles .tile.alert", { x: 0 }, { x: 5, duration: 0.05, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, BEATS[1] + 1.25);
    /* beat 3: repositories */
    tl.addLabel("b3", BEATS[2]);
    tl.fromTo("#repos .sk", { opacity: 1 }, { opacity: 0, duration: 0.25 }, BEATS[2]);
    tl.fromTo("#repos .repo", { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.2 }, BEATS[2] + 0.1);
    tl.fromTo("#repos .repo .pill", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.2, ease: "back.out(3)" }, BEATS[2] + 0.4);
    tl.fromTo("#repos .legend > div", { opacity: 0.22 }, { opacity: 1, duration: 0.3, stagger: 0.12 }, BEATS[2] + 0.75);
    /* beat 4: downloaders */
    tl.addLabel("b4", BEATS[3]);
    tl.fromTo("#dl .sk", { opacity: 1 }, { opacity: 0, duration: 0.25 }, BEATS[3]);
    tl.fromTo("#dl thead, #dl tbody tr", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.28 }, BEATS[3] + 0.1);
    tl.fromTo("#dl .cs-foot", { opacity: 0 }, { opacity: 1, duration: 0.3 }, BEATS[3] + 1.2);
    /* beat 5: actions light up (dim placeholders before) */
    tl.addLabel("b5", BEATS[4]);
    tl.fromTo("#acts .act", { opacity: 0.28, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.18, ease: "back.out(2)" }, BEATS[4]);
    tl.fromTo("#acts .cap", { opacity: 0.3 }, { opacity: 1, duration: 0.4 }, BEATS[4] + 0.6);
    tl.to({}, { duration: 0.6 }, BEATS[4] + 1.0);
    tl.eventCallback("onUpdate", function () {
      var tt = tl.time(), n = 0;
      for (var i = 0; i < BEATS.length; i++) if (tt >= BEATS[i] - 0.05) n = i;
      setStep(n);
    });
    return function () { cve.textContent = full; setStep(4); };
  }
  var track = $("#brtrack"), brEl = $("#br"), nav = $("#nav");
  var mm = gsap.matchMedia();
  mm.add({ scrolly: "(min-width: 1024px) and (min-height: 760px)", flat: "not all and (min-width: 1024px) and (min-height: 760px)" }, function (ctx) {
    var tl = gsap.timeline({ paused: true });
    var cleanup = buildBlast(tl), st, done = false, moved = false, lastScroll = 0, timer = null, io = null;
    setStep(0);
    var finish = function () {
      if (done) { return; }
      done = true;
      if (st) st.kill();
      track.classList.remove("scrolly");
      tl.progress(1).pause();
      setStep(4);
      ScrollTrigger.refresh();
    };
    var onScrollEv = function () { lastScroll = Date.now(); };
    window.addEventListener("scroll", onScrollEv, { passive: true });
    if (ctx.conditions.scrolly) {
      track.classList.add("scrolly");
      st = ScrollTrigger.create({
        trigger: track,
        start: function () { return "top top+=" + (nav.offsetHeight + 20); },
        end: function () { return "+=" + Math.max(1, track.offsetHeight - brEl.offsetHeight); },
        scrub: 0.6, animation: tl,
        onUpdate: function (self) { if (self.progress > 0) moved = true; }
      });
    } else {
      st = ScrollTrigger.create({ trigger: "#console", start: "top 70%", once: true, onEnter: function () { moved = true; tl.play(0); } });
    }
    /* Fallback: a host that reports no scroll. Once the section is on screen, give it 2s to show any
       scroll event or progress change; otherwise show the final state. */
    if (!window.innerHeight) finish();
    else if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting || done || timer) return;
        var t0 = Date.now();
        timer = setTimeout(function () {
          timer = null;
          var scrolled = lastScroll >= t0 - 250;
          if (!moved && !scrolled) finish();
        }, 2000);
      });
      io.observe(track.closest("section") || track);
    }
    return function () {
      window.removeEventListener("scroll", onScrollEv);
      if (timer) clearTimeout(timer);
      if (io) io.disconnect();
      track.classList.remove("scrolly");
      cleanup();
    };
  });
}
