import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const TEST_FILE = path.resolve('../pages/クオリアさんはいます.md');
const OUTPUT_FILE = '/tmp/test_conversion.txt';

/**
 * サンプルファイルでの変換テスト
 */
async function testConversion() {
  try {
    const content = await fs.readFile(TEST_FILE, 'utf-8');
    
    let scrapboxContent = content.replace(/---\r?\n([\s\S]*?)\r?\n---\r?\n/g, '');
    
    const tempFile = '/tmp/test_input.md';
    await fs.writeFile(tempFile, scrapboxContent);
    
    const { stdout } = await execAsync(`npx md2sb ${tempFile}`);
    
    console.log('変換前:');
    console.log('-------------------');
    console.log(content);
    console.log('-------------------');
    console.log('変換後:');
    console.log('-------------------');
    console.log(stdout);
    console.log('-------------------');
    
    await fs.writeFile(OUTPUT_FILE, stdout);
    console.log(`変換結果を ${OUTPUT_FILE} に保存しました`);
    
    await fs.remove(tempFile);
  } catch (error) {
    console.error('変換テスト中にエラーが発生しました:', error);
  }
}

testConversion();
