import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PAGES_DIR = path.resolve(__dirname, '../pages');
const OUTPUT_DIR = path.resolve(__dirname, '../scrapbox_pages');

console.log('PAGES_DIR:', PAGES_DIR);
console.log('OUTPUT_DIR:', OUTPUT_DIR);

/**
 * Markdownファイルからフロントマターを削除し、Scrapbox形式に変換する
 * @param {string} filePath Markdownファイルのパス
 * @returns {Promise<string>} Scrapbox形式に変換された内容
 */
async function convertMarkdownToScrapbox(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    let scrapboxContent = content.replace(/---\r?\n([\s\S]*?)\r?\n---\r?\n/g, '');
    
    const tempFile = path.join('/tmp', `temp_${Date.now()}.md`);
    await fs.writeFile(tempFile, scrapboxContent);
    
    const { stdout } = await execAsync(`npx md2sb ${tempFile}`);
    await fs.remove(tempFile);
    
    return stdout;
  } catch (error) {
    console.error(`"${filePath}"の変換中にエラーが発生しました:`, error);
    return null;
  }
}

/**
 * すべてのMarkdownファイルをScrapbox形式に変換
 */
async function convertAllMarkdownFiles() {
  try {
    console.log('出力ディレクトリを作成します:', OUTPUT_DIR);
    await fs.ensureDir(OUTPUT_DIR);
    
    console.log('Markdownファイルを検索します:', PAGES_DIR);
    const files = await fs.readdir(PAGES_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`${markdownFiles.length}個のMarkdownファイルを変換します...`);
    
    const filesToProcess = markdownFiles.slice(0, 5);
    console.log('処理するファイル:', filesToProcess);
    
    for (const file of filesToProcess) {
      const inputPath = path.join(PAGES_DIR, file);
      const outputPath = path.join(OUTPUT_DIR, file.replace('.md', '.txt'));
      
      console.log(`変換中: ${inputPath} -> ${outputPath}`);
      const scrapboxContent = await convertMarkdownToScrapbox(inputPath);
      
      if (scrapboxContent) {
        console.log(`ファイルに書き込み中: ${outputPath}`);
        await fs.writeFile(outputPath, scrapboxContent);
        console.log(`変換完了: ${file} -> ${path.basename(outputPath)}`);
      }
    }
    
    console.log('すべてのファイルの変換が完了しました');
  } catch (error) {
    console.error('ファイル変換中にエラーが発生しました:', error);
    console.error(error.stack);
  }
}

convertAllMarkdownFiles();
