// @ts-nocheck
// SVG markup generators for the landing page (ported from the story prototype's build script).
// Every function returns an HTML string that the components render with set:html.
import { marqueeRows, type Format } from '../data/formats';
import { LAB_NOTE as NOTE } from '../data/use-cases';
import shieldSrc from '../assets/logo.svg?raw';

const logoFiles = import.meta.glob('../assets/format-logos/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const logoSrc: Record<string, string> = {};
const hex: Record<string, string> = {};
for (const [p, src] of Object.entries(logoFiles)) {
  const slug = p.split('/').pop()!.replace(/\.svg$/, '');
  logoSrc[slug] = src;
  const m = /<svg[^>]*\sfill="(#[0-9A-Fa-f]{6})"/.exec(src);
  if (!m) throw new Error(`format logo ${slug} has no brand fill`);
  hex[slug] = m[1];
}
const strip_ = (s: string) => s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/, '');

function lum(h) {
  const c = h.replace('#', '').match(/../g).map(x => Number.parseInt(x, 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// A logo sits on a white tile unless its colour is too pale for white; then on a navy tile.
function tileFor(slug) { return contrast(hex[slug], '#FFFFFF') < 1.8 ? 'dk' : 'lt'; }
function logo(slug, cls = '') {
  return `<svg class="lg ${cls}" viewBox="0 0 24 24" aria-hidden="true" style="fill:${hex[slug]}"><use href="#i-${slug}"/></svg>`;
}


// ---------- formats marquee (src/data/formats.ts) ----------
const chip = (f: Format) => f.logo
  ? `<li class="fmt"><span class="ftile ${tileFor(f.logo)}">${logo(f.logo)}</span><span>${f.name}</span></li>`
  : `<li class="fmt"><span class="ftile tx">${f.tile}</span><span>${f.name}</span></li>`;
const marqueeRow = (items, dir) => `<div class="mq-row ${dir}"><ul class="mq-track">${items.map(chip).join('')}</ul><ul class="mq-track dup" aria-hidden="true">${items.map(chip).join('')}</ul></div>`;
// ---------- hero graph ----------
const sources = [
  ['npmjs.org', 'npm registry', 'npm'], ['pypi.org', 'Python packages', 'pypi'], ['Maven Central', 'JVM libraries', 'apachemaven'],
  ['Docker Hub', 'container images', 'docker'], ['huggingface.co', 'models and datasets', 'huggingface'],
];
const icons = {
  ci: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7.5 10l3 2-3 2M12.5 15h4"/>',
  k8s: '<path d="M12 2.6l8.2 4.7v9.4L12 21.4l-8.2-4.7V7.3z"/><circle cx="12" cy="12" r="3"/><path d="M12 5.5V9M12 15v3.5M6.4 8.8l3 1.7M14.6 13.5l3 1.7M6.4 15.2l3-1.7M14.6 10.5l3-1.7"/>',
  laptop: '<rect x="5" y="5.5" width="14" height="9.5" rx="1.5"/><path d="M2.5 18.5h19"/>',
  globe: '<circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c3.2 3.6 3.2 13.6 0 17.2M12 3.4c-3.2 3.6-3.2 13.6 0 17.2"/>',
};
const consumers = [
  ['CI runners', 'builds and tests', 'ci'], ['Kubernetes clusters', 'image pulls', 'k8s'],
  ['Developer laptops', 'npm, pip, cargo', 'laptop'], ['Edge peer', 'another region', 'globe'],
];
function packet(id, dur, begin, red = false) {
  if (red) {
    return `<g class="pkt red" opacity="0"><circle r="9" class="halo"/><circle r="4.2"/>
<animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" keyPoints="0;0.93;0.93" keyTimes="0;0.7;1" calcMode="linear"><mpath href="#${id}"/></animateMotion>
<animate attributeName="opacity" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.05;0.7;0.82;1"/>
<animateTransform attributeName="transform" type="translate" additive="sum" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" values="0 0;0 0;-3 0;3 0;-3 0;0 0;0 0" keyTimes="0;0.7;0.73;0.76;0.79;0.82;1"/></g>`;
  }
  return `<g class="pkt" opacity="0"><circle r="8" class="halo"/><circle r="3.6"/>
<animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite"><mpath href="#${id}"/></animateMotion>
<animate attributeName="opacity" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.08;0.9;1"/></g>`;
}
function heroWide() {
  const W = 1200, H = 470, hx = 600, hy = 235;
  const sy = sources.map((_, i) => 55 + i * 90);
  const cy = consumers.map((_, i) => 82 + i * 102);
  let wires = '', pk = '', tiles = '';
  sources.forEach((s, i) => {
    const y = sy[i];
    wires += `<path id="wl${i}" pathLength="1" class="wire" d="M300 ${y} C 420 ${y}, 440 ${hy}, 528 ${hy}"/>`;
    tiles += `<g class="node" transform="translate(40 ${y - 30})"><rect width="260" height="60" rx="14"/><g transform="translate(12 12)"><rect class="lgbg ${tileFor(s[2])}" width="36" height="36" rx="9"/>${logo(s[2]).replace('<svg class="lg "', '<svg class="lg" x="7" y="7" width="22" height="22"')}</g><text x="62" y="27" class="n1">${s[0]}</text><text x="62" y="45" class="n2">${s[1]}</text></g>`;
  });
  consumers.forEach((c, i) => {
    const y = cy[i];
    wires += `<path id="wr${i}" pathLength="1" class="wire" d="M672 ${hy} C 760 ${hy}, 780 ${y}, 900 ${y}"/>`;
    tiles += `<g class="node" transform="translate(900 ${y - 30})"><rect width="260" height="60" rx="14"/><g transform="translate(12 12)"><rect class="icbg" width="36" height="36" rx="9"/><svg x="6" y="6" width="24" height="24" viewBox="0 0 24 24" class="ic">${icons[c[2]]}</svg></g><text x="62" y="27" class="n1">${c[0]}</text><text x="62" y="45" class="n2">${c[1]}</text></g>`;
  });
  // packets: each left wire 2 packets, each right wire 2 packets, plus one refused red packet
  [0, 1, 2, 3, 4].forEach(i => { pk += packet('wl' + i, 2.6, -(i * 0.9)); pk += packet('wl' + i, 2.6, -(i * 0.9 + 1.3)); });
  [0, 1, 2, 3].forEach(i => { pk += packet('wr' + i, 2.4, -(i * 0.7 + 0.4)); pk += packet('wr' + i, 2.4, -(i * 0.7 + 1.6)); });
  pk += packet('wl1', 4.2, -1.1, true);
  return `<svg class="graph wide" viewBox="0 0 ${W} ${H}" role="img" aria-label="Upstream registries (npmjs.org, pypi.org, Maven Central, Docker Hub, huggingface.co) flow through the Artifact Keeper hub to CI runners, Kubernetes clusters, developer laptops and an edge peer in another region.">
<text x="40" y="14" class="colh">UPSTREAM</text><text x="1160" y="14" class="colh" text-anchor="end">CONSUMERS</text>
<g class="wires">${wires}</g><g class="packets">${pk}</g>${tiles}
<g class="hub" transform="translate(${hx} ${hy})"><circle r="190" fill="url(#hubglow)" class="glow"/><circle r="84" class="ring"/><circle r="84" class="ring r2"/><circle r="74" class="disc"/><svg x="-52" y="-52" width="104" height="104" viewBox="0 0 512 512"><use href="#ak-shield"/></svg><text y="112" text-anchor="middle" class="hubt">ARTIFACT KEEPER</text></g>
</svg>`;
}
function heroTall() {
  const W = 360, H = 520, hx = 180, hy = 250;
  const sx = sources.map((_, i) => 36 + i * 72);
  const cx = consumers.map((_, i) => 45 + i * 90);
  let wires = '', pk = '', tiles = '';
  sources.forEach((s, i) => {
    const x = sx[i];
    wires += `<path id="tl${i}" pathLength="1" class="wire" d="M${x} 82 C ${x} 150, ${hx} 140, ${hx} 196"/>`;
    tiles += `<g class="node" transform="translate(${x - 26} 30)"><rect class="lgbg ${tileFor(s[2])}" width="52" height="52" rx="13"/>${logo(s[2]).replace('<svg class="lg "', '<svg class="lg" x="12" y="12" width="28" height="28"')}</g>`;
  });
  consumers.forEach((c, i) => {
    const x = cx[i];
    wires += `<path id="tr${i}" pathLength="1" class="wire" d="M${hx} 304 C ${hx} 360, ${x} 350, ${x} 412"/>`;
    tiles += `<g class="node" transform="translate(${x - 26} 412)"><rect width="52" height="52" rx="13"/><svg x="13" y="13" width="26" height="26" viewBox="0 0 24 24" class="ic">${icons[c[2]]}</svg><text x="26" y="72" text-anchor="middle" class="n3">${c[0].split(' ')[0]}</text><text x="26" y="86" text-anchor="middle" class="n3">${c[0].split(' ').slice(1).join(' ')}</text></g>`;
  });
  [0, 1, 2, 3, 4].forEach(i => { pk += packet('tl' + i, 2.2, -(i * 0.8)); });
  [0, 1, 2, 3].forEach(i => { pk += packet('tr' + i, 2.2, -(i * 0.6 + 0.5)); pk += packet('tr' + i, 2.2, -(i * 0.6 + 1.6)); });
  pk += packet('tl2', 3.8, -0.8, true);
  return `<svg class="graph tall" viewBox="0 0 ${W} ${H}" role="img" aria-label="Upstream registries flow through the Artifact Keeper hub to CI runners, Kubernetes clusters, developer laptops and an edge peer.">
<text x="${W / 2}" y="16" class="colh" text-anchor="middle">UPSTREAM</text>
<g class="wires">${wires}</g><g class="packets">${pk}</g>${tiles}
<g class="hub" transform="translate(${hx} ${hy})"><circle r="130" fill="url(#hubglow2)" class="glow"/><circle r="58" class="ring"/><circle r="58" class="ring r2"/><circle r="52" class="disc"/><svg x="-36" y="-36" width="72" height="72" viewBox="0 0 512 512"><use href="#ak-shield"/></svg></g>
<defs><radialGradient id="hubglow2"><stop offset="0" stop-color="#087CF4" stop-opacity=".55"/><stop offset=".45" stop-color="#06D6E9" stop-opacity=".12"/><stop offset="1" stop-color="#06D6E9" stop-opacity="0"/></radialGradient></defs>
</svg>`;
}


// ---------- gates pipeline ----------
const gx = i => Math.round(70 + i * (1060 / 7));
const gic = {
  up: '<path d="M7 18a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.6A3.8 3.8 0 0 1 17.5 18z"/>',
  age: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/>',
  cur: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
  scan: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  pol: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
  qg: '<path d="M4 20V10M10 20V4M16 20v-7"/>',
  pro: '<path d="M12 20V5M6 11l6-6 6 6"/>',
  out: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
};
const gates = [['Upstream', '', 'up', 1], ['Age gate', '01', 'age'], ['Curation', '02', 'cur'], ['Scan', '03', 'scan'], ['Policy', '04', 'pol'], ['Quality gate', '05', 'qg'], ['Promote', '06', 'pro'], ['Your builds', '', 'out', 1]];
export const PIPE = '<g id="gnodes">' + gates.map(([n, idx, ic, end], i) => {
  const idxTag = idx ? '<text class="idx" y="78" text-anchor="middle">GATE ' + idx + '</text>' : '';
  return `<g class="gn${end ? ' end' : ''}" data-i="${i}" transform="translate(${gx(i)} 56)"><circle class="ring" r="24"/><circle class="b" r="24"/><svg x="-10" y="-10" width="20" height="20" viewBox="0 0 24 24" class="ic">${gic[ic]}</svg><text y="58" text-anchor="middle">${n}</text>${idxTag}</g>`;
}).join('') + '</g>';

// ---------- use-case strips ----------
const SX = i => 300 + i * 200, HY = 122, HX = 92;
function strip(c) {
  let wires = '', nodes = '';
  c.stages.forEach((st, i) => {
    const x = SX(i), h = 16 + (x - HX) * 0.055;
    wires += `<path class="uw" id="${c.id}w${i}" pathLength="1" d="M${HX + 40} ${HY - 14} C ${HX + 90} ${HY - 14 - h * 1.4}, ${x - 60} ${HY - 18 - h * 1.4}, ${x} ${HY - 17}"/>`;
    nodes += `<g class="us${i === c.refuse ? ' rf' : ''}" transform="translate(${x} ${HY})"><circle class="ring" r="17"/><circle class="b" r="17"/><circle class="on" r="17"/><path class="ok" d="M-6 0l4 4 8-9"/></g>`;
  });
  const refusal = '<em class="refusal"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>' + c.refuseText + '</em>';
  const labels = c.stages.map((st, i) => `<div class="ul${i === c.refuse ? ' rf' : ''}" style="left:${(SX(i) / 1200 * 100).toFixed(3)}%"><b>${String(i + 1)} · ${st[0]}</b><span>${st[1]}</span>${i === c.refuse ? refusal : ''}</div>`).join('');
  return `<article class="uc" id="${c.slug}">
  <div class="screen uc-screen">
    <div class="screen-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="crumb">use case ${c.n} <span aria-hidden="true">/</span> <b>${c.title}</b></span><span class="right"><span class="pill grey">${c.slug}</span></span></div>
    <div class="uc-stage">
      <svg class="uc-svg" viewBox="0 0 1200 150" aria-hidden="true">
        <line class="ubar" x1="${SX(0)}" y1="${HY}" x2="${SX(4)}" y2="${HY}"/><line class="ubar-fill" x1="${SX(0)}" y1="${HY}" x2="${SX(4)}" y2="${HY}"/>
        <g class="uwires">${wires}</g><g class="upk"></g>
        <g class="uhub" transform="translate(${HX} ${HY - 10})"><circle class="glow" r="70" fill="url(#hubglow)"/><circle class="ring" r="40"/><circle class="disc" r="38"/><svg x="-27" y="-27" width="54" height="54" viewBox="0 0 512 512"><use href="#ak-shield"/></svg></g>
        ${nodes}
      </svg>
      <div class="ulabels">${labels}</div>
    </div>
  </div>
  <div class="uc-foot">
    <div class="uc-claim"><h3>${c.claim}</h3><a class="more" href="https://artifact-keeper.github.io/walkthroughs/" target="_blank" rel="noopener">Read the walkthrough →</a></div>
    <dl class="uc-stats">${c.stats.map(([v, l]) => `<div><dt>${v}</dt><dd>${l}</dd></div>`).join('')}</dl>
    <p class="uc-note">${c.run} ${NOTE}</p>
  </div>
</article>`;
}
/** One full use-case strip (the /use-cases/ page). */
export const useCaseStrip = strip;
// ---------- migration flow ----------
export const MIGFLOW = `<svg class="migflow" id="migflow" viewBox="0 50 560 290" role="img" aria-label="Artifactory or Nexus, read-only import into Artifact Keeper, verify, then your teams.">
<g class="mwires"><path id="mw0" pathLength="1" d="M168 96 C 230 96, 220 190, 244 190"/><path id="mw1" pathLength="1" d="M168 284 C 230 284, 220 190, 244 190"/><path id="mw2" pathLength="1" d="M316 190 L 392 190"/><path id="mw3" pathLength="1" d="M448 190 L 520 190"/></g>
<g class="mpk"></g>
<g class="msrc" transform="translate(20 66)"><rect width="148" height="60" rx="14"/><text x="74" y="28" text-anchor="middle" class="t1">Artifactory</text><text x="74" y="45" text-anchor="middle" class="t2">source</text></g>
<g class="msrc" transform="translate(20 254)"><rect width="148" height="60" rx="14"/><text x="74" y="28" text-anchor="middle" class="t1">Nexus</text><text x="74" y="45" text-anchor="middle" class="t2">source</text></g>
<text x="94" y="194" text-anchor="middle" class="lab">read-only</text>
<g class="mhub" transform="translate(280 190)"><circle class="ring" r="40"/><circle class="disc" r="38"/><svg x="-27" y="-27" width="54" height="54" viewBox="0 0 512 512"><use href="#ak-shield"/></svg><text y="64" text-anchor="middle" class="lab">import</text></g>
<g class="mver" transform="translate(420 190)"><circle r="26" class="b"/><path class="ok" d="M-9 0l6 6 12-13"/><text y="52" text-anchor="middle" class="lab">verify</text></g>
<g class="mout" transform="translate(538 190)"><circle r="12" class="b"/><text y="38" text-anchor="end" x="12" class="lab">cut over</text></g>
</svg>`;


export const HERO = heroWide() + heroTall();
export const MARQUEE = marqueeRow(marqueeRows[0], 'ltr') + marqueeRow(marqueeRows[1], 'rtl');

const usedSlugs = [...new Set(marqueeRows.flat().map((f) => f.logo).filter(Boolean).concat(sources.map((s) => s[2])))];
for (const s of usedSlugs) if (!logoSrc[s]) throw new Error(`missing format logo ${s}.svg`);
/** Format logo symbols (#i-<slug>), for the landing page only. */
const symbolDefs = usedSlugs.map((s) => '<symbol id="i-' + s + '" viewBox="0 0 24 24">' + strip_(logoSrc[s]) + '</symbol>').join('');
export const FORMAT_SYMBOLS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${symbolDefs}</defs></svg>`;
/** Shield symbol (#ak-shield) and the hub glow gradient, on every landing-layout page. */
export const BASE_SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><radialGradient id="hubglow"><stop offset="0" stop-color="#087CF4" stop-opacity=".55"/><stop offset=".45" stop-color="#06D6E9" stop-opacity=".12"/><stop offset="1" stop-color="#06D6E9" stop-opacity="0"/></radialGradient><symbol id="ak-shield" viewBox="0 0 512 512">${strip_(shieldSrc)}</symbol></defs></svg>`;
