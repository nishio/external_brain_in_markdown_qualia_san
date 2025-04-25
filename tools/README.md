# クオリアさん情報収集・追加作業の引き継ぎメモ

## 作業概要
villagepumpサイトからクオリアさんに関する情報を収集し、qualia-sanまとめサイトに追加する作業

## 必要な準備
1. write_cosenseリポジトリのクローン
   ```
   git clone https://github.com/nishio/write_cosense
   cd write_cosense
   ```

2. Denoのインストール
   ```
   curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=~/.deno sh
   export PATH="$HOME/.deno/bin:$PATH"
   ```

3. 環境設定
   - `.env`ファイルを作成し、CONNECT_SIDを設定
   ```
   CONNECT_SID="your_connect_sid_here"
   ```
   - CONNECT_SIDはScrapboxにログインした状態でブラウザの開発者ツールから取得

## 情報収集手順
1. villagepumpサイトで「クオリアさん」に関する情報を検索
   - 検索URL: https://scrapbox.io/villagepump/search/page?q=%E3%82%AF%E3%82%AA%E3%83%AA%E3%82%A2%E3%81%95%E3%82%93

2. qualia-sanまとめサイトで既存情報を確認
   - サイトURL: https://scrapbox.io/qualia-san/

3. 未追加の情報を特定し、出典を明記して書き写す

## 追加手順
1. TypeScriptファイルの作成
   ```typescript
   import { insertLines } from "./insertLines.ts";

   await insertLines(
     "qualia-san", // プロジェクト名
     "新しいページタイトル", // 追加するページのタイトル
     "", // 新規ページの場合は空文字
     `ページの内容
     
     from [https://scrapbox.io/villagepump/元ページ 元ページタイトル]
     元ページの内容をそのまま書き写す...`,
     { sid: Deno.env.get("CONNECT_SID") },
   );
   ```

2. スクリプト実行
   ```
   deno run --env-file -A -r=https://scrapbox.io 作成したファイル名.ts
   ```

3. 追加確認
   - ブラウザでqualia-sanまとめサイトを開き、追加されたページを確認

## 変換手順
1. Markdownからscrapbox形式への変換
   ```bash
   cd tools
   npm install
   npm run convert
   ```
   
2. 変換結果の確認
   - `scrapbox_pages` ディレクトリに変換されたファイルが保存されます

## 注意点
- 「まとめる」とは「井戸端にある内容を出典を明記して書き写すこと」
- 画像情報も含めて収集する
- 複数ページから情報を収集する場合は、それぞれの出典を明記する

これで今回と同様の作業を効率的に行うことができます。
