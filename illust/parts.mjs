// 図鑑の絵の部品。画風のルールは zukan-illust スキル（AIの手順書）にある
// 部品は「SVG の文字列を返す関数」。座標は viewBox 240×180、地面は y=152。

export const INK = '#2b2f38';
export const ACCENT = '#f5c400';
const W = 3, W2 = 2;                         // 輪郭の線 / 細部の線
const line = (w = W) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// 分類ごとの動物と、その理由（図鑑に載る）
export const ANIMALS = {
  tanuki: {
    name: 'タヌキ', section: '測る道具がうそをつく',
    why: '人を化かす動物。測る道具に化かされる話が集まる分類なので',
    bg: '#eef3f6', body: '#b98a5e', dark: '#5a4535', light: '#f4e6d0',
  },
};

// 足もとの影
export const shadow = (cx, w = 48) => `<ellipse cx="${cx}" cy="153" rx="${w}" ry="6" fill="${INK}" opacity=".12"/>`;

// ---- タヌキ ---------------------------------------------------------------
// x: 体の中心。face: 'smug'（得意げ）| 'worried'（困り）| 'surprised'（びっくり）| 'blind'（目隠し）
// arm: 'out'（右へ腕を伸ばす）| 'down'
export function tanuki({ x = 95, face = 'smug', arm = 'down' } = {}) {
  const c = ANIMALS.tanuki, hx = x, hy = 80;
  const tail = `
    <clipPath id="tailclip"><ellipse cx="${x - 40}" cy="130" rx="27" ry="13" transform="rotate(-28 ${x - 40} 130)"/></clipPath>
    <ellipse cx="${x - 40}" cy="130" rx="27" ry="13" transform="rotate(-28 ${x - 40} 130)" fill="${c.body}"/>
    <g clip-path="url(#tailclip)" fill="${c.dark}">
      <rect x="${x - 80}" y="100" width="25" height="60" transform="rotate(-28 ${x - 40} 130)"/>
    </g>
    <ellipse cx="${x - 40}" cy="130" rx="27" ry="13" transform="rotate(-28 ${x - 40} 130)" fill="none" ${line()}/>`;
  const armOut = arm === 'out'
    ? `<path d="M${x + 22} 112 Q${x + 34} 108 ${x + 40} 102" fill="none" ${line(10)}/>
       <path d="M${x + 22} 112 Q${x + 34} 108 ${x + 40} 102" fill="none" stroke="${c.dark}" stroke-width="5" stroke-linecap="round"/>`
    : `<ellipse cx="${x + 26}" cy="124" rx="7" ry="11" transform="rotate(-15 ${x + 26} 124)" fill="${c.dark}" ${line(W2)}/>`;
  const eyes = {
    smug: `<path d="M${hx - 17} 83 q5 -5 10 0" fill="none" stroke="${c.light}" stroke-width="2.5" stroke-linecap="round"/>
           <path d="M${hx + 7} 83 q5 -5 10 0" fill="none" stroke="${c.light}" stroke-width="2.5" stroke-linecap="round"/>`,
    worried: `<circle cx="${hx - 12}" cy="83" r="3.2" fill="${c.light}"/><circle cx="${hx + 12}" cy="83" r="3.2" fill="${c.light}"/>`,
    surprised: `<circle cx="${hx - 12}" cy="82" r="5" fill="${c.light}"/><circle cx="${hx - 12}" cy="82" r="2.2" fill="${INK}"/>
                <circle cx="${hx + 12}" cy="82" r="5" fill="${c.light}"/><circle cx="${hx + 12}" cy="82" r="2.2" fill="${INK}"/>`,
    blind: '',
  }[face];
  const mouth = {
    smug: `<path d="M${hx - 5} 97 q5 4 10 0" fill="none" ${line(W2)}/>`,
    worried: `<path d="M${hx - 5} 99 q5 -3 10 0" fill="none" ${line(W2)}/>`,
    surprised: `<ellipse cx="${hx}" cy="99" rx="3" ry="3.5" fill="${INK}"/>`,
    blind: `<path d="M${hx - 6} 97 q6 5 12 0" fill="none" ${line(W2)}/>`,
  }[face];
  return `<g class="tanuki">
    ${tail}
    <ellipse cx="${x - 14}" cy="150" rx="11" ry="5.5" fill="${c.dark}" ${line(W2)}/>
    <ellipse cx="${x + 14}" cy="150" rx="11" ry="5.5" fill="${c.dark}" ${line(W2)}/>
    <ellipse cx="${x}" cy="124" rx="31" ry="28" fill="${c.body}" ${line()}/>
    <ellipse cx="${x}" cy="129" rx="18" ry="17" fill="${c.light}"/>
    ${armOut}
    <ellipse cx="${x - 26}" cy="124" rx="7" ry="11" transform="rotate(15 ${x - 26} 124)" fill="${c.dark}" ${line(W2)}/>
    <circle cx="${hx - 22}" cy="57" r="10" fill="${c.body}" ${line()}/><circle cx="${hx - 22}" cy="58" r="5" fill="${c.dark}"/>
    <circle cx="${hx + 22}" cy="57" r="10" fill="${c.body}" ${line()}/><circle cx="${hx + 22}" cy="58" r="5" fill="${c.dark}"/>
    <ellipse cx="${hx}" cy="${hy}" rx="31" ry="28" fill="${c.body}" ${line()}/>
    <ellipse cx="${hx}" cy="66" rx="9" ry="6" fill="${c.light}"/>
    <ellipse cx="${hx - 12}" cy="84" rx="11" ry="8" transform="rotate(22 ${hx - 12} 84)" fill="${c.dark}"/>
    <ellipse cx="${hx + 12}" cy="84" rx="11" ry="8" transform="rotate(-22 ${hx + 12} 84)" fill="${c.dark}"/>
    <ellipse cx="${hx}" cy="95" rx="12" ry="8.5" fill="${c.light}"/>
    ${eyes}
    <ellipse cx="${hx}" cy="90" rx="4.2" ry="3.2" fill="${INK}"/>
    ${mouth}
  </g>`;
}

// ---- 小道具 ----------------------------------------------------------------
// 目隠し（アクセントの黄）。顔の中心 hx に合わせる
export const blindfold = (hx = 95) => `<g class="blindfold">
  <path d="M${hx - 31} 78 Q${hx} 72 ${hx + 31} 78 L${hx + 31} 90 Q${hx} 84 ${hx - 31} 90 Z" fill="${ACCENT}" ${line(W2)}/>
  <path d="M${hx + 30} 83 l12 -6 l-2 10 Z M${hx + 30} 85 l10 8 l-12 1 Z" fill="${ACCENT}" ${line(W2)}/>
</g>`;

// 定規。手の位置 (x,y) から右へ伸ばす。angle は度
export const ruler = (x, y, len = 80, angle = -8) => {
  const ticks = Array.from({ length: Math.floor(len / 8) - 1 }, (_, i) => {
    const tx = 8 * (i + 1); return `<line x1="${tx}" y1="0" x2="${tx}" y2="${i % 2 ? 5 : 8}" ${line(1.5)}/>`;
  }).join('');
  return `<g class="ruler" transform="translate(${x} ${y}) rotate(${angle})">
    <rect x="0" y="-1" width="${len}" height="15" rx="2.5" fill="#fbf7ea" ${line(W2)}/>${ticks}</g>`;
};

// 設定のつまみ（縦のスライダー）。knobAt: 0〜1（上が1）。movedFrom: 動かす前の位置（点線のつまみと矢印を描く）
export const slider = (x, y, h = 70, knobAt = 0.2, movedFrom = null) => {
  const at = k => y + 8 + (1 - k) * (h - 16);
  const ky = at(knobAt);
  const trail = movedFrom == null ? '' : (() => {
    const oy = at(movedFrom);
    return `<rect x="${x + 1}" y="${oy - 5}" width="16" height="10" rx="3" fill="none" ${line(1.5)} stroke-dasharray="3 3" opacity=".6"/>
      <path d="M${x + 28} ${oy} V${ky - 4} m-5 -6 l5 6 l5 -6" fill="none" ${line(W2)}/>`;
  })();
  return `<g class="slider">
    <rect x="${x}" y="${y}" width="18" height="${h}" rx="6" fill="#ffffff" ${line(W2)}/>
    <line x1="${x + 9}" y1="${y + 8}" x2="${x + 9}" y2="${y + h - 8}" ${line(W2)}/>
    <rect x="${x + 1}" y="${ky - 5}" width="16" height="10" rx="3" fill="${INK}"/>
    ${trail}
  </g>`;
};

// 何も無いところを指す印（点線の丸）
export const emptyTarget = (cx, cy, r = 13) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${line(W2)} stroke-dasharray="3 5" opacity=".6"/>`;

// 汗（困り・気づいていないときの焦り）
export const sweat = (x, y) =>
  `<path d="M${x} ${y} q5 8 0 12 q-5 -4 0 -12 Z" fill="#cfe6f5" ${line(1.5)}/>`;

// 背景と地面
export const stage = (bg, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="240" height="180">
  <rect width="240" height="180" fill="${bg}"/>
  <line x1="0" y1="152" x2="240" y2="152" stroke="${INK}" stroke-width="1.5" opacity=".18"/>
  ${inner}
</svg>`;
