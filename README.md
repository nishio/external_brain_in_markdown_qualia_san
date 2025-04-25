# External Brain in Markdown (Qualia-san)

このリポジトリは、クオリアさんに関する情報をMarkdownファイルとして保存しています。

## Markdownファイルの変換ツール

### Markdown to Scrapbox 変換ツール

`tools/markdown_to_scrapbox.js` は、Markdownファイルを[Scrapbox](https://scrapbox.io)形式に変換するためのツールです。

#### 機能

- Markdownの見出し、リスト、リンク、強調などの記法をScrapbox形式に変換
- フロントマターからタイトルを抽出（存在する場合）
- 単一ファイルまたはディレクトリ内の全Markdownファイルを一括変換
- 変換結果を指定したディレクトリに保存

#### 使用方法

単一ファイルの変換:

```bash
node tools/markdown_to_scrapbox.js path/to/file.md output/directory
```

ディレクトリ内の全Markdownファイルの変換:

```bash
node tools/markdown_to_scrapbox.js path/to/markdown/directory output/directory
```

デフォルトでは、`pages`ディレクトリ内のMarkdownファイルを`scrapbox_pages`ディレクトリに変換します:

```bash
node tools/markdown_to_scrapbox.js
```
