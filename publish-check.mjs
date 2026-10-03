// 公開してはいけない情報を止める検査。止まったら exit 1（これを握りつぶさないこと）。
//   node publish-check.mjs --staged       commit の前（.githooks/pre-commit）：これから commit するファイル
//   node publish-check.mjs --msg <file>   コミットメッセージ（.githooks/commit-msg）
//   node publish-check.mjs --push         push の前（.githooks/pre-push）：全ファイル＋全コミットのメッセージと作者
//   node publish-check.mjs --ci           GitHub 側（一覧ファイルは使わず、決まった形だけ）
//
// 本名など「出してはいけない言葉」の一覧は、PC の中だけにある ~/.zukan-private/private-words.txt（1行1語）。
// ★一覧が無いときは止まる（--ci を除く）。見つけた言葉そのものは画面に出さない。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const mode = process.argv[2];
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 << 20 });
const fail = msg => { console.error(`NG  ${msg}`); ng++; };
let ng = 0;

// 公開してよい作者（コミットに付く名前とメール）
const AUTHOR = { name: 'すごくいい靴底', email: /^\d+\+[\w-]+@users\.noreply\.github\.com$/ };

// commit してよいファイルの種類。★中身を検査できない種類（画像など）は入れない
const ALLOWED = /\.(md|mjs|js|json|html|svg|txt|yml|css)$|^LICENSE$|^\.gitignore$|^\.gitattributes$|^\.githooks\/[\w-]+$/;

// 一覧に書かなくても止めるもの
const PATTERNS = [
  ['メールアドレス', /[\w.+-]+@(?!users\.noreply\.github\.com)[\w-]+\.[a-z][\w.]*/i],
  ['PC内のパス', /(?<![A-Za-z])[A-Za-z]:[\\/]|\/Users\/|\/home\/\w|learning-AI/],
  ['AIへの指示書の場所', /\.claude\b|CLAUDE\.md/],
  ['APIキー・トークン', /sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|github_pat_\w{20,}|AIza[0-9A-Za-z_-]{30,}|xox[abp]-[\w-]{10,}|AKIA[0-9A-Z]{16}/],
  ['秘密鍵', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['.env の中身らしきもの', /^\s*[A-Z][A-Z0-9_]*(KEY|TOKEN|SECRET|PASSWORD)\s*=\s*\S+/m],
];

let words = [];
if (mode !== '--ci') {
  const f = path.join(os.homedir(), '.zukan-private', 'private-words.txt');
  if (!fs.existsSync(f)) { console.error(`NG  出してはいけない言葉の一覧（~/.zukan-private/private-words.txt）が無い。止めます`); process.exit(1); }
  words = fs.readFileSync(f, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));
  if (!words.length) { console.error('NG  一覧が空。止めます'); process.exit(1); }
}

function scanText(where, text) {
  const low = text.toLowerCase();
  words.forEach((w, i) => { if (low.includes(w.toLowerCase())) fail(`${where}: 一覧の${i + 1}番目の言葉が入っている`); });
  const t = text.split('noreply@anthropic.com').join('');          // 共同作者の行（Anthropic の公開アドレス）だけは許可
  for (const [name, re] of PATTERNS) { const m = t.match(re); if (m) fail(`${where}: ${name} → ${mode === '--ci' ? m[0] : m[0].slice(0, 40)}`); }
}
function scanFiles(files, read) {
  for (const f of files) {
    if (f === 'publish-check.mjs') continue;                       // この検査そのもの（パターンの定義を含む）
    if (!ALLOWED.test(f)) { fail(`${f}: この種類のファイルは commit できない（中身を検査できない）`); continue; }
    scanText(f, read(f));
  }
}

if (mode === '--staged') {
  const files = git('diff', '--cached', '--name-only', '--diff-filter=ACMR').split('\n').filter(Boolean);
  scanFiles(files, f => git('show', `:${f}`));
  const name = git('config', 'user.name').trim(), email = git('config', 'user.email').trim();
  if (name !== AUTHOR.name || !AUTHOR.email.test(email)) fail(`作者の設定が公開用ではない（user.name / user.email）`);
} else if (mode === '--msg') {
  scanText('コミットメッセージ', fs.readFileSync(process.argv[3], 'utf8'));
} else if (mode === '--push' || mode === '--ci') {
  // 作業中のファイルではなく、実際に push される中身（最新の commit）を読む
  const files = git('ls-tree', '-r', '--name-only', 'HEAD').split('\n').filter(Boolean);
  scanFiles(files, f => git('show', `HEAD:${f}`));
  const log = git('log', '--format=%H%x1f%an%x1f%ae%x1f%cn%x1f%ce%x1f%B%x1e');
  for (const rec of log.split('\x1e').map(s => s.trim()).filter(Boolean)) {
    const [h, an, ae, cn, ce, body] = rec.split('\x1f');
    const id = h.slice(0, 7);
    if (an !== AUTHOR.name || !AUTHOR.email.test(ae)) fail(`コミット ${id}: 作者が公開用ではない`);
    if (mode === '--push' && (cn !== AUTHOR.name || !AUTHOR.email.test(ce))) fail(`コミット ${id}: コミットした人が公開用ではない`);
    scanText(`コミット ${id} のメッセージ`, body || '');
  }
} else {
  console.error('使い方: --staged | --msg <file> | --push | --ci'); process.exit(2);
}

if (ng) { console.error(`\n止めました（${ng}件）。直してからもう一度。検査を飛ばす（--no-verify）のは禁止。`); process.exit(1); }
console.log(`OK  公開前チェック（${mode}）問題なし`);
