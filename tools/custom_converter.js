import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PAGES_DIR = path.join(__dirname, '../pages');
const OUTPUT_DIR = path.join(__dirname, '../scrapbox_pages');

/**
 * Markdownをシンプルなルールでscrapbox形式に変換する
 * @param {string} markdown Markdown形式のテキスト
 * @returns {string} Scrapbox形式のテキスト
 */
function convertToScrapbox(markdown) {
  let scrapbox = markdown;
  
  scrapbox = scrapbox.replace(/---\r?\n([\s\S]*?)\r?\n---\r?\n/g, '');
  
  let title = '';
  const titleMatch = scrapbox.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    title = titleMatch[1];
    scrapbox = scrapbox.replace(/^#\s+(.+)$/m, '');
  }
  
  scrapbox = scrapbox.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1 $2]');
  
  scrapbox = scrapbox.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '[$2]');
  
  
  scrapbox = scrapbox.replace(/\*\*([^*]+)\*\*/g, '[[$1]]');
  
  scrapbox = scrapbox.replace(/\*([^*]+)\*/g, '[/$1]');
  
  scrapbox = scrapbox.replace(/^##\s+(.+)$/gm, '[** $1]');
  scrapbox = scrapbox.replace(/^###\s+(.+)$/gm, '[*** $1]');
  
  
  
  if (title) {
    scrapbox = `[*** ${title}]\n\n${scrapbox}`;
  }
  
  return scrapbox.trim();
}

/**
 * 単一のMarkdownファイルをScrapbox形式に変換
 */
async function convertSingleFile(inputFile, outputFile) {
  try {
    console.log(`変換中: ${inputFile} -> ${outputFile}`);
    
    const content = await fs.readFile(inputFile, 'utf-8');
    
    const scrapboxContent = convertToScrapbox(content);
    
    await fs.ensureDir(path.dirname(outputFile));
    
    await fs.writeFile(outputFile, scrapboxContent);
    
    console.log(`変換完了: ${path.basename(inputFile)}`);
    return true;
  } catch (error) {
    console.error(`"${inputFile}"の変換中にエラーが発生しました:`, error);
    return false;
  }
}

/**
 * すべてのMarkdownファイルをScrapbox形式に変換
 */
async function convertAllFiles() {
  try {
    console.log('出力ディレクトリを作成します:', OUTPUT_DIR);
    await fs.ensureDir(OUTPUT_DIR);
    
    console.log('Markdownファイルを検索します:', PAGES_DIR);
    const files = await fs.readdir(PAGES_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`${markdownFiles.length}個のMarkdownファイルを変換します...`);
    
    const filesToProcess = markdownFiles;
    console.log(`${filesToProcess.length}個のファイルを処理します...`);
    
    let successCount = 0;
    
    for (const file of filesToProcess) {
      const inputPath = path.join(PAGES_DIR, file);
      const outputPath = path.join(OUTPUT_DIR, file.replace('.md', '.txt'));
      
      const success = await convertSingleFile(inputPath, outputPath);
      if (success) {
        successCount++;
      }
    }
    
    console.log(`変換完了: ${successCount}/${filesToProcess.length}ファイルを変換しました`);
  } catch (error) {
    console.error('ファイル変換中にエラーが発生しました:', error);
    console.error(error.stack);
  }
}

convertAllFiles();
