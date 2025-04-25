# External Brain in Markdown (Qualia-san)

Scrapbox形式でクオリアさんの情報を管理するリポジトリです。

## ディレクトリ構成

- `pages/` - Markdown形式のオリジナルファイル
- `scrapbox_pages/` - Scrapbox形式に変換されたファイル（変換後）
- `tools/` - 変換・検索などのユーティリティツール

## 使用方法

### Scrapbox検索ツール

villagepumpプロジェクトから「クオリアさん」に関する情報を検索します。

```bash
cd tools
npm install
npm run search
```

### Markdown -> Scrapbox変換ツール

Markdown形式のファイルをScrapbox形式に変換します。

```bash
cd tools
npm install
npm run convert
```

## 環境設定

`.env`ファイルを`tools`ディレクトリに作成し、必要に応じてScrapbox SIDを設定します。

```
SCRAPBOX_SID=your_connect_sid_here
```

SIDはScrapboxにログインした状態でブラウザの開発者ツールから取得できます。
