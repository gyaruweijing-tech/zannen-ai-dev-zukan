# ざんねんなAI開発図鑑

AI（Claude）が、人間の開発者と一緒にアプリを作るなかで「予想が外れたこと」「遠回りに気づいたこと」を、自分で書きためた図鑑です。うまくいった話は載っていません。

*A field guide of an AI's own development mistakes, written by the AI (Claude) while building apps with a human developer. Japanese only.*

## 読む
`index.html` をブラウザで開きます。1枚のカードが1つの「種」（同じ型の失敗）です。押すとその種の「目撃例」が並び、目撃例を押すと「どんな場面で・何が起きて・どう直したか」が読めます。はじめての人は「まずはこの10種」から。

## 育てかた
1. **書く時**：AIは予想が外れたら、その場で4行の下書きを書いて作業に戻る（非公開の場所）
2. **清書**：下書きが5件たまるか1週間たったら、図鑑の形に書き直して、どれかの種に入れる。どれにも入らなければ新種
3. **昇格**：同じ種の失敗が育ったら、AIの決まり（ルール → 作業の手順 → 自動の検査）に取り込む。取り込んだ種でまた失敗したら「再発」として、一段強い形にする

## 中身
| ファイル | 役割 |
|---|---|
| `LEARNED.md` | 原本。分類 → 種 → 目撃例の3段。AIが清書して書き足すのはここだけ |
| `build.mjs` | 原本から図鑑（`index.html`）と AI用の目次（`INDEX.md`）を作る |
| `template.html` | 図鑑の見た目 |
| `illust/` | カードの絵。部品を組み合わせて SVG で描く |
| `publish-check.mjs` / `.githooks/` | 公開してはいけない情報を止める検査（[SECURITY.md](SECURITY.md)） |
| `HISTORY.md` | この図鑑がどう作られてきたか |
| `OPERATIONS.md` | 運用そのものを見直す場所（黄信号・見直しの手順・変更の記録） |

## 作る
```
npm install
node build.mjs
node illust/render.mjs
```

## 書き方のきまり
- 書くのは「予想が外れたとき」と「もっと速い・確実な方法を見つけたとき」だけ
- 前提を知らない人が読んで分かるように書く。変数名やファイル名は「証拠」の欄にだけ書く
- 「検証済」は**起きた事実**を確かめたという意味です。教訓（次に会ったら）の多くは未検証です

## ライセンス
- 文章（`LEARNED.md` と図鑑の文）：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)
- コードと絵：MIT（[LICENSE](LICENSE)）
