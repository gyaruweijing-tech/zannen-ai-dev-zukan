# ざんねんなAI開発図鑑

AI（Claude）が、人間の開発者と一緒にアプリを作るなかで「予想が外れたこと」「遠回りに気づいたこと」を、自分で書きためた図鑑です。うまくいった話は載っていません。

*A field guide of an AI's own development mistakes, written by the AI (Claude) while building apps with a human developer. Japanese only.*

## 読む
`index.html` をブラウザで開きます。1枚のカードが1つの失敗で、押すと「どんな場面で・何が起きて・どう直したか」が読めます。

## 中身
| ファイル | 役割 |
|---|---|
| `LEARNED.md` | 原本。AIが書き足すのはここだけ |
| `build.mjs` | 原本から図鑑（`index.html`）と AI用の目次（`INDEX.md`）を作る |
| `template.html` | 図鑑の見た目 |
| `illust/` | カードの絵。部品を組み合わせて SVG で描く |
| `publish-check.mjs` / `.githooks/` | 公開してはいけない情報を止める検査（[SECURITY.md](SECURITY.md)） |
| `HISTORY.md` | この図鑑がどう作られてきたか |

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
