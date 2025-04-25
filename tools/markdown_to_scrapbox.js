import fs from 'fs';
import path from 'path';

/**
 * Markdownファイルをスキャンしてタイトルとコンテンツを抽出する
 * @param {string} filePath Markdownファイルのパス
 * @returns {Object} タイトルとコンテンツを含むオブジェクト
 */
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let title = path.basename(filePath, '.md');
  let frontMatter = false;
  let frontMatterTitle = '';
  let contentStart = 0;
  
  if (lines[0] === '---') {
    frontMatter = true;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        frontMatter = false;
        contentStart = i + 1;
        break;
      }
      
      if (lines[i].startsWith('title:')) {
        frontMatterTitle = lines[i].substring(6).trim().replace(/"/g, '');
      }
    }
  }
  
  if (frontMatterTitle) {
    title = frontMatterTitle;
  }
  
  const contentLines = lines.slice(contentStart);
  
  return {
    title,
    content: contentLines.join('\n')
  };
}

/**
 * Markdown形式をScrapbox形式に変換する
 * @param {string} markdown Markdown形式のテキスト
 * @param {string} title ページタイトル
 * @returns {string} Scrapbox形式のテキスト
 */
function convertMarkdownToScrapbox(markdown, title) {
  let lines = markdown.split('\n');
  let scrapboxLines = [];
  
  scrapboxLines.push(title);
  scrapboxLines.push(''); // 空行
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    if (line === title) {
      continue;
    }
    
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length - 1; // #が1つなら0、##なら1
      const text = headingMatch[2];
      const indent = ' '.repeat(level);
      scrapboxLines.push(`${indent}[** ${text}]`);
      continue;
    }
    
    const listMatch = line.match(/^(\s*)[*-]\s+(.+)$/);
    if (listMatch) {
      const indent = listMatch[1];
      let text = listMatch[2];
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$2 $1]');
      scrapboxLines.push(`${indent} ${text}`);
      continue;
    }
    
    line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$2 $1]');
    
    line = line.replace(/\*\*([^*]+)\*\*/g, '[* $1]');
    
    line = line.replace(/\*([^*]+)\*/g, '[/ $1]');
    
    line = line.replace(/`([^`]+)`/g, '`$1`');
    
    scrapboxLines.push(line);
  }
  
  let scrapbox = scrapboxLines.join('\n');
  scrapbox = scrapbox.replace(/```([^`]*?)```/gs, (match, p1) => {
    const codeLines = p1.trim().split('\n');
    return codeLines.map(line => ` code:${line}`).join('\n');
  });
  
  scrapbox = scrapbox.replace(/^\s*$/gm, ' ');
  
  return scrapbox;
}

/**
 * 指定されたディレクトリ内のMarkdownファイルをScrapbox形式に変換する
 * @param {string} sourceDir Markdownファイルのディレクトリ
 * @param {string} outputDir 出力先ディレクトリ
 */
function convertDirectory(sourceDir, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(sourceDir);
  
  let convertedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const subOutputDir = path.join(outputDir, file);
      convertedCount += convertDirectory(filePath, subOutputDir);
    } else if (file.endsWith('.md')) {
      const { title, content } = parseMarkdownFile(filePath);
      const scrapboxContent = convertMarkdownToScrapbox(content, title);
      
      const outputPath = path.join(outputDir, `${path.basename(file, '.md')}.txt`);
      fs.writeFileSync(outputPath, scrapboxContent);
      
      console.log(`変換完了: ${filePath} → ${outputPath}`);
      convertedCount++;
    }
  }
  
  return convertedCount;
}

/**
 * 単一のMarkdownファイルをScrapbox形式に変換する
 * @param {string} inputFile 入力ファイルパス
 * @param {string} outputDir 出力ディレクトリ
 */
function convertSingleFile(inputFile, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const { title, content } = parseMarkdownFile(inputFile);
  const scrapboxContent = convertMarkdownToScrapbox(content, title);
  
  const outputPath = path.join(outputDir, `${path.basename(inputFile, '.md')}.txt`);
  fs.writeFileSync(outputPath, scrapboxContent);
  
  console.log(`変換完了: ${inputFile} → ${outputPath}`);
  return 1;
}

/**
 * メイン実行関数
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length >= 2) {
    const inputFile = path.resolve(args[0]);
    const outputDir = path.resolve(args[1]);
    
    console.log(`Markdownファイルを変換しています...`);
    console.log(`入力ファイル: ${inputFile}`);
    console.log(`出力ディレクトリ: ${outputDir}`);
    
    if (fs.statSync(inputFile).isFile()) {
      const convertedCount = convertSingleFile(inputFile, outputDir);
      console.log(`変換完了: ${convertedCount}ファイルを変換しました。`);
    } else {
      const convertedCount = convertDirectory(inputFile, outputDir);
      console.log(`変換完了: ${convertedCount}ファイルを変換しました。`);
    }
  } else {
    const sourceDir = path.resolve(args[0] || '../pages');
    const outputDir = path.resolve(args[1] || '../scrapbox_pages');
    
    console.log(`Markdownファイルを変換しています...`);
    console.log(`ソースディレクトリ: ${sourceDir}`);
    console.log(`出力ディレクトリ: ${outputDir}`);
    
    const convertedCount = convertDirectory(sourceDir, outputDir);
    console.log(`変換完了: ${convertedCount}ファイルを変換しました。`);
  }
}

main();
