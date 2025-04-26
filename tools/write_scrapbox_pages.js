import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PROJECT_SOURCE = 'qualia-san';  // 取得元プロジェクト名
const PROJECT_DESTINATION = 'external_brain_in_markdown_qualia_san';  // 書き込み先プロジェクト名
const WRITE_COSENSE_DIR = path.resolve('/home/ubuntu/write_cosense');  // write_cosenseのディレクトリ
const OUTPUT_DIR = path.resolve('../scrapbox_pages');  // 出力ディレクトリ（バックアップ用）

const TARGET_PAGES = [
  'NovelAIによる画像生成プロセス',
  'クオリアさんの未使用画像',
  'クオリアさんの未使用画像Dropbox'
];

/**
 * Scrapbox APIからページテキストを取得する
 * @param {string} project プロジェクト名
 * @param {string} title ページタイトル
 * @returns {Promise<string>} ページのテキスト
 */
async function getPageText(project, title) {
  const tsFilePath = path.join(WRITE_COSENSE_DIR, 'write_pages.ts');
  
  const envFilePath = path.join(WRITE_COSENSE_DIR, '.env');
  fs.writeFileSync(envFilePath, `CONNECT_SID="${process.env.SID}"`);
  
  try {
    console.log(`"${title}" のテキストを取得中...`);
    
    const command = `cd ${WRITE_COSENSE_DIR} && export PATH="$HOME/.deno/bin:$PATH" && deno run --allow-all --env write_pages.ts`;
    execSync(command, { stdio: 'inherit' });
    
    console.log(`"${title}" のテキストを取得・書き込みが完了しました`);
    return true;
  } catch (error) {
    console.error(`"${title}"の処理中にエラーが発生しました:`, error);
    return false;
  }
}

/**
 * メイン実行関数
 */
async function main() {
  console.log(`${PROJECT_SOURCE}プロジェクトから特定のページを取得し、${PROJECT_DESTINATION}プロジェクトに書き込みます...`);
  console.log(`write_cosenseを使用して書き込みを行います。`);
  
  const writePagesTsContent = `
import { insertLines } from "./insertLines.ts";

const TARGET_PAGES = [
  'NovelAIによる画像生成プロセス',
  'クオリアさんの未使用画像',
  'クオリアさんの未使用画像Dropbox'
];

async function getPageText(project: string, title: string) {
  const url = \`https://scrapbox.io/api/pages/\${project}/\${encodeURIComponent(title)}/text\`;
  
  const headers: HeadersInit = {};
  const sid = Deno.env.get("CONNECT_SID");
  if (sid) {
    headers.Cookie = \`connect.sid=\${sid}\`;
  }
  
  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(\`テキスト取得APIエラー: \${response.status} \${response.statusText}\`);
    }
    
    return await response.text();
  } catch (error) {
    console.error(\`"\${title}"のテキスト取得中にエラーが発生しました:\`, error);
    return null;
  }
}

async function main() {
  const PROJECT_SOURCE = 'qualia-san';  // 取得元プロジェクト名
  const PROJECT_DESTINATION = 'external_brain_in_markdown_qualia_san';  // 書き込み先プロジェクト名
  
  console.log(\`\${PROJECT_SOURCE}プロジェクトから特定のページを取得し、\${PROJECT_DESTINATION}プロジェクトに書き込みます...\`);
  
  for (const pageTitle of TARGET_PAGES) {
    console.log(\`\\n--- \${pageTitle} を処理中 ---\`);
    
    const text = await getPageText(PROJECT_SOURCE, pageTitle);
    if (text) {
      console.log(\`"\${pageTitle}" のテキストを取得しました（\${text.length}文字）\`);
      
      try {
        console.log(\`write_cosenseでの書き込みを試みます...\`);
        
        await insertLines(
          PROJECT_DESTINATION,
          pageTitle,
          "",  // 新規ページの場合は空文字
          text,
          { sid: Deno.env.get("CONNECT_SID") },
        );
        
        console.log(\`"\${pageTitle}" をwrite_cosenseで書き込みました\`);
      } catch (error) {
        console.error(\`"\${pageTitle}"の書き込み中にエラーが発生しました:\`, error);
      }
    } else {
      console.log(\`[\${pageTitle}]のテキスト取得に失敗しました。\`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\\n処理が完了しました。');
}

main().catch(error => {
  console.error('スクリプト実行中にエラーが発生しました:', error);
});
`;

  const writePagesTsPath = path.join(WRITE_COSENSE_DIR, 'write_pages.ts');
  fs.writeFileSync(writePagesTsPath, writePagesTsContent);
  
  await getPageText(PROJECT_SOURCE, TARGET_PAGES.join(','));
  
  console.log('\n処理が完了しました。');
}

main().catch(error => {
  console.error('スクリプト実行中にエラーが発生しました:', error);
});
