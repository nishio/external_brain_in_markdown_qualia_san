import 'dotenv/config';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const PROJECT_SOURCE = 'qualia-san';  // 取得元プロジェクト名
const OUTPUT_DIR = path.resolve('../scrapbox_pages');  // 出力ディレクトリ
const BASE_URL = 'https://scrapbox.io/api';

const TARGET_PAGES = [
  'NovelAIによる画像生成プロセス',
  'クオリアさんの未使用画像',
  'クオリアさんの未使用画像Dropbox'
];

const headers = {};
if (process.env.SCRAPBOX_SID) {
  headers.Cookie = `connect.sid=${process.env.SCRAPBOX_SID}`;
}

/**
 * 特定ページのテキスト形式を取得する
 * @param {string} project プロジェクト名
 * @param {string} title ページタイトル
 * @returns {Promise<string>} ページのテキスト形式
 */
async function getPageText(project, title) {
  const url = `${BASE_URL}/pages/${project}/${encodeURIComponent(title)}/text`;
  
  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`テキスト取得APIエラー: ${response.status} ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error(`"${title}"のテキスト取得中にエラーが発生しました:`, error);
    return null;
  }
}

/**
 * テキストをファイルに保存する
 * @param {string} title ページタイトル
 * @param {string} text ページのテキスト
 */
function saveTextToFile(title, text) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const filePath = path.join(OUTPUT_DIR, `${title}.txt`);
  fs.writeFileSync(filePath, text);
  console.log(`ファイルに保存しました: ${filePath}`);
  return true;
}

/**
 * write_cosenseを使用してページを書き込む
 * 注意: この関数を使用するには適切な権限が必要です。
 * 現在は403 Forbiddenエラーが発生するため、代わりにファイルに保存しています。
 * 
 * @param {string} project プロジェクト名
 * @param {string} title ページタイトル
 * @param {string} text ページのテキスト
 */
async function writePageWithCosense(project, title, text) {
  const url = `${BASE_URL}/pages/${project}/${encodeURIComponent(title)}`;
  
  try {
    console.log(`注: write_cosenseでの書き込みは権限の問題で現在実行できません。ファイルに保存します。`);
    
    /*
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text
      })
    });
    
    if (!response.ok) {
      throw new Error(`ページ書き込みAPIエラー: ${response.status} ${response.statusText}`);
    }
    
    console.log(`"${title}" をwrite_cosenseで書き込みました`);
    */
    
    return saveTextToFile(title, text);
  } catch (error) {
    console.error(`"${title}"の処理中にエラーが発生しました:`, error);
    return false;
  }
}

/**
 * メイン実行関数
 */
async function main() {
  console.log(`${PROJECT_SOURCE}プロジェクトから特定のページを取得しています...`);
  console.log(`注: write_cosenseでの書き込みは権限の問題で実行できないため、ファイルに保存します。`);
  
  for (const pageTitle of TARGET_PAGES) {
    console.log(`\n--- ${pageTitle} を処理中 ---`);
    
    const text = await getPageText(PROJECT_SOURCE, pageTitle);
    if (text) {
      console.log(`"${pageTitle}" のテキストを取得しました（${text.length}文字）`);
      
      const success = await writePageWithCosense(null, pageTitle, text);
      if (success) {
        console.log(`"${pageTitle}" の処理が完了しました`);
      } else {
        console.log(`"${pageTitle}" の処理に失敗しました`);
      }
    } else {
      console.log(`[${pageTitle}]のテキスト取得に失敗しました。`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n処理が完了しました。');
}

main().catch(error => {
  console.error('スクリプト実行中にエラーが発生しました:', error);
});
