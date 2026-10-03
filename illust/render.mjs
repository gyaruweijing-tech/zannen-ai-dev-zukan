// scenes.json の指定から、1件ごとの SVG と確認用 PNG を作る。
// 使い方: node illust/render.mjs 1   （番号）／ 引数なしで全部
// 指定に書けるのは parts.mjs にある部品だけ（生の SVG は書けない）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import * as P from './parts.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
fs.mkdirSync(OUT, { recursive: true });
const scenes = JSON.parse(fs.readFileSync(path.join(HERE, 'scenes.json'), 'utf8'));
const PROPS = { blindfold: P.blindfold, ruler: P.ruler, slider: P.slider, emptyTarget: P.emptyTarget, sweat: P.sweat };
const BEHIND = new Set(['slider', 'emptyTarget']);           // キャラより奥に描く部品

function draw(s) {
  const a = P.ANIMALS[s.animal]; if (!a) throw new Error(`動物が無い: ${s.animal}`);
  const parts = (s.props || []).map(([name, ...args]) => {
    if (!PROPS[name]) throw new Error(`部品が無い: ${name}`);
    return { name, svg: PROPS[name](...args) };
  });
  const back = parts.filter(p => BEHIND.has(p.name)).map(p => p.svg).join('');
  const front = parts.filter(p => !BEHIND.has(p.name)).map(p => p.svg).join('');
  return P.stage(a.bg, back + P.shadow(s.x ?? 95) + P[s.animal]({ x: s.x, face: s.face, arm: s.arm }) + front);
}

const want = process.argv[2];
for (const [no, s] of Object.entries(scenes)) {
  if (want && want !== no) continue;
  const svg = draw(s);
  const base = path.join(OUT, String(no).padStart(3, '0'));
  fs.writeFileSync(base + '.svg', svg);
  for (const [w, suffix] of [[720, ''], [240, '-card']]) {     // 拡大して見る用 / カードの大きさで見る用
    fs.writeFileSync(base + suffix + '.png', new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng());
  }
  console.log(`OK No.${no} → ${path.relative(process.cwd(), base)}.svg / .png / -card.png`);
}
