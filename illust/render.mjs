// scenes.json の指定から、1件ごとの SVG を作る。指定は教訓の「見出し」で結びつける（番号は並びで変わるため）
//   node illust/render.mjs            全部の SVG ＋ 確認用の一覧 PNG（out/_sheet-*.png）
//   node illust/render.mjs --lineup   動物ごとの表情見本（out/_lineup.png）
// 指定に書けるのは parts.mjs にある部品だけ（生の SVG は書けない）
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import * as P from './parts.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out');
fs.mkdirSync(OUT, { recursive: true });
export const fileOf = title => crypto.createHash('sha1').update(title).digest('hex').slice(0, 10) + '.svg';
const png = (svg, w, file) => fs.writeFileSync(file, new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { loadSystemFonts: true } }).render().asPng());

function props(list = []) {
  return list.map(([name, ...args]) => {
    if (!P.PROPS[name]) throw new Error(`部品が無い: ${name}`);
    return P.PROPS[name](...args);
  }).join('');
}
export function draw(s) {
  const a = P.ANIMALS[s.a]; if (!a) throw new Error(`動物が無い: ${s.a}`);
  const x = s.x ?? 95;
  return P.stage(a.bg, props(s.back) + P.shadow(x) + P.DRAW[s.a]({ x, face: s.face || 'smug', arm: s.arm || 'down' }) + props(s.front));
}
// 何枚かの SVG を1枚に並べる（確認用）
function sheet(svgs, cols = 6) {
  const rows = Math.ceil(svgs.length / cols);
  const cells = svgs.map((s, i) => `<g transform="translate(${(i % cols) * 250} ${Math.floor(i / cols) * 190})">${s.replace(/<svg[^>]*>/, '').replace('</svg>', '')}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols * 250} ${rows * 190}" width="${cols * 250}" height="${rows * 190}"><rect width="100%" height="100%" fill="#fff"/>${cells}</svg>`;
}

if (process.argv[2] === '--lineup') {
  const faces = ['smug', 'happy', 'worried', 'surprised'];
  const svgs = Object.keys(P.ANIMALS).flatMap(a => faces.map((face, i) => draw({ a, face, arm: i === 1 ? 'out' : 'down', x: 100 })));
  png(sheet(svgs, 4), 1000, path.join(OUT, '_lineup.png'));
  console.log('OK 表情見本 → illust/out/_lineup.png');
} else {
  const scenes = JSON.parse(fs.readFileSync(path.join(HERE, 'scenes.json'), 'utf8'));
  const keep = new Set(), svgs = [];
  for (const [title, s] of Object.entries(scenes)) {
    if (title.startsWith('_')) continue;
    const svg = draw(s), f = fileOf(title);
    fs.writeFileSync(path.join(OUT, f), svg); keep.add(f); svgs.push(svg);
  }
  for (const f of fs.readdirSync(OUT)) if (f.endsWith('.svg') && !keep.has(f)) fs.unlinkSync(path.join(OUT, f));   // 使われなくなった絵を消す
  for (let i = 0; i < svgs.length; i += 24) png(sheet(svgs.slice(i, i + 24)), 1500, path.join(OUT, `_sheet-${i / 24 + 1}.png`));
  console.log(`OK ${svgs.length}枚 → illust/out/（確認用 _sheet-*.png）`);
}
