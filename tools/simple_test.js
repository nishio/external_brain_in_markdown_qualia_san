import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testSingleFileConversion() {
  try {
    const inputFile = path.join(__dirname, '../pages/クオリアさんはいます.md');
    const outputFile = path.join(__dirname, '../scrapbox_pages/クオリアさんはいます.txt');
    
    console.log('入力ファイル:', inputFile);
    console.log('出力ファイル:', outputFile);
    
    const content = await fs.readFile(inputFile, 'utf-8');
    console.log('ファイル内容を読み込みました');
    
    const contentWithoutFrontmatter = content.replace(/---\r?\n([\s\S]*?)\r?\n---\r?\n/g, '');
    console.log('フロントマターを削除しました');
    
    const tempFile = '/tmp/simple_test.md';
    await fs.writeFile(tempFile, contentWithoutFrontmatter);
    console.log('一時ファイルに保存しました:', tempFile);
    
    console.log('md2sbで変換を実行します...');
    const { stdout } = await execAsync(`npx md2sb ${tempFile}`);
    console.log('変換が完了しました');
    
    await fs.ensureDir(path.dirname(outputFile));
    console.log('出力ディレクトリを確認しました');
    
    await fs.writeFile(outputFile, stdout);
    console.log('変換結果を保存しました:', outputFile);
    
    await fs.remove(tempFile);
    console.log('一時ファイルを削除しました');
    
    console.log('変換テストが完了しました');
  } catch (error) {
    console.error('変換テスト中にエラーが発生しました:', error);
    console.error(error.stack);
  }
}

testSingleFileConversion();
