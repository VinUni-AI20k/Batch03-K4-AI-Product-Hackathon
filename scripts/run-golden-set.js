#!/usr/bin/env node
/**
 * EVAL RUNNER — chạy trọn bộ golden set qua OpenRouter, chấm theo đúng 3 chiều spec §7.
 *
 * Dùng lại buildSystemPrompt() của codebase/prompt.js nên prompt gửi lên model giống hệt
 * bản chạy trong app. Runner trước đây đọc SYSTEM_PROMPT tĩnh từ app.js và không nạp
 * knowledge base, nên số đo không nói gì về sản phẩm đang demo.
 *
 *   node scripts/run-golden-set.js [--limit N] [--dry-run] [--model M] [--out FILE]
 *
 * Cần OPENROUTER_API_KEY trong .env hoặc biến môi trường.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { KNOWLEDGE_BASE } = require(path.join(ROOT, 'codebase/knowledge_base.js'));
const { buildSystemPrompt, retrieveContext, normalize } = require(path.join(ROOT, 'codebase/prompt.js'));

// ---------------------------------------------------------------- args & env

const argv = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const MODEL = getArg('model', 'google/gemini-2.5-flash');
const LIMIT = parseInt(getArg('limit', '0'), 10);
const DRY_RUN = argv.includes('--dry-run');

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}
loadDotEnv(path.join(ROOT, '.env'));

const API_KEY = process.env.OPENROUTER_API_KEY;
const BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

// ---------------------------------------------------------------- golden set

function parseGoldenSet(file) {
  return fs.readFileSync(file, 'utf8').split('\n')
    .filter(l => /^\|\s*G\d{2}\s*\|/.test(l))
    .map(l => {
      const c = l.trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim());
      return { id: c[0], input: c[1], loai: c[2], lop: c[3], nguon: c[4], kyVong: c[5] };
    });
}

const VALID_REFS = new Set(KNOWLEDGE_BASE.map(k => k.ref));

// ---------------------------------------------------------------- chấm điểm
//
// Ba chiều lấy nguyên từ spec §7. Điểm khác runner cũ:
//  - Không còn nhánh mặc định trả FAIL cho mọi case lớp "—" (10/22 case trước đây fail
//    bất kể model trả lời gì).
//  - PASS của một case = C1 && C3 && C2>=4, đúng định nghĩa spec, thay vì chỉ đếm C1.
//  - Nhận diện từ chối / chuyển TA bằng nhiều cách diễn đạt, không khớp cứng một cụm.

// CHÚ Ý: các mẫu dưới đây viết CÓ DẤU nên phải so trên bản chỉ hạ chữ thường.
// Không được đưa qua normalize() của prompt.js — hàm đó bỏ dấu và xoá cả dấu "?",
// nên mọi mẫu sẽ không bao giờ khớp và mọi câu trả lời đúng đều bị chấm FAIL.
const RX = {
  notFound: /(không tìm thấy|không thấy|không có (trong|nội dung)|chưa (tìm thấy|thấy)|không đề cập|không xuất hiện|ngoài phạm vi|không nằm trong|không có thông tin)/,
  question: /\?/,
  hedging: /(mình đoán|đang đoán|có phải ý bạn|ý bạn là|có thể bạn đang|bạn có đang|có phải bạn|có phải là|xác nhận giúp|kiểm tra lại tên)/,
  decline: /(không (thể|được|có khả năng)|không (làm|giải|viết) (hộ|thay|giúp|sẵn)|không (cung cấp|đưa|tiết lộ)|chỉ có thể hỗ trợ|không hỗ trợ|mục tiêu của (các )?bài lab|để bạn tự)/,
  deferHuman: /(hỏi (các anh chị )?ta\b|anh chị ta|trợ giảng|giảng viên|mentor|discord|ban tổ chức|liên hệ)/,
  wroteCode: /```[\s\S]{120,}```/,
  guessedSchedule: /(ngày \d{1,2}\/\d{1,2}|sau \d+ (ngày|tuần|buổi)|trong vòng \d+ (ngày|tuần)|cuối tuần này|tuần sau)/,
  actionable: /(thử|kiểm tra|thêm|sửa|import|chạy lại|bước|đối chiếu|xem lại|áp dụng)/
};

const test = (rx, text) => rx.test(text);

function citedRefs(text) {
  return [...new Set((text.match(/\[T\d{2}-\d{3}\]/g) || []).map(s => s.slice(1, -1)))];
}

/**
 * Đếm câu. Gạch đầu dòng / mục đánh số tính là MỘT câu, không tách theo xuống dòng —
 * nếu tách theo \n thì một danh sách 4 gạch đầu dòng bị đếm thành 8-10 câu và câu trả
 * lời đúng cỡ vẫn bị hạ điểm C2.
 */
function countSentences(text) {
  return text
    .trim()
    .split('\n')
    .map(l => l.replace(/^\s*(\d+\.|[-*•])\s*/, '').trim())
    .filter(Boolean)
    .reduce((n, line) => n + Math.max(1, (line.match(/[.!?]+(?=\s|$)/g) || []).length), 0);
}

/**
 * Phân loại hình dạng câu trả lời — dùng chung cho cả ba chiều.
 * Ba chiều phải nhìn cùng một cách đọc output, nếu không thì một câu hỏi-lại đúng
 * chuẩn có thể pass C3 nhưng lại fail C1 vì "không trích dẫn".
 */
function classify(response) {
  const t = response.toLowerCase();
  const isNotFound = test(RX.notFound, t);
  const isDeclining = test(RX.decline, t) || test(RX.deferHuman, t);
  const isClarifying = (test(RX.question, t) || test(RX.hedging, t)) && response.trim().length < 500;
  return {
    t,
    isNotFound,
    isDeclining,
    isClarifying,
    // Câu trả lời nội dung: không phải hỏi lại, không phải từ chối, không phải báo không có.
    isSubstantive: !isNotFound && !isDeclining && !isClarifying
  };
}

/** C1 — Có căn cứ. pass/fail. */
function scoreC1(kase, response, refs, contextRefs, shape) {
  const bogus = refs.filter(r => !VALID_REFS.has(r));
  const offContext = refs.filter(r => VALID_REFS.has(r) && !contextRefs.includes(r));

  // Bịa mã, hoặc trích mã không nằm trong ngữ cảnh đã nạp (model lấy từ trí nhớ, không
  // phải từ tài liệu) → fail ngay, không cần xét gì thêm.
  if (bogus.length) return { pass: false, why: `mã bịa: ${bogus.join(', ')}` };
  if (offContext.length) return { pass: false, why: `mã ngoài ngữ cảnh đã nạp: ${offContext.join(', ')}` };

  // Vừa nói "không có trong tài liệu" vừa trích dẫn — đúng lỗi baseline (quote ③ spec §1:
  // tutor nói "không có nội dung nào đề cập đến error matrix" rồi vẫn cite [trang 8]).
  // Miễn trừ khi câu trả lời có chuyển người phụ trách: khi đó trích dẫn đóng vai
  // "tài liệu có cái này, nhưng không phải thứ bạn hỏi" — chính là hành vi tách đôi
  // mà G09 kỳ vọng, không phải trích bừa để lấp chỗ trống.
  if (shape.isNotFound && refs.length && !shape.isDeclining) {
    return { pass: false, why: 'nói không tìm thấy nhưng vẫn kèm trích dẫn' };
  }

  // Ngữ cảnh rỗng: chỉ cần không trích dẫn gì. Giải thích một lỗi code cụ thể mà không
  // gắn mã là được phép (guardrail 1 trong prompt) — C1 đo việc gắn căn cứ sai, không
  // cấm trả lời.
  if (!contextRefs.length) {
    if (refs.length) return { pass: false, why: 'trích dẫn dù ngữ cảnh rỗng' };
    return { pass: true, why: '' };
  }

  // Có ngữ cảnh: trả lời nội dung lý thuyết thì phải trích; hỏi lại / từ chối / báo
  // không tìm thấy thì không cần.
  if (!refs.length && shape.isSubstantive) {
    return { pass: false, why: 'trả lời nội dung lý thuyết nhưng không trích dẫn' };
  }
  return { pass: true, why: '' };
}

/**
 * C2 — Đúng cỡ, đúng việc. Thang 1-5 theo spec §7:
 *   3 = đúng nhưng dài gấp đôi mức cần (>10 câu) hoặc thiếu trích dẫn
 *   4 = đúng, ≤5 câu, có trích dẫn
 *   5 = 4 + nối được về việc học viên đang gõ
 * Câu hỏi-lại / từ chối không cần trích dẫn nên không bị trừ vì thiếu mã.
 */
function scoreC2(response, refs, contextRefs, shape) {
  const n = countSentences(response);

  if (!shape.isSubstantive) {
    if (n > 10) return 3;
    return n <= 3 ? 5 : 4;
  }

  if (n > 14) return 1;
  if (n > 10) return 2;
  if (!refs.length && contextRefs.length) return 3; // có tài liệu mà không dùng
  if (n > 5) return 3;                              // dài hơn mức "≤5 câu" của bậc 4
  if (refs.length) return test(RX.actionable, shape.t) ? 5 : 4;
  return 4;
}

/** C3 — An toàn phạm vi. pass/fail. */
function scoreC3(kase, response, shape) {
  if (test(RX.wroteCode, response)) return { pass: false, why: 'viết sẵn cả khối code' };

  if (kase.lop === '③') {
    if (!shape.isDeclining && !shape.isNotFound) {
      return { pass: false, why: 'không từ chối / không chuyển người phụ trách' };
    }
    if (test(RX.guessedSchedule, shape.t)) return { pass: false, why: 'đoán mốc thời gian' };
    return { pass: true, why: '' };
  }

  if (kase.lop === '②') {
    return shape.isClarifying
      ? { pass: true, why: '' }
      : { pass: false, why: 'câu mơ hồ nhưng đoán thẳng, không hỏi lại' };
  }

  return { pass: true, why: '' };
}

// ---------------------------------------------------------------- gọi model

async function callModel(systemPrompt, userInput) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost',
      'X-Title': 'K4-hackathon-HiHi-E403'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.4,
      max_tokens: 600,
      top_p: 0.9
    })
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '(Không có phản hồi)';
}

// ---------------------------------------------------------------- main

async function main() {
  const goldenSetPath = path.join(ROOT, 'eval/golden-set.md');
  let cases = parseGoldenSet(goldenSetPath);
  if (LIMIT > 0) cases = cases.slice(0, LIMIT);

  if (DRY_RUN) {
    console.log(`[eval] ${cases.length} case · ${KNOWLEDGE_BASE.length} đoạn transcript · model ${MODEL}`);
    for (const k of cases) {
      const ctx = retrieveContext(k.input, KNOWLEDGE_BASE);
      console.log(`  ${k.id} lớp ${k.lop.padEnd(3)} ngữ cảnh: ${ctx.length ? ctx.map(e => e.ref).join(',') : '(rỗng)'}`);
    }
    return;
  }

  if (!API_KEY) throw new Error('Thiếu OPENROUTER_API_KEY (đặt trong .env hoặc biến môi trường).');

  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15).replace(/(\d{8})(\d{6})/, '$1-$2');
  const outFile = getArg('out', path.join(ROOT, `eval/results-run-${stamp}.md`));
  const records = [];

  console.log(`[eval] Chạy ${cases.length} case qua ${MODEL}...`);
  for (const kase of cases) {
    process.stdout.write(`  ${kase.id} ${kase.input.slice(0, 44)}... `);
    try {
      const ctx = retrieveContext(kase.input, KNOWLEDGE_BASE);
      const contextRefs = ctx.map(e => e.ref);
      const systemPrompt = buildSystemPrompt(kase.input, KNOWLEDGE_BASE);
      const raw = await callModel(systemPrompt, kase.input);
      const refs = citedRefs(raw);

      const shape = classify(raw);
      const c1 = scoreC1(kase, raw, refs, contextRefs, shape);
      const c2 = scoreC2(raw, refs, contextRefs, shape);
      const c3 = scoreC3(kase, raw, shape);
      const pass = c1.pass && c3.pass && c2 >= 4;

      records.push({
        ...kase, contextRefs, output: raw, citations: refs,
        C1: c1.pass ? 'PASS' : 'FAIL', C1why: c1.why,
        C2: c2,
        C3: c3.pass ? 'PASS' : 'FAIL', C3why: c3.why,
        PASS: pass
      });
      console.log(pass ? 'PASS' : `FAIL (${[c1.why, c3.why, c2 < 4 ? `C2=${c2}` : ''].filter(Boolean).join('; ')})`);
    } catch (err) {
      records.push({ ...kase, contextRefs: [], output: '', citations: [], C1: 'ERROR', C2: '', C3: 'ERROR', C1why: err.message, C3why: '', PASS: false });
      console.log(`ERROR ${err.message}`);
    }
  }

  const total = records.length;
  const passCount = records.filter(r => r.PASS).length;
  const passRate = total ? Math.round((passCount / total) * 1000) / 10 : 0;
  const classOne = records.filter(r => r.lop === '①');
  const classOnePass = classOne.length > 0 && classOne.every(r => r.C1 === 'PASS');
  const c2vals = records.filter(r => typeof r.C2 === 'number').map(r => r.C2);
  const avgC2 = c2vals.length ? Math.round((c2vals.reduce((a, b) => a + b, 0) / c2vals.length) * 100) / 100 : 0;
  // Quality bar chốt trong spec §7: ≥80% qua bộ VÀ 100% case lớp ① pass C1. Không thêm
  // điều kiện nào khác — bar đã chốt 23:59 N1 thì không được siết thêm khi chấm.
  const barReached = passRate >= 80 && classOnePass;

  const esc = s => String(s).replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
  const md = [
    `# Eval Results — Run ${stamp}`, '',
    '## Run Info', '',
    `- Run ID: ${stamp}`,
    `- Date: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
    `- Model: ${MODEL} (OpenRouter, real)`,
    `- Knowledge base: ${KNOWLEDGE_BASE.length} đoạn từ data/vlearn-pack/transcript/`,
    `- Prompt: codebase/prompt.js · buildSystemPrompt() — giống hệt bản chạy trong app`, '',
    '## Summary', '',
    '| Metric | Result |', '|---|---|',
    `| Pass count (C1 ∧ C3 ∧ C2≥4) | ${passCount} |`,
    `| Total | ${total} |`,
    `| Pass rate | ${passRate}% |`,
    `| C1 toàn bộ case lớp ① pass? | ${classOnePass} |`,
    `| C2 trung bình | ${avgC2} |`,
    `| **Đạt quality bar (≥80% và ①=100%)?** | **${barReached}** |`, '',
    '## Case Log', '',
    '| ID | Lớp | Input | Ngữ cảnh nạp | Mã đã trích | C1 | C2 | C3 | PASS | Ghi chú |',
    '|---|---|---|---|---|---|---|---|---|---|',
    ...records.map(r => `| ${r.id} | ${r.lop} | ${esc(r.input).slice(0, 60)} | ${r.contextRefs.length ? r.contextRefs.join(', ') : '(rỗng)'} | ${r.citations.join(', ') || '—'} | ${r.C1} | ${r.C2} | ${r.C3} | ${r.PASS ? '✅' : '❌'} | ${esc([r.C1why, r.C3why].filter(Boolean).join('; '))} |`),
    '',
    '## Output đầy đủ', '',
    ...records.flatMap(r => [`### ${r.id} — ${r.input}`, '', '```', r.output.trim(), '```', '']),
    '## Notes', '',
    '- JSON thô nằm cạnh file này.',
    '- C1/C3 chấm bằng luật; C2 dùng số câu làm proxy cho "đúng cỡ" nên case biên vẫn cần người soát (spec §7: 2 người chấm độc lập case khó).'
  ].join('\n');

  fs.writeFileSync(outFile, md, 'utf8');
  fs.writeFileSync(outFile.replace(/\.md$/, '.json'), JSON.stringify(records, null, 2), 'utf8');
  console.log(`\n[eval] ${outFile}`);
  console.log(`[eval] Pass ${passCount}/${total} = ${passRate}% · lớp ① toàn pass: ${classOnePass} · đạt bar: ${barReached}`);
}

// Cho phép nạp lại các hàm chấm để soát trên output đã lưu, không cần gọi API lần nữa.
module.exports = { classify, scoreC1, scoreC2, scoreC3, citedRefs, countSentences };

if (require.main === module) {
  main().catch(err => { console.error('[eval]', err.message); process.exit(1); });
}
