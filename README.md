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

### Scrapboxページ取得ツール

`tools/scrapbox_page_fetcher.js` は、Scrapbox APIを使用して特定のページをScrapbox形式で取得し、ファイルに保存するツールです。

#### 機能

- 指定したページをScrapbox形式で取得
- 取得したデータをファイルに保存
- 複数ページの一括取得に対応

#### 使用方法

```bash
node tools/scrapbox_page_fetcher.js
```

#### 設定

スクリプト内の以下の変数を編集して、取得対象を変更できます：

```javascript
const PROJECT_SOURCE = 'qualia-san';  // 取得元プロジェクト名
const TARGET_PAGES = [
  'NovelAIによる画像生成プロセス',
  'クオリアさんの未使用画像',
  'クオリアさんの未使用画像Dropbox'
];
```
