const fs = require('fs');
const path = require('path');

const transcriptDir = path.join(__dirname, '../data/vlearn-pack/transcript');
const outputFile = path.join(__dirname, '../codebase/knowledge_base.js');

const stopWords = new Set([
  'là', 'và', 'nhưng', 'một', 'cái', 'thì', 'mà', 'có', 'không', 'cho', 'của', 'với', 'các', 'những', 'để', 'sẽ', 'được', 'rất', 'thế', 'này', 'khi', 'trong', 'đó', 'từ', 'lại', 'đến', 'nhiều', 'bị', 'sự', 'như', 'nào', 'đang', 'cũng', 'đã', 'hay', 'ra', 'vào', 'lên', 'xuống', 'qua', 'lại', 'phải', 'thấy', 'nhất', 'hơn', 'chỉ', 'còn', 'sau', 'bên', 'rồi', 'thực', 'theo', 'nếu', 'hoặc', 'tại', 'về', 'làm', 'cách', 'người', 'mình', 'chúng', 'ta', 'nó'
]);

function extractKeywords(text) {
  const words = text.toLowerCase().replace(/[.,!?;()[\]{}"':*]/g, '').split(/\s+/);
  const counts = {};
  for (const word of words) {
    if (word.length > 2 && !stopWords.has(word) && isNaN(word)) {
      counts[word] = (counts[word] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(e => e[0]);
}

function processFiles() {
  const files = fs.readdirSync(transcriptDir).filter(f => f.endsWith('.md') && f.startsWith('transcript-'));
  const knowledgeBase = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(transcriptDir, file), 'utf8');
    const lines = content.split('\n');
    
    let currentDay = 'Chưa xác định';
    let currentTopic = 'Chung';

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Extract Day from h1 or h2 if it has "Day X"
      if (trimmed.startsWith('# ')) {
        const dayMatch = trimmed.match(/Day \d+/i);
        if (dayMatch) {
          currentDay = dayMatch[0];
        }
      }
      
      if (trimmed.startsWith('## ')) {
        currentTopic = trimmed.substring(3).trim();
      }

      // Match lines like: **[T01-001]** ... or [T01-001] ...
      const refMatch = trimmed.match(/^\*?\*?\[(T\d{2}-\d{3})\]\*?\*?\s*(.+)$/);
      if (refMatch) {
        const ref = refMatch[1];
        const excerpt = refMatch[2].trim();
        const keywords = extractKeywords(excerpt);
        
        knowledgeBase.push({
          ref,
          day: currentDay,
          topic: currentTopic,
          excerpt,
          keywords
        });
      }
    }
  }

  console.log(`Extracted ${knowledgeBase.length} records.`);
  
  const jsContent = `// Tự động sinh từ script build_knowledge_base.js\nconst KNOWLEDGE_BASE = ${JSON.stringify(knowledgeBase, null, 2)};\n`;
  
  fs.writeFileSync(outputFile, jsContent, 'utf8');
  console.log(`Saved to ${outputFile}`);
}

processFiles();
