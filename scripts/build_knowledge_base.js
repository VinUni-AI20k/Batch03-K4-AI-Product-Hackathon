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
  const files = fs.readdirSync(transcriptDir).filter(f => f.endsWith('.md') && f.startsWith('transcript-')).sort();
  const knowledgeBase = [];
  let skippedActivity = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(transcriptDir, file), 'utf8');
    const lines = content.split('\n');

    // Buổi lấy từ dòng metadata "Định vị buổi:" ở đầu file bản sạch — chính xác hơn
    // là dò "Day N" trong tiêu đề, vì 2/6 file không gắn số ngày.
    const dayMatch = content.match(/\*\*Định vị buổi:\*\*\s*([^—\n]+?)(?:\s*—|\s*\n)/);
    const currentDay = dayMatch ? dayMatch[1].trim() : 'Chưa xác định';
    let currentTopic = 'Chung';

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        currentTopic = trimmed.substring(3).trim();
      }

      // Match lines like: **[T01-001]** ... or [T01-001] ...
      const refMatch = trimmed.match(/^\*?\*?\[(T\d{2}-\d{3})\]\*?\*?\s*(.+)$/);
      if (!refMatch) continue;

      const ref = refMatch[1];
      const excerpt = refMatch[2].trim();

      // Bỏ đoạn [Hoạt động lớp: ...] — ghi chú hành chính/tương tác, không phải nội dung
      // giảng. Trích dẫn những đoạn này chính là kịch bản K10 trong spec §5 (cite đúng mã
      // nhưng nội dung không dạy gì), nên chúng không được vào knowledge base.
      if (/^\[Hoạt động lớp:/.test(excerpt)) { skippedActivity++; continue; }

      knowledgeBase.push({
        ref,
        day: currentDay,
        topic: currentTopic,
        excerpt,
        keywords: extractKeywords(excerpt)
      });
    }
  }

  console.log(`Extracted ${knowledgeBase.length} records (skipped ${skippedActivity} class-activity notes).`);

  const jsContent = `// Tự động sinh từ script build_knowledge_base.js — KHÔNG sửa tay.\n`
    + `// Nguồn: data/vlearn-pack/transcript/ · chạy lại: node scripts/build_knowledge_base.js\n`
    + `const KNOWLEDGE_BASE = ${JSON.stringify(knowledgeBase, null, 2)};\n\n`
    + `if (typeof module !== 'undefined') { module.exports = { KNOWLEDGE_BASE }; }\n`;

  fs.writeFileSync(outputFile, jsContent, 'utf8');
  console.log(`Saved to ${outputFile}`);
}

processFiles();
