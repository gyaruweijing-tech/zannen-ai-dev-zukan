// 図鑑の絵の部品。画風のルールは zukan-illust スキル（AIの手順書）にある
// 部品は「SVG の文字列を返す関数」。座標は viewBox 240×180、地面は y=152。
// 動物は体の中心 x に立つ。頭の中心は (x, 80)、手を前に出すと手先は (x+40, 102)。

export const INK = '#2b2f38';
export const ACCENT = '#f5c400';
export const PAPER = '#fbf7ea';
export const SKY = '#dcecf7';
const W = 3, W2 = 2;
const L = (w = W) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
let uid = 0; const id = p => `${p}${++uid}`;

// 分類ごとの動物と、その理由（図鑑に載る）
export const ANIMALS = {
  tanuki:    { name: 'タヌキ',     section: '測る道具がうそをつく',         why: '人を化かす動物。測る道具に化かされる話が集まる分類だから', bg: '#eef3f6', body: '#b98a5e', dark: '#5a4535', light: '#f4e6d0' },
  sloth:     { name: 'ナマケモノ', section: '「効かない」の正体',           why: '押しても急かしても動かない動物。設定を変えても動かない話が集まる分類だから', bg: '#f1f1ea', body: '#a3927c', dark: '#5b4d3f', light: '#efe4d2' },
  chameleon: { name: 'カメレオン', section: '見た目は実際の画面で確かめる', why: '背景に溶けて見えなくなる動物。「溶けて見えない」失敗が多い分類だから', bg: '#f3f0f7', body: '#7fb069', dark: '#3f6b3a', light: '#d9eec8' },
  dog:       { name: 'イヌ',       section: '人間の感覚と数字',             why: '人の気持ちを読むのが得意な動物。数字より人の反応を見る分類だから', bg: '#fbf1ec', body: '#d9954f', dark: '#8a5a2e', light: '#fbf1e2' },
  beaver:    { name: 'ビーバー',   section: '設計・難易度づくり',           why: 'ダムを設計して作る動物。設計の失敗が集まる分類だから', bg: '#eef4ef', body: '#9a6a44', dark: '#4f3626', light: '#ead4b6' },
  otter:     { name: 'ラッコ',     section: '作業の段取りと道具',           why: '石を道具にして貝を割る動物。道具と段取りの分類だから', bg: '#eaf2f6', body: '#7a5c46', dark: '#47352a', light: '#f1e6d6' },
  ant:       { name: 'アリ',       section: '自動実行・ほかのAIと組む',     why: '群れで仕事を分け合う動物。ほかと組んで働く分類だから', bg: '#f6f2e8', body: '#9b3d2c', dark: '#5c2218', light: '#e9a993' },
  owl:       { name: 'フクロウ',   section: 'この図鑑を作りながら',         why: '森の物知りとされる鳥。この図鑑そのものを作る話の分類だから', bg: '#f0eef6', body: '#9b7653', dark: '#5a4330', light: '#f2e4c9' },
};
export const animalOf = section => Object.keys(ANIMALS).find(k => ANIMALS[k].section === section);

export const shadow = (cx, w = 48) => `<ellipse cx="${cx}" cy="153" rx="${w}" ry="6" fill="${INK}" opacity=".12"/>`;

// ---- 顔 -------------------------------------------------------------------
// face: smug 得意げ | happy うれしい | worried 困り | surprised びっくり | sleepy ねむい | blind 目隠し
function eyes(x, y, face, col, gap = 12) {
  const e = dx => ({
    smug: `<path d="M${x + dx - 5} ${y} q5 -5 10 0" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`,
    happy: `<path d="M${x + dx - 5} ${y} q5 -6 10 0" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`,
    worried: `<circle cx="${x + dx}" cy="${y}" r="3.2" fill="${col}"/>`,
    surprised: `<circle cx="${x + dx}" cy="${y - 1}" r="5.2" fill="#fff" ${L(1.5)}/><circle cx="${x + dx}" cy="${y - 1}" r="2.2" fill="${INK}"/>`,
    sleepy: `<path d="M${x + dx - 5} ${y} h10" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`,
    blind: '',
  }[face]);
  const brows = face === 'worried'
    ? `<path d="M${x - gap - 6} ${y - 8} l9 -4 M${x + gap + 6} ${y - 8} l-9 -4" fill="none" ${L(W2)}/>` : '';   // 内側が上がる＝困り眉
  return e(-gap) + e(gap) + brows;
}
function mouth(x, y, face) {
  return {
    smug: `<path d="M${x - 5} ${y} q5 4 10 0" fill="none" ${L(W2)}/>`,
    happy: `<path d="M${x - 6} ${y - 1} q6 8 12 0 z" fill="${INK}"/>`,
    worried: `<path d="M${x - 5} ${y + 2} q5 -4 10 0" fill="none" ${L(W2)}/>`,
    surprised: `<ellipse cx="${x}" cy="${y + 1}" rx="3" ry="3.6" fill="${INK}"/>`,
    sleepy: `<path d="M${x - 4} ${y + 1} h8" fill="none" ${L(W2)}/>`,
    blind: `<path d="M${x - 6} ${y} q6 5 12 0" fill="none" ${L(W2)}/>`,
  }[face];
}

// ---- 動物（正面を向いて立つ哺乳類と鳥） ---------------------------------------
function arms(x, c, arm, long = false) {
  const left = long
    ? `<path d="M${x - 24} 112 Q${x - 34} 128 ${x - 30} 142" fill="none" ${L(11)}/><path d="M${x - 24} 112 Q${x - 34} 128 ${x - 30} 142" fill="none" stroke="${c.dark}" stroke-width="6" stroke-linecap="round"/>`
    : `<ellipse cx="${x - 26}" cy="124" rx="7" ry="11" transform="rotate(15 ${x - 26} 124)" fill="${c.dark}" ${L(W2)}/>`;
  const path = { out: `M${x + 22} 112 Q${x + 34} 108 ${x + 40} 102`, up: `M${x + 22} 110 Q${x + 34} 92 ${x + 38} 70` }[arm];
  const right = path
    ? `<path d="${path}" fill="none" ${L(11)}/><path d="${path}" fill="none" stroke="${c.dark}" stroke-width="6" stroke-linecap="round"/>`
    : long ? `<path d="M${x + 24} 112 Q${x + 34} 128 ${x + 30} 142" fill="none" ${L(11)}/><path d="M${x + 24} 112 Q${x + 34} 128 ${x + 30} 142" fill="none" stroke="${c.dark}" stroke-width="6" stroke-linecap="round"/>`
    : `<ellipse cx="${x + 26}" cy="124" rx="7" ry="11" transform="rotate(-15 ${x + 26} 124)" fill="${c.dark}" ${L(W2)}/>`;
  return left + right;
}
const feet = (x, c) => `<ellipse cx="${x - 14}" cy="150" rx="11" ry="5.5" fill="${c.dark}" ${L(W2)}/><ellipse cx="${x + 14}" cy="150" rx="11" ry="5.5" fill="${c.dark}" ${L(W2)}/>`;
const body = (x, c, belly = true) => `<ellipse cx="${x}" cy="124" rx="31" ry="28" fill="${c.body}" ${L()}/>` + (belly ? `<ellipse cx="${x}" cy="129" rx="18" ry="17" fill="${c.light}"/>` : '');
const head = (x, c) => `<ellipse cx="${x}" cy="80" rx="31" ry="28" fill="${c.body}" ${L()}/>`;
const roundEars = (x, c, r = 10, dy = 0) => `<circle cx="${x - 22}" cy="${57 + dy}" r="${r}" fill="${c.body}" ${L()}/><circle cx="${x - 22}" cy="${58 + dy}" r="${r / 2}" fill="${c.dark}"/><circle cx="${x + 22}" cy="${57 + dy}" r="${r}" fill="${c.body}" ${L()}/><circle cx="${x + 22}" cy="${58 + dy}" r="${r / 2}" fill="${c.dark}"/>`;

function tanuki({ x = 95, face = 'smug', arm = 'down' }) {
  const c = ANIMALS.tanuki, cid = id('tail');
  const tail = `<clipPath id="${cid}"><ellipse cx="${x - 40}" cy="130" rx="27" ry="13" transform="rotate(-28 ${x - 40} 130)"/></clipPath>
    <ellipse cx="${x - 40}" cy="130" rx="27" ry="13" transform="rotate(-28 ${x - 40} 130)" fill="${c.body}"/>
    <g clip-path="url(#${cid})"><rect x="${x - 80}" y="100" width="25" height="60" fill="${c.dark}" transform="rotate(-28 ${x - 40} 130)"/></g>
    <ellipse cx="${x - 40}" cy="130" rx="27" ry="13" transform="rotate(-28 ${x - 40} 130)" fill="none" ${L()}/>`;
  return tail + feet(x, c) + body(x, c) + arms(x, c, arm) + roundEars(x, c) + head(x, c) +
    `<ellipse cx="${x}" cy="66" rx="9" ry="6" fill="${c.light}"/>
     <ellipse cx="${x - 12}" cy="84" rx="11" ry="8" transform="rotate(22 ${x - 12} 84)" fill="${c.dark}"/>
     <ellipse cx="${x + 12}" cy="84" rx="11" ry="8" transform="rotate(-22 ${x + 12} 84)" fill="${c.dark}"/>
     <ellipse cx="${x}" cy="95" rx="12" ry="8.5" fill="${c.light}"/>` +
    eyes(x, 83, face, c.light) + `<ellipse cx="${x}" cy="90" rx="4.2" ry="3.2" fill="${INK}"/>` + mouth(x, 97, face);
}

function sloth({ x = 95, face = 'sleepy', arm = 'down' }) {
  const c = ANIMALS.sloth;
  return feet(x, c) + body(x, c, false) + arms(x, c, arm, true) + head(x, c) +
    `<ellipse cx="${x}" cy="84" rx="25" ry="21" fill="${c.light}"/>
     <ellipse cx="${x - 14}" cy="85" rx="12" ry="5" transform="rotate(18 ${x - 14} 85)" fill="${c.dark}"/>
     <ellipse cx="${x + 14}" cy="85" rx="12" ry="5" transform="rotate(-18 ${x + 14} 85)" fill="${c.dark}"/>` +
    eyes(x, 84, face, c.light, 13) + `<ellipse cx="${x}" cy="92" rx="4" ry="3" fill="${INK}"/>` + mouth(x, 98, face) +
    `<path d="M${x - 33} 142 l-3 6 M${x - 29} 143 l-1 7 M${x + 33} 142 l3 6 M${x + 29} 143 l1 7" ${L(W2)}/>`;
}

function dog({ x = 95, face = 'happy', arm = 'down' }) {
  const c = ANIMALS.dog;
  const ears = `<path d="M${x - 27} 66 L${x - 22} 40 L${x - 6} 56 Z" fill="${c.body}" ${L()}/><path d="M${x - 23} 62 L${x - 21} 48 L${x - 12} 57 Z" fill="${c.light}"/>
    <path d="M${x + 27} 66 L${x + 22} 40 L${x + 6} 56 Z" fill="${c.body}" ${L()}/><path d="M${x + 23} 62 L${x + 21} 48 L${x + 12} 57 Z" fill="${c.light}"/>`;
  const tail = `<path d="M${x - 26} 118 q-22 -8 -14 -26 q8 -12 18 0" fill="none" ${L(12)}/><path d="M${x - 26} 118 q-22 -8 -14 -26 q8 -12 18 0" fill="none" stroke="${c.body}" stroke-width="7" stroke-linecap="round"/>`;
  return tail + feet(x, c) + body(x, c) + arms(x, c, arm) + ears + head(x, c) +
    `<ellipse cx="${x}" cy="94" rx="22" ry="12" fill="${c.light}"/>` +
    eyes(x, 82, face, INK) + `<ellipse cx="${x}" cy="89" rx="4.5" ry="3.4" fill="${INK}"/>` + mouth(x, 96, face);
}

function beaver({ x = 95, face = 'smug', arm = 'down' }) {
  const c = ANIMALS.beaver;
  const tail = `<ellipse cx="${x - 38}" cy="146" rx="24" ry="8" transform="rotate(-8 ${x - 38} 146)" fill="${c.dark}" ${L()}/>
    <path d="M${x - 54} 144 l30 -2 M${x - 52} 149 l28 -3 M${x - 44} 140 l2 12 M${x - 34} 139 l2 12" ${L(1.2)} opacity=".6"/>`;
  return tail + feet(x, c) + body(x, c) + arms(x, c, arm) + roundEars(x, c, 8, 4) + head(x, c) +
    `<ellipse cx="${x}" cy="93" rx="17" ry="11" fill="${c.light}"/>` +
    eyes(x, 80, face, INK) + `<ellipse cx="${x}" cy="88" rx="5" ry="3.6" fill="${INK}"/>` + mouth(x, 95, face === 'happy' ? 'smug' : face) +
    `<rect x="${x - 6}" y="98" width="6" height="9" rx="1" fill="#fff" ${L(1.6)}/><rect x="${x}" y="98" width="6" height="9" rx="1" fill="#fff" ${L(1.6)}/>`;
}

function otter({ x = 95, face = 'happy', arm = 'down' }) {
  const c = ANIMALS.otter;
  return feet(x, c) + body(x, c) + arms(x, c, arm) + roundEars(x, c, 6, 6) + head(x, c) +
    `<ellipse cx="${x}" cy="85" rx="24" ry="19" fill="${c.light}"/>` +
    eyes(x, 80, face, INK) + `<ellipse cx="${x}" cy="88" rx="5" ry="3.6" fill="${INK}"/>` + mouth(x, 95, face) +
    `<path d="M${x - 9} 92 l-14 -2 M${x - 9} 95 l-14 2 M${x + 9} 92 l14 -2 M${x + 9} 95 l14 2" ${L(1.2)}/>`;
}

function owl({ x = 95, face = 'smug', arm = 'down' }) {
  const c = ANIMALS.owl;
  const wing = s => `<ellipse cx="${x + s * 30}" cy="122" rx="9" ry="20" transform="rotate(${s * -12} ${x + s * 30} 122)" fill="${c.dark}" ${L(W2)}/>`;
  const wingOut = `<path d="M${x + 24} 112 Q${x + 36} 104 ${x + 42} 100" fill="none" ${L(13)}/><path d="M${x + 24} 112 Q${x + 36} 104 ${x + 42} 100" fill="none" stroke="${c.dark}" stroke-width="8" stroke-linecap="round"/>`;
  const v = [[0, 122], [-8, 132], [8, 132], [0, 142]].map(([dx, y]) => `<path d="M${x + dx - 4} ${y} l4 4 l4 -4" fill="none" ${L(1.5)}/>`).join('');
  const lid = face === 'smug' || face === 'sleepy';
  const eyeDisc = s => `<circle cx="${x + s * 13}" cy="80" r="12" fill="#fff" ${L(W2)}/>` +
    (face === 'blind' ? '' : lid ? `<path d="M${x + s * 13 - 8} 80 h16" ${L(2.6)}/>` : `<circle cx="${x + s * 13}" cy="${face === 'worried' ? 82 : 80}" r="${face === 'surprised' ? 3 : 5}" fill="${INK}"/>`);
  return feet(x, c) + `<ellipse cx="${x}" cy="124" rx="31" ry="28" fill="${c.body}" ${L()}/><ellipse cx="${x}" cy="131" rx="18" ry="18" fill="${c.light}"/>` + v +
    wing(-1) + (arm === 'out' ? wingOut : wing(1)) +
    `<path d="M${x - 28} 66 L${x - 26} 44 L${x - 12} 58 Z M${x + 28} 66 L${x + 26} 44 L${x + 12} 58 Z" fill="${c.body}" ${L()}/>` + head(x, c) +
    eyeDisc(-1) + eyeDisc(1) + `<path d="M${x - 4} 90 L${x + 4} 90 L${x} 98 Z" fill="${c.dark}" ${L(1.5)}/>` +
    (face === 'worried' ? `<path d="M${x - 24} 64 l10 4 M${x + 24} 64 l-10 4" ${L(W2)}/>` : '');
}

// ---- 動物（横向き） ----------------------------------------------------------
function chameleon({ x = 95, face = 'smug', arm = 'down' }) {
  const c = ANIMALS.chameleon;
  const tail = `<path d="M${x - 30} 126 q-20 6 -22 -8 q0 -12 12 -12 q9 0 9 8 q0 6 -6 6" fill="none" ${L(11)}/><path d="M${x - 30} 126 q-20 6 -22 -8 q0 -12 12 -12 q9 0 9 8 q0 6 -6 6" fill="none" stroke="${c.body}" stroke-width="6" stroke-linecap="round"/>`;
  const legs = [[-18, 0], [12, 0]].map(([dx]) => `<path d="M${x + dx} 132 l-4 18 h10" fill="none" ${L(8)}/><path d="M${x + dx} 132 l-4 18 h10" fill="none" stroke="${c.dark}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const front = arm === 'out'
    ? `<path d="M${x + 26} 122 Q${x + 36} 112 ${x + 40} 102" fill="none" ${L(9)}/><path d="M${x + 26} 122 Q${x + 36} 112 ${x + 40} 102" fill="none" stroke="${c.dark}" stroke-width="4.5" stroke-linecap="round"/>` : '';
  const pupil = { smug: `<path d="M${x + 33} 92 h10" ${L(2.6)}/>`, sleepy: `<path d="M${x + 33} 92 h10" ${L(2.6)}/>`, happy: `<path d="M${x + 33} 93 q5 -6 10 0" fill="none" ${L(2.6)}/>`,
    worried: `<circle cx="${x + 36}" cy="94" r="3" fill="${INK}"/>`, surprised: `<circle cx="${x + 40}" cy="91" r="2.5" fill="${INK}"/>`, blind: '' }[face];
  return tail + legs + `<ellipse cx="${x}" cy="118" rx="36" ry="22" fill="${c.body}" ${L()}/>
    <path d="M${x - 26} 124 q26 12 52 0" fill="none" stroke="${c.light}" stroke-width="6" stroke-linecap="round"/>
    <path d="M${x - 14} 104 q6 -6 12 0 q6 -6 12 0" fill="none" stroke="${c.dark}" stroke-width="2" opacity=".6"/>` + front +
    `<path d="M${x + 18} 104 Q${x + 26} 76 ${x + 44} 82 Q${x + 60} 92 ${x + 54} 108 Q${x + 40} 116 ${x + 22} 112 Z" fill="${c.body}" ${L()}/>
     <path d="M${x + 36} 106 q8 3 16 -2" fill="none" ${L(W2)}/>
     <circle cx="${x + 38}" cy="92" r="9" fill="${c.light}" ${L(W2)}/>` + pupil;
}

function ant({ x = 95, face = 'smug', arm = 'down' }) {
  const c = ANIMALS.ant;
  const legs = [-14, 0, 14].map(dx => `<path d="M${x + dx} 128 l${dx < 0 ? -8 : dx > 0 ? 6 : -2} 22" fill="none" ${L(W2)}/>`).join('');
  const front = arm === 'out' ? `<path d="M${x + 10} 116 Q${x + 26} 106 ${x + 40} 102" fill="none" ${L(W2 + 1)}/>` : '';
  const e = { smug: `<path d="M${x + 22} 96 q4 -5 8 0" fill="none" stroke="${c.light}" stroke-width="2.4" stroke-linecap="round"/>`,
    happy: `<path d="M${x + 22} 96 q4 -5 8 0" fill="none" stroke="${c.light}" stroke-width="2.4" stroke-linecap="round"/>`,
    sleepy: `<path d="M${x + 22} 96 h8" stroke="${c.light}" stroke-width="2.4" stroke-linecap="round"/>`,
    worried: `<circle cx="${x + 27}" cy="96" r="3" fill="${c.light}"/>`, surprised: `<circle cx="${x + 27}" cy="95" r="5" fill="#fff" ${L(1.5)}/><circle cx="${x + 28}" cy="95" r="2" fill="${INK}"/>`, blind: '' }[face];
  return legs + `<ellipse cx="${x - 26}" cy="124" rx="22" ry="17" fill="${c.body}" ${L()}/>
    <ellipse cx="${x}" cy="118" rx="12" ry="10" fill="${c.body}" ${L()}/>` + front +
    `<path d="M${x + 24} 86 q-4 -18 -16 -22 M${x + 30} 86 q4 -18 16 -22" fill="none" ${L(W2)}/>
     <circle cx="${x + 26}" cy="100" r="17" fill="${c.body}" ${L()}/>` + e +
    `<path d="M${x + 34} 108 q4 2 8 -1" fill="none" ${L(W2)}/>`;
}

export const DRAW = { tanuki, sloth, chameleon, dog, beaver, otter, ant, owl };

// ---- 小道具 ----------------------------------------------------------------
export const PROPS = {
  blindfold: (hx = 95) => `<path d="M${hx - 31} 78 Q${hx} 72 ${hx + 31} 78 L${hx + 31} 90 Q${hx} 84 ${hx - 31} 90 Z" fill="${ACCENT}" ${L(W2)}/>
    <path d="M${hx + 30} 83 l12 -6 l-2 10 Z M${hx + 30} 85 l10 8 l-12 1 Z" fill="${ACCENT}" ${L(W2)}/>`,
  ruler: (x, y, len = 70, angle = -8) => `<g transform="translate(${x} ${y}) rotate(${angle})"><rect x="0" y="-1" width="${len}" height="15" rx="2.5" fill="${PAPER}" ${L(W2)}/>${Array.from({ length: Math.floor(len / 8) - 1 }, (_, i) => `<line x1="${8 * (i + 1)}" y1="0" x2="${8 * (i + 1)}" y2="${i % 2 ? 5 : 8}" ${L(1.5)}/>`).join('')}</g>`,
  slider: (x, y, h = 70, knobAt = 0.2, movedFrom = null) => {
    const at = k => y + 8 + (1 - k) * (h - 16), ky = at(knobAt);
    const trail = movedFrom == null ? '' : `<rect x="${x + 1}" y="${at(movedFrom) - 5}" width="16" height="10" rx="3" fill="none" ${L(1.5)} stroke-dasharray="3 3" opacity=".6"/><path d="M${x + 28} ${at(movedFrom)} V${ky + (movedFrom > knobAt ? -4 : 4)} m-5 ${movedFrom > knobAt ? -6 : 6} l5 ${movedFrom > knobAt ? 6 : -6} l5 ${movedFrom > knobAt ? -6 : 6}" fill="none" ${L(W2)}/>`;
    return `<rect x="${x}" y="${y}" width="18" height="${h}" rx="6" fill="#fff" ${L(W2)}/><line x1="${x + 9}" y1="${y + 8}" x2="${x + 9}" y2="${y + h - 8}" ${L(W2)}/><rect x="${x + 1}" y="${ky - 5}" width="16" height="10" rx="3" fill="${INK}"/>${trail}`;
  },
  emptyTarget: (cx, cy, r = 13) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${L(W2)} stroke-dasharray="3 5" opacity=".6"/>`,
  sweat: (x, y) => `<path d="M${x} ${y} q5 8 0 12 q-5 -4 0 -12 Z" fill="${SKY}" ${L(1.5)}/>`,
  magnifier: (x, y, r = 16, angle = 40) => `<g transform="rotate(${angle} ${x} ${y})"><rect x="${x - 3.5}" y="${y + r}" width="7" height="${r * 1.3}" rx="3" fill="${INK}"/></g><circle cx="${x}" cy="${y}" r="${r}" fill="${SKY}" fill-opacity=".7" ${L()}/><path d="M${x - r * .5} ${y - r * .3} a${r * .55} ${r * .55} 0 0 1 ${r * .4} -${r * .3}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  clipboard: (x, y, marks = ['ok', 'ok', 'ng']) => `<rect x="${x}" y="${y}" width="40" height="${Math.max(52, 14 + marks.length * 13)}" rx="4" fill="${PAPER}" ${L(W2)}/><rect x="${x + 12}" y="${y - 4}" width="16" height="8" rx="2" fill="${INK}"/>` +
    marks.map((m, i) => { const yy = y + 14 + i * 13; return `<line x1="${x + 18}" y1="${yy}" x2="${x + 34}" y2="${yy}" ${L(1.5)} opacity=".5"/>` + (m === 'ok' ? `<path d="M${x + 6} ${yy} l3 3 l6 -7" fill="none" ${L(W2)}/>` : m === 'ng' ? `<path d="M${x + 6} ${yy - 4} l8 8 m0 -8 l-8 8" ${L(W2)}/>` : m === 'hot' ? `<rect x="${x + 5}" y="${yy - 5}" width="10" height="10" rx="2" fill="${ACCENT}" ${L(1.5)}/>` : `<rect x="${x + 5}" y="${yy - 5}" width="10" height="10" rx="2" fill="none" ${L(1.5)}/>`); }).join(''),
  mark: (x, y, type = 'ok', s = 1, accent = false) => {
    const f = accent ? ACCENT : '#fff';
    const shapes = {
      ok: `<circle r="16" fill="${f}" ${L()}/><path d="M-8 0 l5 6 l11 -12" fill="none" ${L(4)}/>`,
      ng: `<circle r="16" fill="${f}" ${L()}/><path d="M-7 -7 l14 14 m0 -14 l-14 14" ${L(4)}/>`,
      q: `<circle r="16" fill="${f}" ${L()}/><path d="M-5 -5 q0 -7 6 -7 q6 0 6 6 q0 5 -6 7 v4" fill="none" ${L(3.5)}/><circle cy="10" r="2.2" fill="${INK}"/>`,
      ex: `<circle r="16" fill="${f}" ${L()}/><path d="M0 -10 v12" ${L(4)}/><circle cy="9" r="2.4" fill="${INK}"/>`,
    };
    return `<g transform="translate(${x} ${y}) scale(${s})">${shapes[type]}</g>`;
  },
  badge: (x, y, text, accent = true) => { const w = 12 + String(text).length * 11; return `<rect x="${x - w / 2}" y="${y - 13}" width="${w}" height="26" rx="13" fill="${accent ? ACCENT : '#fff'}" ${L(W2)}/><text x="${x}" y="${y + 6}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="17" fill="${INK}">${String(text).replace(/[<&]/g, '')}</text>`; },
  dice: (x, y, n = 5, s = 22) => { const P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[n]; return `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="5" fill="#fff" ${L(W2)}/>` + P.map(([a, b]) => `<circle cx="${x + a * s * .26}" cy="${y + b * s * .26}" r="2.2" fill="${INK}"/>`).join(''); },
  dial: (x, y, r = 16, angle = -40) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${L()}/><line x1="${x}" y1="${y}" x2="${x + Math.cos(angle * Math.PI / 180) * (r - 4)}" y2="${y + Math.sin(angle * Math.PI / 180) * (r - 4)}" ${L(3)}/>` + [-150, -90, -30].map(a => `<line x1="${x + Math.cos(a * Math.PI / 180) * (r + 3)}" y1="${y + Math.sin(a * Math.PI / 180) * (r + 3)}" x2="${x + Math.cos(a * Math.PI / 180) * (r + 7)}" y2="${y + Math.sin(a * Math.PI / 180) * (r + 7)}" ${L(W2)}/>`).join(''),
  gear: (x, y, r = 14, accent = false) => `<g transform="translate(${x} ${y})">${Array.from({ length: 8 }, (_, i) => `<rect x="-3.5" y="${-r - 5}" width="7" height="8" rx="1.5" fill="${accent ? ACCENT : '#fff'}" ${L(W2)} transform="rotate(${i * 45})"/>`).join('')}<circle r="${r}" fill="${accent ? ACCENT : '#fff'}" ${L(W2)}/><circle r="${r * .35}" fill="none" ${L(W2)}/></g>`,
  box: (x, y, w = 40, h = 30, accent = false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${accent ? ACCENT : PAPER}" ${L(W2)}/><path d="M${x} ${y + 9} h${w} M${x + w / 2 - 6} ${y} v9 M${x + w / 2 + 6} ${y} v9" ${L(1.5)} opacity=".6"/>`,
  screen: (x, y, w = 60, h = 42, content = 'chart') => {
    const inner = {
      blank: '', white: `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" fill="#fff"/>`,
      chart: [0.3, 0.6, 0.45, 0.85].map((v, i) => `<rect x="${x + 9 + i * ((w - 18) / 4)}" y="${y + h - 7 - v * (h - 16)}" width="${(w - 18) / 4 - 4}" height="${v * (h - 16)}" fill="${i === 3 ? ACCENT : '#fff'}" ${L(1.5)}/>`).join(''),
      flat: [0.5, 0.5, 0.5, 0.5].map((v, i) => `<rect x="${x + 9 + i * ((w - 18) / 4)}" y="${y + h - 7 - v * (h - 16)}" width="${(w - 18) / 4 - 4}" height="${v * (h - 16)}" fill="#fff" ${L(1.5)}/>`).join(''),
      ng: `<path d="M${x + w / 2 - 8} ${y + h / 2 - 8} l16 16 m0 -16 l-16 16" stroke="${ACCENT}" stroke-width="3.5" stroke-linecap="round"/>`,
      ok: `<path d="M${x + w / 2 - 10} ${y + h / 2} l6 7 l13 -14" fill="none" stroke="${ACCENT}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
      zero: `<text x="${x + w / 2}" y="${y + h / 2 + 8}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22" fill="${ACCENT}">0</text>`,
    }[content] ?? '';
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${INK}" ${L(W2)}/>${inner}<rect x="${x + w / 2 - 6}" y="${y + h}" width="12" height="8" fill="${INK}"/><rect x="${x + w / 2 - 16}" y="${y + h + 7}" width="32" height="4" rx="2" fill="${INK}"/>`;
  },
  camera: (x, y) => `<rect x="${x}" y="${y}" width="40" height="28" rx="5" fill="#fff" ${L(W2)}/><rect x="${x + 6}" y="${y - 6}" width="12" height="7" rx="2" fill="${INK}"/><circle cx="${x + 22}" cy="${y + 14}" r="9" fill="${SKY}" ${L(W2)}/><circle cx="${x + 22}" cy="${y + 14}" r="3.5" fill="${INK}"/>`,
  photo: (x, y, w = 44, h = 50, content = 'blank', tilt = -6) => {
    const inner = { blank: '', dark: `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 18}" fill="${INK}"/>`, sun: `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 18}" fill="${SKY}"/><circle cx="${x + w / 2}" cy="${y + (h - 18) / 2 + 5}" r="7" fill="${ACCENT}" ${L(1.5)}/>`, flip: `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 18}" fill="${SKY}"/><path d="M${x + 10} ${y + 25} l10 -12 l10 12" fill="none" ${L(W2)}/>` }[content] ?? '';
    return `<g transform="rotate(${tilt} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#fff" ${L(W2)}/>${inner}</g>`;
  },
  arrow: (x1, y1, x2, y2, dashed = false) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 8; return `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" ${L(W2 + .5)} ${dashed ? 'stroke-dasharray="4 5"' : ''}/><path d="M${x2 - h * Math.cos(a - .5)} ${y2 - h * Math.sin(a - .5)} L${x2} ${y2} L${x2 - h * Math.cos(a + .5)} ${y2 - h * Math.sin(a + .5)}" fill="none" ${L(W2 + .5)}/>`; },
  cloud: (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-24 10 h48 a12 12 0 0 0 0 -24 a18 18 0 0 0 -34 -4 a13 13 0 0 0 -14 28 z" fill="#fff" ${L(W2)}/>`,
  robot: (x, y, face = 'smug', s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><line x1="0" y1="-26" x2="0" y2="-34" ${L(W2)}/><circle cy="-36" r="3.5" fill="${ACCENT}" ${L(1.5)}/><rect x="-18" y="-26" width="36" height="28" rx="7" fill="#fff" ${L()}/>${face === 'surprised' ? '<circle cx="-7" cy="-13" r="4" fill="#fff" stroke="#2b2f38" stroke-width="1.5"/><circle cx="7" cy="-13" r="4" fill="#fff" stroke="#2b2f38" stroke-width="1.5"/>' : `<circle cx="-7" cy="-13" r="2.6" fill="${INK}"/><circle cx="7" cy="-13" r="2.6" fill="${INK}"/>`}<path d="M-6 -5 h12" ${L(W2)}/><rect x="-14" y="4" width="28" height="22" rx="5" fill="#fff" ${L()}/><path d="M-14 26 v0 M-8 26 v6 M8 26 v6" ${L(W2)}/></g>`,
  clock: (x, y, r = 15, hour = 3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${L()}/><line x1="${x}" y1="${y}" x2="${x}" y2="${y - r + 5}" ${L(W2)}/><line x1="${x}" y1="${y}" x2="${x + Math.sin(hour / 12 * 2 * Math.PI) * (r - 7)}" y2="${y - Math.cos(hour / 12 * 2 * Math.PI) * (r - 7)}" ${L(3)}/>`,
  stone: (x, y) => `<path d="M${x - 11} ${y + 4} q-2 -10 9 -11 q12 -1 13 8 q0 8 -11 8 q-9 0 -11 -5 z" fill="#c9c6bd" ${L(W2)}/>`,
  hammer: (x, y, angle = -30) => `<g transform="rotate(${angle} ${x} ${y})"><rect x="${x - 3}" y="${y}" width="6" height="34" rx="2" fill="${PAPER}" ${L(W2)}/><rect x="${x - 13}" y="${y - 10}" width="26" height="12" rx="2" fill="${INK}"/></g>`,
  wrench: (x, y, angle = -30) => `<g transform="rotate(${angle} ${x} ${y})"><rect x="${x - 3.5}" y="${y}" width="7" height="34" rx="3" fill="#fff" ${L(W2)}/><path d="M${x - 10} ${y + 2} a10 10 0 1 1 20 0 l-5 0 l0 -6 l-10 0 l0 6 z" fill="#fff" ${L(W2)}/></g>`,
  blueprint: (x, y, w = 56, h = 40) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${SKY}" ${L(W2)}/><path d="M${x + 8} ${y + h - 8} h${w * .35} v-${h * .45} h${w * .3}" fill="none" ${L(1.5)}/><path d="M${x + 6} ${y + 8} h${w - 12} M${x + 6} ${y + 14} h${w * .4}" ${L(1.2)} opacity=".5"/>`,
  ghost: (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-16 18 v-20 a16 16 0 0 1 32 0 v20 l-5 -5 l-5 5 l-6 -5 l-5 5 l-6 -5 z" fill="none" ${L(W2)} stroke-dasharray="4 4" opacity=".55"/>`,
  paper: (x, y, w = 36, h = 46, lines = 4, crossed = false, tilt = 0) => `<g transform="rotate(${tilt} ${x + w / 2} ${y + h / 2})"><path d="M${x} ${y} h${w - 10} l10 10 v${h - 10} h-${w} z" fill="${PAPER}" ${L(W2)}/>${Array.from({ length: lines }, (_, i) => `<line x1="${x + 6}" y1="${y + 14 + i * 8}" x2="${x + w - 7}" y2="${y + 14 + i * 8}" ${L(1.4)} opacity=".55"/>`).join('')}${crossed ? `<path d="M${x + 4} ${y + 6} L${x + w - 4} ${y + h - 4} M${x + w - 4} ${y + 6} L${x + 4} ${y + h - 4}" ${L(3)}/>` : ''}</g>`,
  floor: (x, w, color = ACCENT, arrows = 1) => `<rect x="${x}" y="146" width="${w}" height="12" rx="3" fill="${color}" ${L(W2)}/>` + Array.from({ length: Math.max(0, Math.floor(w / 30)) }, (_, i) => `<path d="M${x + 12 + i * 30} 148 l${arrows * 7} 4 l${-arrows * 7} 4" fill="none" ${L(1.6)}/>`).join(''),
  fan: (x, y) => `<rect x="${x - 3}" y="${y + 14}" width="6" height="${152 - y - 14}" fill="${INK}"/><ellipse cx="${x}" cy="152" rx="14" ry="4" fill="${INK}"/><circle cx="${x}" cy="${y}" r="17" fill="#fff" ${L()}/>` + [0, 120, 240].map(a => `<ellipse cx="${x}" cy="${y - 8}" rx="4.5" ry="8" fill="${SKY}" ${L(1.5)} transform="rotate(${a} ${x} ${y})"/>`).join('') + `<circle cx="${x}" cy="${y}" r="3" fill="${INK}"/>`,
  wind: (x, y, n = 3, curved = true) => Array.from({ length: n }, (_, i) => `<path d="M${x} ${y + i * 10} ${curved ? `q14 -8 28 0 t28 0` : `h56`}" fill="none" ${L(W2)} opacity=".7"/>`).join(''),
  bars: (x, y, values = [.3, .5, .8], hot = -1, w = 54, h = 44) => `<path d="M${x} ${y} v${h} h${w}" fill="none" ${L(W2)}/>` + values.map((v, i) => { const bw = (w - 8) / values.length - 4; return `<rect x="${x + 6 + i * (bw + 4)}" y="${y + h - v * h}" width="${bw}" height="${v * h}" fill="${i === hot ? ACCENT : '#fff'}" ${L(1.6)}/>`; }).join(''),
  zzz: (x, y) => `<path d="M${x} ${y} h8 l-8 9 h8 M${x + 12} ${y - 10} h6 l-6 7 h6" fill="none" ${L(1.8)}/>`,
  heart: (x, y, s = 1, accent = true) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 6 C-14 -4 -8 -14 0 -7 C8 -14 14 -4 0 6 Z" fill="${accent ? ACCENT : '#fff'}" ${L(W2)}/>`,
  motion: (x, y, dir = 1) => `<path d="M${x} ${y} h${-dir * 14} M${x + dir * 2} ${y + 8} h${-dir * 18} M${x} ${y + 16} h${-dir * 12}" ${L(W2)} opacity=".5"/>`,
  scale: (x, y, tilt = 10) => `<path d="M${x} ${y} v${152 - y}" ${L()}/><path d="M${x - 16} 152 h32" ${L()}/><g transform="rotate(${tilt} ${x} ${y})"><path d="M${x - 34} ${y} h68" ${L()}/><path d="M${x - 34} ${y} l-10 18 h20 z M${x + 34} ${y} l-10 18 h20 z" fill="#fff" ${L(W2)}/></g>`,
  crowd: (x, y, n = 5, s = 1, color = ACCENT) => Array.from({ length: n }, (_, i) => { const cx = x + (i % 5) * 11 * s, cy = y + Math.floor(i / 5) * 12 * s; return `<circle cx="${cx}" cy="${cy}" r="${4.5 * s}" fill="${color}" ${L(1.4)}/>`; }).join(''),
  wall: (x, y, w = 14, h = 60) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAPER}" ${L(W2)}/>` + Array.from({ length: Math.floor(h / 12) }, (_, i) => `<line x1="${x}" y1="${y + 12 * (i + 1)}" x2="${x + w}" y2="${y + 12 * (i + 1)}" ${L(1.2)} opacity=".5"/>`).join(''),
  hole: (x, w = 40) => `<ellipse cx="${x}" cy="154" rx="${w / 2}" ry="6" fill="${INK}"/>`,
  smoke: (x, y, show = true) => show ? [0, 1, 2].map(i => `<circle cx="${x + i * 12}" cy="${y - i * 6}" r="${8 + i * 2}" fill="#fff" ${L(1.6)}/>`).join('') : `<g opacity=".5">${[0, 1, 2].map(i => `<circle cx="${x + i * 12}" cy="${y - i * 6}" r="${8 + i * 2}" fill="none" ${L(1.4)} stroke-dasharray="3 4"/>`).join('')}</g>`,
  stop: (x, y) => `<path d="M${x - 10} ${y - 24} h20 l10 10 v20 l-10 10 h-20 l-10 -10 v-20 z" fill="#fff" ${L()}/><path d="M${x - 8} ${y - 4} h16" ${L(4)}/>`,
  book: (x, y, open = true) => open ? `<path d="M${x} ${y + 6} q-16 -8 -30 0 v32 q14 -8 30 0 q16 -8 30 0 v-32 q-14 -8 -30 0 z" fill="${PAPER}" ${L(W2)}/><path d="M${x} ${y + 6} v32" ${L(W2)}/>` : `<rect x="${x}" y="${y}" width="30" height="38" rx="3" fill="${ACCENT}" ${L(W2)}/>`,
  lock: (x, y, accent = true) => `<path d="M${x - 8} ${y} v-8 a8 8 0 0 1 16 0 v8" fill="none" ${L()}/><rect x="${x - 13}" y="${y}" width="26" height="22" rx="4" fill="${accent ? ACCENT : '#fff'}" ${L(W2)}/><circle cx="${x}" cy="${y + 10}" r="2.5" fill="${INK}"/>`,
  key: (x, y) => `<circle cx="${x}" cy="${y}" r="8" fill="${ACCENT}" ${L(W2)}/><path d="M${x + 8} ${y} h22 m-6 0 v6 m-6 -6 v5" fill="none" ${L(W2 + .5)}/>`,
  mail: (x, y, w = 40, h = 28) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#fff" ${L(W2)}/><path d="M${x} ${y} l${w / 2} ${h * .55} l${w / 2} -${h * .55}" fill="none" ${L(W2)}/>`,
  flag: (x, y, accent = true) => `<path d="M${x} 152 V${y}" ${L()}/><path d="M${x} ${y} h28 l-6 9 l6 9 h-28 z" fill="${accent ? ACCENT : '#fff'}" ${L(W2)}/>`,
  seed: (x, y) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="7" fill="${ACCENT}" ${L(1.5)}/>`,
};

// 背景と地面
export const stage = (bg, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="240" height="180">
  <rect width="240" height="180" fill="${bg}"/>
  <line x1="0" y1="152" x2="240" y2="152" stroke="${INK}" stroke-width="1.5" opacity=".18"/>
  ${inner}
</svg>`;
