# External Brain in Markdown (Qualia-san)

このリポジトリは、クオリアさんに関する情報をMarkdownファイルとして保存しています。

## Scrapboxデータ取得ツール

### Scrapbox検索ツール

`tools/scrapbox_search.js` は、Scrapbox APIを使用して特定のプロジェクト内でキーワード検索を行い、検索結果をScrapbox形式で取得するツールです。

#### 機能

- 指定したプロジェクト内でキーワード検索
- 検索結果のページをScrapbox形式で取得
- 認証が必要なプロジェクトにも対応（SIDを設定）

#### 使用方法

```bash
node tools/scrapbox_search.js
```

### Scrapboxページ取得・書き込みツール

`tools/scrapbox_page_writer.js` は、Scrapbox APIを使用して特定のページをScrapbox形式で取得し、write_cosenseを使って別のプロジェクトに書き込むツールです。

#### 機能

- 指定したページをScrapbox形式で取得
- 取得したデータをwrite_cosenseを使って別のプロジェクトに書き込み
- 複数ページの一括取得・書き込みに対応

#### 使用方法

```bash
node tools/scrapbox_page_writer.js
```

#### 設定

スクリプト内の以下の変数を編集して、取得元・書き込み先を変更できます：

```javascript
const PROJECT_SOURCE = 'qualia-san';  // 取得元プロジェクト名
const PROJECT_DESTINATION = 'external_brain_in_markdown_qualia_san';  // 書き込み先プロジェクト名
const TARGET_PAGES = [
  'NovelAIによる画像生成プロセス',
  'クオリアさんの未使用画像',
  'クオリアさんの未使用画像Dropbox'
];
```
