import 'dotenv/config';
import fetch from 'node-fetch';

const PROJECT = 'villagepump';  // プロジェクト名
const SEARCH_QUERY = 'クオリアさん';  // 検索キーワード
const BASE_URL = 'https://scrapbox.io/api';

const headers = {};
if (process.env.SCRAPBOX_SID) {
  headers.Cookie = `connect.sid=${process.env.SCRAPBOX_SID}`;
}

/**
 * プロジェクト内でページを検索する
 * @param {string} project プロジェクト名
 * @param {string} query 検索クエリ
 * @returns {Promise<Array>} 検索結果
 */
async function searchForPages(project, query) {
  const url = `${BASE_URL}/pages/${project}/search/query?q=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`検索APIエラー: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.pages || [];
  } catch (error) {
    console.error('検索中にエラーが発生しました:', error);
    return [];
  }
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
 * メイン実行関数
 */
async function main() {
  console.log(`"${SEARCH_QUERY}"を${PROJECT}プロジェクトで検索しています...`);
  
  const searchResults = await searchForPages(PROJECT, SEARCH_QUERY);
  
  if (searchResults.length === 0) {
    console.log('検索結果はありませんでした。');
    return;
  }
  
  console.log(`${searchResults.length}件の検索結果が見つかりました。`);
  
  for (const page of searchResults) {
    console.log(`\n--- ${page.title} ---`);
    
    const text = await getPageText(PROJECT, page.title);
    if (text) {
      console.log(text);
    } else {
      console.log(`[${page.title}]のテキスト取得に失敗しました。`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

main().catch(error => {
  console.error('スクリプト実行中にエラーが発生しました:', error);
});
