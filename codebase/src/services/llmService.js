import { PREBAKED_EXPERIENCE_PATHS, COURSE_DAYS } from '../data/courseData.js';
import { logger } from './logger.js';

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const getApiKey = () =>
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.VITE_GOOGLE_API_KEY ||
  import.meta.env.GOOGLE_API_KEY ||
  '';

const getModelName = () =>
  import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';

// ─────────────────────────────────────────────────────────────────────────────
//  TYPO & TELEX NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────
export const normalizeAndCorrectTypos = (text) => {
  if (!text) return { correctedText: '', hasCorrection: false, originalText: '' };
  const original = text;
  let corrected = text;
  corrected = corrected.replace(/\b(h+e+l+o+)\b/gi, 'hello');
  corrected = corrected.replace(/\b(h+i+)\b/gi, 'hi');
  corrected = corrected.replace(/\b(h+e+y+)\b/gi, 'hey');
  corrected = corrected.replace(/\b(c+h+a+o+)\b/gi, 'chào');
  corrected = corrected.replace(/\b(a+l+o+)\b/gi, 'alo');
  const TYPO_MAP = [
    [/\b(prolem|probem|prblem|probstatement)\b/gi, 'problem statement'],
    [/\b(tockn|tokn|tocken|tken)\b/gi, 'token'],
    [/\b(aigent|agin|agnt|eigent)\b/gi, 'agent'],
    [/\b(worklow|workfow|wflow|worflow)\b/gi, 'workflow'],
    [/\b(cost of eror|cost-error|costerror|cost eror)\b/gi, 'cost-of-error'],
    [/\b(hallucinaton|halucination|hallucintion|halucinate)\b/gi, 'hallucination'],
    [/\b(pair framework|khung pair|framwork pair|pair framwork)\b/gi, 'PAIR Framework'],
    [/\b(ko|kô|khg|khong)\b/gi, 'không'],
    [/\b(dc|đc)\b/gi, 'được'],
    [/\b(bnhieu|baonhieu)\b/gi, 'bao nhiêu'],
    [/\b(khac|khacnhau)\b/gi, 'khác nhau'],
    [/\b(j)\b/g, 'gì'],
    [/\s(vs)\s/gi, ' với '],
  ];
  TYPO_MAP.forEach(([regex, replacement]) => {
    corrected = corrected.replace(regex, replacement);
  });
  const hasCorrection = corrected.toLowerCase().trim() !== original.toLowerCase().trim();
  return { correctedText: corrected, originalText: original, hasCorrection };
};

// ─────────────────────────────────────────────────────────────────────────────
//  ZERO-COST CASUAL GREETING FILTER
// ─────────────────────────────────────────────────────────────────────────────
const getCasualGreetingResponse = (question, day) => {
  const q = question.toLowerCase().trim();
  const isGreeting =
    /\b(h+e+l+o+|h+i+|h+e+y+|chào|xin\s*chào|a+l+o+|good\s*morning)\b/i.test(q) ||
    ['hello', 'hi', 'xin chào', 'chào bạn', 'chào em', 'hey', 'chao', 'alo'].some(
      k => q === k || q.startsWith(k + ' ')
    );

  if (isGreeting) {
    return {
      answer: `Chào bạn! Mình là **VLearn Tutor AI** 🎓 — trợ lý học tập của khóa **"AI Thực Chiến"** tại VinUniversity.\n\nMình đã phân tích toàn bộ **${day.code}: ${day.title}** (${day.pageCount} trang slide).\n\n**Bạn muốn hỏi gì?** Ví dụ:\n- "${day.keyConcepts?.[0]?.name || 'Khái niệm bài học'} là gì?"\n- "${day.keyConcepts?.[1]?.name || 'Ứng dụng thực tế'} hoạt động ra sao?"\n- "Giải thích ${day.keyConcepts?.[2]?.citation || 'slide 10'} chi tiết hơn"`,
      confidence: 0.99,
      citations: []
    };
  }
  if (['bạn là ai', 'bạn là gì', 'giới thiệu', 'who are you', 'bot là ai', 'em là ai'].some(k => q.includes(k))) {
    return {
      answer: `Mình là **VLearn Tutor AI** — Trợ lý Giảng dạy AI chuyên sâu của khóa **"AI Thực Chiến"** tại VinUniversity 🎓.\n\n**Khả năng:**\n1. 🔍 Giải thích chi tiết khái niệm lý thuyết trong slide\n2. 📌 Trích dẫn chính xác **[slide X]** để xem trực tiếp\n3. 💡 Đưa ví dụ ứng dụng thực tế doanh nghiệp\n4. 🤔 Phân tích sâu tình huống & phản biện bài tập nhóm`,
      confidence: 0.99,
      citations: []
    };
  }
  if (['cảm ơn', 'thanks', 'thank you', 'tuyệt vời', 'hay quá', 'ok tks', 'tks', 'great'].some(k => q.includes(k))) {
    return {
      answer: `Rất vui được hỗ trợ bạn! 😊 Nếu còn thắc mắc gì về **${day.code}: ${day.title}**, cứ hỏi nhé. Chúc bạn học tốt!`,
      confidence: 0.99,
      citations: []
    };
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
//  INTENT-DRIVEN KNOWLEDGE BASE
// ─────────────────────────────────────────────────────────────────────────────
const KNOWLEDGE_BASE = [
  // ── DAY 01 ENTRIES ────────────────────────────────────────────────────────
  {
    id: 'llm-vs-chatbot',
    dayCode: 'Day01',
    slidePages: [10],
    triggers: ['llm', 'chatbot', 'llm là gì', 'llm không phải', 'khác nhau giữa', 'reasoning engine', 'bộ não', 'language model'],
    title: 'LLM không phải là Chatbot — Reasoning Engine vs UI Layer',
    content: `**LLM là gì & tại sao không phải Chatbot? [slide 10]**\nChatbot chỉ là **Giao diện Người dùng (UI)** — lớp bọc bên ngoài như ChatGPT App, Claude Web hay Gemini Chat. Bên trong đó, **LLM (Large Language Model)** mới là **Bộ não Xử lý Ngôn ngữ và Suy luận (Reasoning Engine)** thực sự.\n\n**Những gì LLM có thể làm ngoài "chat":**\n- **Data Extractor**: Trích xuất dữ liệu phi cấu trúc từ hợp đồng, hóa đơn PDF thành JSON Schema chuẩn xác\n- **Code Generator & Refactor**: Lập trình tự động, debug và viết unit test\n- **Classifier & Router**: Phân loại ý định người dùng (Intent Classification) de điều hướng hệ thống\n- **Summarizer**: Tóm tắt tài liệu dài, dịch thuật và giữ văn phong\n- **Structured Synthesizer**: Biến văn bản tự nhiên thành dữ liệu có cấu trúc cho backend parse\n\n**Tại sao hiểu đúng điều này quan trọng?**\nNhiều người chỉ dùng LLM như "chatbot trả lời câu hỏi". Thực tế, LLM là cơ sở hạ tầng thông minh để xây dựng **Headless AI Services** chạy ngầm trong sản phẩm — không cần giao diện chat đơn điệu.\n\n**Ví dụ thực tế:**\n- Ngân hàng dùng LLM để tự động phân loại và tóm tắt đơn khiếu nại khách hàng\n- Luật sư dùng LLM trích xuất điều khoản quan trọng từ 100 hợp đồng trong 5 phút\n- DevOps dùng LLM phân tích log lỗi và đề xuất fix tự động`,
    followup: 'Muốn hiểu thêm 4 cấp độ Agent xây dựng trên LLM? Xem [slide 11, 23]'
  },
  {
    id: 'token-tokenomics',
    dayCode: 'Day01',
    slidePages: [8, 9],
    triggers: ['token', 'tokenomics', 'chi phí', 'output đắt hơn', 'input token', 'output token', 'giá tiền', 'api cost', 'tính tiền', 'bao nhiêu tiền'],
    title: 'Token & Tokenomics — Tại sao Output Token đắt gấp 3-5 lần Input?',
    content: `**Token là gì? [slide 8]**\nLLM không xử lý trực tiếp từ văn bản mà chia nhỏ thành các **Token**. Trung bình:\n- 1.000 Token ≈ 750 từ tiếng Anh\n- 1.000 Token ≈ ~1.000 ký tự tiếng Việt\nToken quyết định dung lượng Context Window và chi phí gọi API.\n\n**Cơ chế tính toán — Tại sao Output đắt hơn? [slide 9]**\n- **Input Token (Rẻ)**: Máy chủ GPU xử lý SONG SONG toàn bộ trong 1 ma trận — nhanh, tiêu ít năng lượng.\n- **Output Token (Đắt gấp 3-5x)**: Mô hình SINH TUẦN TỰ từng từ một (Autoregressive). Mỗi token đầu ra phải nạp lại toàn bộ ngữ cảnh cũ vào GPU (KV-Cache), tiêu tốn tài nguyên gấp nhiều lần.\n\n**Ví dụ tính chi phí thực tế:**\nGemini 1.5 Flash: $0.075/1M input vs $0.30/1M output.\nApp 1.000 users/ngày × 5 câu × 200 tokens output = 1M output tokens/ngày ≈ $0.30/ngày ≈ ~$9/tháng.\n\n**Chiến lược tối ưu chi phí sản phẩm:**\n- Yêu cầu AI trả về ngắn gọn, cô đọng, đúng trọng tâm\n- Dùng JSON format tối giản thay vì văn bản dài\n- Cache câu hỏi phổ biến (Semantic Caching) — tránh gọi API 2 lần cho cùng câu hỏi\n- Phân loại câu hỏi: đơn giản → rule-based (0 token), phức tạp → LLM`,
    followup: 'Xem thêm chiến lược chọn model theo chi phí [slide 24]'
  },
  {
    id: 'hallucination',
    dayCode: 'Day01',
    slidePages: [12, 13, 14, 20],
    triggers: ['hallucination', 'bịa tin', 'sai', 'giới hạn', 'limit', 'cut-off', 'cutoff', 'knowledge cutoff', 'context window', 'lost in the middle', 'needle', 'bịa', 'không biết'],
    title: '3 Giới hạn Bẩm sinh của LLM: Hallucination, Cutoff & Context',
    content: `**Tại sao LLM có giới hạn bẩm sinh? [slide 20]**\nLLM là mô hình xác suất ngôn ngữ (Next Token Prediction) — không phải cơ sở dữ liệu thực tế. Nó dự đoán từ ngữ TIẾP THEO có xác suất cao nhất, không có cơ chế kiểm tra sự thật.\n\n**Giới hạn 1: Hallucination (Tự tin bịa tin) [slide 13]**\nLLM có thể tạo ra câu từ mượt mà nhưng nội dung hoàn toàn sai — tên tác giả giả, số liệu ngẫu nhiên, luật pháp không tồn tại.\n- **Mức độ nhẹ**: Tên tác giả sai, số liệu gần đúng\n- **Mức độ nặng**: Trích dẫn luật pháp không tồn tại, đơn thuốc sai liều\n- **Giải pháp**: Dùng Grounding Data (RAG) + ép AI trích dẫn nguồn bằng slide cụ thể [slide 17, 20]\n\n**Giới hạn 2: Knowledge Cutoff — "Bong bóng thời gian" [slide 12]**\nDữ liệu huấn luyện bị đóng băng tại thời điểm cắt (Cutoff date). LLM không biết sự kiện xảy ra sau ngày đó trừ khi được gắn Tool Search hoặc RAG.\n**Giải pháp**: Gắn công cụ Web Search hoặc RAG với cơ sở dữ liệu cập nhật.\n\n**Giới hạn 3: Context Window & Lost in the Middle [slide 14]**\nDù Context Window lên tới 1M-2M token, khi văn bản quá dài, LLM dễ bỏ sót thông tin ở GIỮA tài liệu (Hiện tượng Needle in a Haystack).\n**Giải pháp**: Chia nhỏ tài liệu (Chunking), đặt thông tin quan trọng ở đầu hoặc cuối prompt.\n\n**Nguyên tắc Grounding (G10) [slide 20]**\n"Nếu thông tin không có trong tài liệu được cung cấp, hãy trả lời *không biết* — tuyệt đối không tự bịa thông tin."`,
    followup: 'Muốn tìm hiểu kỹ thuật kiểm soát Hallucination bằng Grounding? [slide 17, 20]'
  },
  {
    id: '4-level-agent',
    dayCode: 'Day01',
    slidePages: [11, 23, 24],
    triggers: ['4 level', 'level agent', 'multi-agent', 'workflow agent', 'tool using', 'naked llm', 'cấp độ agent', 'agentic', 'agent là gì'],
    title: '4 Cấp độ Agent: Từ LLM trần đến Multi-Agent System',
    content: `**Tại sao cần phân cấp Agent? [slide 11]**\nKhông phải bài toán nào cũng cần Agent phức tạp. Hiểu đúng 4 cấp độ giúp chọn giải pháp tối ưu — đơn giản nhất, ít rủi ro nhất.\n\n**Level 1: Naked LLM [slide 11]**\nChỉ hỏi đáp văn bản trần qua Prompt — không có công cụ nào bên ngoài. Phù hợp: tóm tắt, dịch thuật, giải thích khái niệm.\n\n**Level 2: Tool-using Agent [slide 23]**\nLLM được trang bị công cụ (Tools): Google Search, Calculator, Database API, Code Interpreter. AI quyết định KHI NÀO gọi công cụ nào.\nVí dụ: "Tìm giá cổ phiếu APPLE hôm nay" → AI gọi Search API → xử lý kết quả → trả lời.\n\n**Level 3: Workflow Agent (Prompt Chaining) [slide 23]**\nPrompt Chaining & Conditional Routing: quy trình NHIỀU BƯỚC CỐ ĐỊNH do con người thiết kế trước.\nVí dụ: [Phân tích yêu cầu] → [Tra cứu DB] → [Sinh báo cáo] → [Gửi email]\n\n**Level 4: Multi-Agent System [slide 24]**\nHệ thống NHIỀU AGENT CHUYÊN BIỆT phối hợp tự động: Coder Agent, Reviewer Agent, Tester Agent, Deployer Agent — giao nhiệm vụ và kết quả cho nhau.\nVí dụ: Hệ thống tự động kiểm tra bảo mật code trong CI/CD pipeline.\n\n**Nguyên tắc chọn cấp:**\nLuôn bắt đầu từ Level đơn giản nhất. Chỉ nâng cấp khi Level thấp hơn không giải quyết được bài toán.`,
    followup: 'Xem thêm cách chọn giữa Rule/Workflow/Agent ở Day02 [slide 8]'
  },
  {
    id: 'prompt-4-layers',
    dayCode: 'Day01',
    slidePages: [15, 28],
    triggers: ['prompt', '4 lớp', 'prompt engineering', 'system instruction', 'system prompt', 'output format', 'grounding data', 'cấu trúc prompt', 'viết prompt'],
    title: 'Kỹ thuật Cấu trúc Prompt 4 Lớp Chuẩn hóa',
    content: `**Tại sao cần cấu trúc Prompt 4 Lớp? [slide 15]**\nMột Prompt thiếu cấu trúc sẽ khiến AI trả lời chệch hướng, thiếu nhất quán và dễ bị Hallucination. Prompt 4 Lớp là công thức chuẩn của nhiều sản phẩm AI thương mại.\n\n**Layer 1: System Instruction (Vai trò & Quy tắc)**\nThiết lập danh tính, giọng nói, và Guardrails (Cấm đoán nhất định). Ví dụ: "Bạn là giảng viên AI. Tuyệt đối không nói làm trắng — chỉ trả lời dựa trên tài liệu được cung cấp."\n\n**Layer 2: User Input (Yêu cầu cụ thể)**\nCâu hỏi hoặc lệnh cụ thể từ người dùng. Phần này thay đổi theo từng lượt hỏi.\n\n**Layer 3: Context / Grounding Data (Dữ liệu nền)**\nTài liệu nguồn — PDF, Slide, CSDL — được bơm trực tiếp vào Prompt để AI có "sự thật" để tham chiếu thay vì tự bịa.\n\n**Layer 4: Output Format (Định dạng đầu ra)**\nChỉ rõ cụ thể: "Trả về JSON với trường {answer, confidence, citations}". Kết quả là AI trả về đúng định dạng để backend parse.\n\n**Ví dụ Prompt 4 Lớp hoàn chỉnh:**\n- *System*: "You are a contract analyst. Only answer based on provided document."\n- *User*: "Thời hạn thanh toán ở điều khoản mấy?"\n- *Context*: [nội dung hợp đồng PDF]\n- *Format*: {"clause": "...", "page": 5, "raw_text": "..."}\n\n**[slide 28]** — Thực hành viết Prompt 4 Lớp là bài tập cuối buổi Day01.`,
    followup: 'Thực hành gọi API Gemini với cấu trúc này ngay tại [slide 16]'
  },
  {
    id: 'temperature',
    dayCode: 'Day01',
    slidePages: [19],
    triggers: ['temperature', 'top-p', 'top p', 'tham số', 'nhiệt độ', 'sampling', 'creativity', 'sáng tạo', 'nhất quán', 'deterministic', '0.0', '0.7'],
    title: 'Tham số Temperature & Top-P — Điều khiển "Độ sáng tạo" của LLM',
    content: `**Temperature là gì? [slide 19]**\nTemperature là tham số điều chỉnh MỨC ĐỘ NGẪU NHIÊN trong quá trình LLM chọn token tiếp theo. Khoảng giá trị: 0.0 — 2.0.\n\n**Phân tích theo giá trị thực tế:**\n- **Temperature = 0.0**: AI chọn token có xác suất CAO NHẤT — kết quả nhất quán, xác định, có thể tái tạo được. Dùng cho: trích xuất dữ liệu, code generation, kiểm tra logic.\n- **Temperature = 0.2–0.4**: Cân bằng giữa nhất quán và linh hoạt — phù hợp cho chatbot, phân loại văn bản, tóm tắt tài liệu.\n- **Temperature = 0.7–1.0**: Tăng mức ngẫu nhiên — kết quả đa dạng, sáng tạo hơn. Dùng cho: viết lách sáng tạo, brainstorm, tạo biến thể.\n- **Temperature > 1.0**: Output có thể trở nên "hoang loạn", mất mạch lạc — hiếm khi dùng trong sản phẩm thực tế.\n\n**Top-P (Nucleus Sampling) là gì?**\nThay vị giới hạn giá trị temperature, Top-P giới hạn TẬP TOKEN ĐƯỢC CHỌN — chỉ lấy những token có tổng xác suất tích lũy ≤ P.\nTop-P = 0.9 nghĩa là chỉ chọn từ tập 90% token có xác suất cao nhất.`,
    followup: 'Thực hành gọi API Gemini với các tham số này ở Lab [slide 16]'
  },
  {
    id: 'transformer',
    dayCode: 'Day01',
    slidePages: [5, 6, 7],
    triggers: ['transformer', 'attention', 'self-attention', 'kiến trúc', 'architecture', 'next token', 'prediction', 'alexnet', 'lịch sử ai', '70 năm', 'turing'],
    title: 'Lịch sử AI & Kiến trúc Transformer — Nền tảng của LLM hiện đại',
    content: `**70 năm lịch sử AI trong 5 mốc quan trọng [slide 5]:**\n- 1950: Alan Turing đề xuất "Turing Test" — Liệu máy tính có thể suy nghĩ không?\n- 1997: Deep Blue (IBM) đánh bại Garry Kasparov trong Cờ vua — AI chuyên biệt\n- 2012: ImageNet/AlexNet — Đột phá Deep Learning với GPU, khai mào kỷ nguyên mạng nơ-ron sâu\n- 2017: Bài báo "Attention Is All You Need" (Google) — Kiến trúc Transformer ra đời\n- 2022: ChatGPT (OpenAI) — Bùng nổ LLM và cuộc đua AI toàn cầu\n\n**Transformer giải quyết vấn đề gì? [slide 6]**\nTrước Transformer, RNN/LSTM xử lý chuỗi TUẦN TỰ — chậm và khó xử lý văn bản dài. Transformer giải quyết bằng **Self-Attention**: cho phép xử lý SONG SONG toàn bộ chuỗi và tính "mức độ liên quan" giữa bất kỳ 2 từ nào trong văn bản dù ở xa nhau.\n\n**Cơ chế Next Token Prediction [slide 7]**\nLLM vận hành bằng cách: nhận tất cả token đầu vào → tính toán phân phối xác suất trên toàn bộ vocab (30.000–100.000 từ) → chọn token tiếp theo → lặp lại.\nFormula: P(token_n | token_1, ..., token_n-1)\n\nĐây là lý do LLM đọc viết được nhiều ngôn ngữ và phong cách — vì đã học thống kê ngôn ngữ từ hàng nghìn tỷ từ.`,
    followup: 'Hiểu nền tảng này giúp bạn hiểu tại sao LLM có các giới hạn như Hallucination [slide 13]'
  },
  {
    id: 'grounding-rag',
    dayCode: 'Day01',
    slidePages: [17, 20],
    triggers: ['grounding', 'source of truth', 'nguồn sự thật', 'trích dẫn nguồn', 'rag', 'retrieval', 'augmented generation', 'citation', 'kiểm chứng'],
    title: 'Grounding & Nguồn Sự Thật — Nền tảng của AI Minh bạch',
    content: `**Grounding là gì? [slide 17]**\nGrounding là kỹ thuật cung cấp DỮ LIỆU THỰC TẾ trực tiếp vào Prompt để AI tham chiếu thay vì tự sinh ra thông tin từ "trí nhớ" huấn luyện.\n\n**Tại sao cần Grounding?**\nVì LLM có thể Hallucinate — trả lời sai nhưng vẫn rất tự tin. Trong y tế, pháp lý, tài chính, điều này cực kỳ nguy hiểm.\n\n**Nguồn Sự Thật (Source of Truth) [slide 17]**\nHệ thống AI đáng tin cậy PHẢI có khả năng:\n1. Chỉ ra chính xác thông tin lấy từ đâu (File nào, Slide mấy, Đoạn văn bản nào)\n2. Cho phép người dùng kiểm chứng trực tiếp — không phải tin tưởng mù quáng\n3. Từ chối trả lời khi thông tin ngoài phạm vi tài liệu\n\n**Nguyên tắc G10 [slide 20]**\n"Nếu thông tin không có trong tài liệu được cung cấp, hãy trả lời *KHÔNG BIẾT* — tuyệt đối không tự bịa thông tin."\n\n**RAG (Retrieval-Augmented Generation) — Giải pháp chuyên nghiệp:**\nHệ thống truy cứu động dữ liệu trước khi gọi LLM:\n[Query] → [Tìm kiếm vector DB] → [Lấy top-K chunks liên quan] → [Bơm vào Prompt] → [LLM trả lời có căn cứ]`,
    followup: 'Muốn hiểu thêm về JSON Schema & Structured Output? [slide 21]'
  },
  // ── DAY 02 ENTRIES ────────────────────────────────────────────────────────
  {
    id: 'double-diamond',
    dayCode: 'Day02',
    slidePages: [3, 4, 5],
    triggers: ['double diamond', 'don norman', 'design council', 'discovery', 'define', 'diverge', 'converge', 'phân kỳ', 'hội tụ', 'khám phá vấn đề'],
    title: 'Mô hình Double Diamond — Tìm đúng Bài toán trước khi Giải quyết',
    content: `**Double Diamond là gì? [slide 3]**\nDo Don Norman & Design Council phát triển, Double Diamond là mô hình tư duy thiết kế gồm 2 "Kim cương" biểu diễn quá trình mở rộng và thu hẹp suy nghĩ.\n\n**Diamond 1: Tìm đúng Bài toán (Problem Space) [slide 4-5]**\n- **Discover (Mở rộng)**: Thu thập thông tin rộng rãi — quan sát người dùng thực tế, phỏng vấn sâu (User Interview), ghi nhật ký hành vi (Diary Study)\n- **Define (Hội tụ)**: Cô đọng toàn bộ dữ liệu thành 1 CÂU PHÁT BIỂU BÀI TOÁN rõ ràng — tránh giải quyết sai vấn đề gốc\n\n**Diamond 2: Tìm đúng Giải pháp (Solution Space)**\n- **Develop (Mở rộng)**: Sáng tạo nhiều phương án giải pháp khác nhau — brainstorm, prototype nhanh\n- **Deliver (Hội tụ)**: Chọn giải pháp tốt nhất, tối ưu và triển khai thực tế\n\n**Tại sao cần 2 Diamond?**\nNhiều team mắc bẫy: nhảy thẳng vào giải pháp (Diamond 2) mà không qua Diamond 1. Kết quả là xây dựng đúng sản phẩm, nhưng giải quyết sai vấn đề.\n\n**Ví dụ thực tế trong AI:**\nMột công ty muốn "xây chatbot CSKH" (đã vào Solution Space). Qua Double Diamond hoá ra vấn đề thật sự là "quy trình xác nhận đơn hàng mất 3 ngày" — giải pháp tối ưu là automation rule-based, không cần AI.`,
    followup: 'Sau khi tìm đúng bài toán, dùng PAIR Framework để chọn giải pháp AI [slide 6]'
  },
  {
    id: 'pair-framework',
    dayCode: 'Day02',
    slidePages: [6, 7, 8, 9],
    triggers: ['pair', 'pair framework', 'khung pair', '3 câu hỏi', 'có cần ai không', 'automate hay augment', 'reward function', 'success criteria', 'cần ai không'],
    title: 'PAIR Framework — 3 Câu hỏi Bắt buộc khi Thiết kế Sản phẩm AI',
    content: `**PAIR Framework là gì? [slide 6]**\nPAIR là khung phân tích 3 bước để trả lời: "Bài toán này có nên dùng AI không? Nếu có, dùng ở cấp nào?"\n\n**Câu hỏi PAIR 1: AI có tạo ra giá trị khác biệt không? [slide 7]**\nNếu bài toán có thể giải quyết bằng 1 thuật toán if/else hoặc phần mềm truyền thống với độ chính xác 100% — **ĐỪNG DÙNG AI!**\nAI chỉ thêm giá trị khi bài toán:\n- Xử lý ngôn ngữ tự nhiên phức tạp (văn bản, âm thanh, hình ảnh)\n- Cần xử lý tình huống chưa biết trước / bất định\n- Cần mở rộng quy mô mà không cần thêm người\n\n**Câu hỏi PAIR 2: Chọn Automate hay Augment? Rule/Workflow/Agent? [slide 8]**\n- **Rule-based**: Bài toán có thể viết thành quy tắc cố định → dùng Rule (0 token, nhanh, chính xác 100%)\n- **Workflow**: Cần xử lý ngôn ngữ nhưng luồng cố định → dùng Prompt Chaining\n- **Agent**: Cần AI tự quyết định bước tiếp theo trong môi trường thay đổi → dùng Agent (đắt nhất, khó kiểm soát)\n\n**Câu hỏi PAIR 3: Reward Function & Success Criteria [slide 9]**\nPhải định nghĩa rõ ràng: *"Thế nào là một câu trả lời ĐÚNG và THÀNH CÔNG?"*\n- Ví dụ tốt: "AI trích xuất đúng tên, số hiệu, ngày ký trong 95% hợp đồng"\n- Ví dụ xấu: "AI trả lời tốt" (không đo lường được)\n\n**Nguyên tắc Vàng: Luôn bắt đầu từ Cấp 1 (Rule) trước!**\nChỉ nâng cấp khi cấp đơn giản hơn không giải quyết được — tránh Over-engineering.`,
    followup: 'Hiểu thêm về Cost-of-Error để chọn Automate vs Augment [slide 10]'
  },
  {
    id: 'rule-workflow-agent',
    dayCode: 'Day02',
    slidePages: [7, 8],
    triggers: ['3 cấp', 'rule based', 'rule-based', '3 cấp giải pháp', 'if else', 'regex', 'prompt chaining', 'routing', 'cấp giải pháp', 'rule workflow agent'],
    title: '3 Cấp Giải pháp Triển khai AI: Rule / Workflow / Agent',
    content: `**Tại sao cần phân 3 cấp? [slide 8]**\nKhông phải bài toán nào cũng cần AI phức tạp. Phân cấp giúp chọn giải pháp tốt nhất: đơn giản nhất, chi phí thấp nhất, rủi ro thấp nhất.\n\n**Cấp 1: Rule-based (Hệ luật tay) — "Lẽ phải thử trước tiên"**\nDùng công cụ: Regex, If/Else, Fuzzy Matching, Decision Tree.\n- Chi phí: 0 token, 0 USD\n- Độ chính xác: 100% với bài toán cố định\n- Tốc độ: Xử lý tức thì\n- Khi dùng: Phân loại theo mã, định dạng chuẩn, quy tắc có thể viết thành if/else\n- Ví dụ: Tìm mã vận đơn hợp lệ, xác thực định dạng email, lọc từ cảm\n\n**Cấp 2: Workflow (Prompt Chaining) — "Khi cần xử lý ngôn ngữ trong luồng cố định"**\nKết hợp LLM vào quy trình nhiều bước được thiết kế trước:\nBước 1: LLM phân loại ý định → Bước 2: LLM trích xuất thực thể → Bước 3: Lưu DB\n- Chi phí: Trung bình (chỉ gọi LLM cho phần cần thiết)\n- Rủi ro: Thấp (con người kiểm soát luồng)\n- Ví dụ: Hệ thống xử lý đơn hàng: [Đọc email CSKH] → [Phân loại kiểu đơn] → [Trích xuất thông tin] → [Cập nhật ERP]\n\n**Cấp 3: Agentic System (AI Agent) — "Chỉ khi thực sự cần"**\nAI được giao Mục tiêu (Goal) và tự lập kế hoạch, chọn công cụ, thực thi nhiều bước.\n- Chi phí: Cao (nhiều lượt gọi LLM + Tools)\n- Rủi ro: Cao (AI có thể "lang thang", thực hiện sai bước)\n- Khi dùng: Môi trường thay đổi theo thời gian thực, các bước không thể biết trước\n- Ví dụ: AI tự động nghiên cứu thị trường, viết báo cáo và đề xuất chiến lược\n\n**Nguyên tắc Vàng: Start Simple, Scale Only When Needed!**`,
    followup: 'Tiếp theo: Cost-of-Error quyết định Augment hay Automate [slide 10]'
  },
  {
    id: 'cost-of-error',
    dayCode: 'Day02',
    slidePages: [10, 11],
    triggers: ['cost of error', 'cost-of-error', 'chi phí lỗi', 'ai sai', 'hậu quả', 'automate', 'augment', 'hitl', 'human in the loop', 'người duyệt', 'human-in-the-loop'],
    title: 'Cost-of-Error & Human-in-the-Loop — Khi nào AI được phép tự quyết định?',
    content: `**Cost-of-Error là gì? [slide 10]**\nCost-of-Error là CHI PHÍ/THIỆT HẠI phát sinh khi mô hình AI đưa ra câu trả lời sai hoặc dự đoán nhầm — đo bằng tiền mất, thời gian, uy tín, hoặc tính mạng.\n\n**Trường hợp 1: Cost-of-Error THẤP**\n- Ví dụ: Gợi ý phim, tạo nội dung draft email, playlist nhạc\n- AI sai → Người dùng cười, chọn lại, không có hậu quả lớn\n- Quyết định: **Automate 100%** — AI chạy tự động, không cần người duyệt\n- UX: Kết quả hiện ra ngay, người dùng click chấp nhận nếu thích\n\n**Trường hợp 2: Cost-of-Error CAO**\n- Ví dụ: Báo cáo tài chính, toa đơn thuốc, phân tích hợp đồng pháp lý, chế độ bảo hiểm\n- AI sai → Mất tiền bạc lớn, tranh pháp lý, khả năng ảnh hưởng tính mạng\n- Quyết định: **Augmentation + HITL** — AI đề xuất, CON NGƯỜI PHẢI DUYỆT trước khi hiệu lực\n- UX: AI hiện "Bản nháp" + màu duyệt, người có thẩm quyền bấm "Phê duyệt"\n\n**Thiết kế Human-in-the-Loop (HITL) [slide 11]**\nKhi Cost-of-Error cao, giao diện phải thiết kế:\n1. AI sinh kết quả + highlight các trường có thể sai\n2. Con người review và chỉnh sửa nếu cần\n3. Con người bấm "Xác nhận" → Hệ thống mới thực thi\n\n**Bài học xương máu:**\nMototrola mất 7 tỷ USD vì hệ thống phân tích rủi ro bảo hiểm dùng AI tự quyết định — thiết kế sai Cost-of-Error cao nhưng không có HITL.`,
    followup: 'Hiểu thêm Precision vs Recall để chọn chiến lược đánh giá mô hình AI [slide 12]'
  },
  {
    id: 'precision-recall',
    dayCode: 'Day02',
    slidePages: [12],
    triggers: ['precision', 'recall', 'f1', 'bắt nhầm', 'bỏ sót', 'false positive', 'false negative', 'trade-off'],
    title: 'Precision vs Recall — Cân bằng Trade-off trong Sản phẩm AI',
    content: `**Precision và Recall là gì? [slide 12]**\n- **Precision** (Độ chính xác): Trong số kết quả AI báo là đúng, bao nhiêu cái THẬT SỰ đúng? Formula: TP / (TP + FP)\n- **Recall** (Độ bao phủ): Trong số trường hợp THẬT SỰ đúng, AI bắt được bao nhiêu %? Formula: TP / (TP + FN)\n\n**Điểm quan trọng: Không thể có cả 2 cao cùng lúc!**\nTăng Precision → Recall giảm (bỏ sót nhiều). Tăng Recall → Precision giảm (bao nhiêu thứ bắt nhầm).\n\n**Quyết định thiết kế dựa trên Domain:**\n\n**High Precision (Thà bỏ sót còn hơn bắt nhầm):**\n- Ví dụ: Lọc tin nhắn độc hại, trích xuất điều khoản hợp đồng, phân loại triệu chứng bệnh\n- Lý do: Một kết quả sai (false positive) gây hậu quả lớn hơn nhiều kết quả bị bỏ sót\n- Ngưỡng: Đặt precision > 95%, chấp nhận recall = 70%\n\n**High Recall (Thà bắt nhầm còn hơn bỏ sót):**\n- Ví dụ: Tìm kiếm tài liệu, gợi ý sản phẩm, cảnh báo gian lận ngân hàng\n- Lý do: Bỏ sót 1 trường hợp thực là (false negative) gây hậu quả lớn hơn bắt nhầm\n- Ngưỡng: Đặt recall > 90%, chấp nhận precision = 60%\n\n**F1-Score: Cân bằng cả hai:**\nKhi không ưu tiên cả hai, dùng F1 = 2 × (P × R) / (P + R)`,
    followup: 'Kết hợp Precision/Recall với thiết kế Human-in-the-loop [slide 11]'
  },
  {
    id: 'problem-statement-9',
    dayCode: 'Day02',
    slidePages: [13, 15, 25],
    triggers: ['problem statement', '9 trường', '9 field', 'bài toán ai', 'phát biểu bài toán', 'canvas', 'deliverable', 'khung bài toán', 'go no-go', 'problem'],
    title: 'Problem Statement 9 Trường — Tiêu chuẩn VLearn xác định Bài toán AI',
    content: `**Tại sao cần Problem Statement 9 Trường? [slide 13]**\nBiến các ý tưởng mơ hồ thành 1 đề xuất rõ ràng, khả thi và đo lường được — để cả team, TA và giảng viên có thể đánh giá.\n\n**9 Trường Bắt buộc:**\n1. **Bối cảnh & Người dùng mục tiêu**: Ai đang gặp vấn đề? Trong bối cảnh nào?\n2. **Vấn đề / Nỗi đau hiện tại (Pain point)**: Cái gì đang sai? Quy trình hiện tại là gì?\n3. **Hậu quả & Chi phí thiệt hại**: Neu không giải quyết → mất bao nhiêu tiền, thời gian, nhân lực?\n4. **Giá trị kỳ vọng tạo ra (ROI)**: Giải pháp sẽ tiết kiệm / tăng thêm bao nhiêu?\n5. **Cấp giải pháp lựa chọn**: Rule / Workflow / Agent — và tại sao chọn cấp độ này?\n6. **Phương án UX**: Augment (có người duyệt) hay Automate (tự động hoàn toàn)?\n7. **Rủi ro & Cost-of-error**: Nếu AI sai → hậu quả như thế nào? Có thể chấp nhận không?\n8. **Dữ liệu sẵn có & Feasibility**: Có đủ dữ liệu sạch để AI học và trích xuất không?\n9. **Tiêu chí Go / No-Go**: Điều kiện gì để quyết định triển khai hay dừng lại?\n\n**Checklist Chất lượng Problem Statement [slide 25]:**\n- Đã định lượng hậu quả (số tiền, số lượng người, thời gian) chưa?\n- Đã chọn đúng cấp Rule/Workflow/Agent chưa?\n- Đã xác định Cost-of-error và thiết kế UX phù hợp chưa?\n- Đã kiểm tra có đủ dữ liệu chưa?`,
    followup: 'Thực hành viết Problem Statement cho bài toán của nhóm tại Lab chiều [slide 15]'
  },
  {
    id: 'agenda-day01',
    dayCode: 'Day01',
    slidePages: [2],
    triggers: ['agenda day01', 'nội dung day01', 'day 01 học gì', 'buổi 1 học gì', 'chương trình buổi 1', 'agenda buổi 1'],
    title: 'Agenda Day01: AI & LLM Foundation',
    content: `**Chương trình Buổi 1 — AI & LLM Foundation [slide 2]:**\n\n1. **Bức tranh AI & các tầng của AI** — AI, ML, DL, GenAI, LLM là gì và quan hệ thế nào\n2. **Lịch sử AI 70 năm** — Từ Turing Test 1950 đến ChatGPT 2022\n3. **Bên trong LLM: Cơ chế vận hành** — Transformer, Self-Attention, Next Token Prediction\n4. **Từ LLM đến AI Agent** — 4 cấp độ Agent và khi nào dùng cấp nào\n5. **Landscape: Model hôm nay & cuộc đua hiện tại** — Gemini, GPT-4o, Claude, Llama\n6. **Chọn Model & Chi phí Token** — Tokenomics, tính chi phí vào dự án\n7. **Gọi API lần đầu** — Thiết lập Gemini API, viết Prompt 4 Lớp đầu tiên\n\n**Kết quả học tập sau Buổi 1:**\nHiểu cơ chế LLM, biết tính chi phí API và viết được System Prompt 4 Lớp có chất lượng.`,
    followup: null
  },
  {
    id: 'agenda-day02',
    dayCode: 'Day02',
    slidePages: [2],
    triggers: ['agenda day02', 'nội dung day02', 'day 02 học gì', 'buổi 2 học gì', 'chương trình buổi 2', 'agenda buổi 2'],
    title: 'Agenda Day02: Xác định Bài toán cho AI (Problem Statement)',
    content: `**Chương trình Buổi 2 — Xác định Bài toán cho AI [slide 2]:**\n\n1. **Problem Discovery — Double Diamond** — Phương pháp tìm đúng bài toán trước khi giải quyết\n2. **Problem Statement 9 Trường** — Tiêu chuẩn VLearn để viết bài toán AI chuẩn hóa\n3. **PAIR Bước 1: AI có thêm giá trị không?** — Khi nào ĐỪNG dùng AI, khi nào nên dùng\n4. **PAIR Bước 2: Automate/Augment → Rule/Workflow/Agent** — Chọn cấp giải pháp phù hợp\n5. **PAIR Bước 3: Reward function & Success criteria** — Định nghĩa "thế nào là đúng"\n6. **Khi AI sai & UX/HITL** — Thiết kế hệ thống an toàn khi AI có thể mắc lỗi\n\n**Kết quả học tập sau Buổi 2:**\nViết được Problem Statement 9 Trường cho bài toán của nhóm và chọn đúng giải pháp AI.`,
    followup: null
  }
];

// ─────────────────────────────────────────────────────────────────────────────
//  SMART INTENT MATCHER
// ─────────────────────────────────────────────────────────────────────────────
const findBestKnowledgeMatch = (question, currentDay) => {
  const q = question.toLowerCase()
    .replace(/[?!.,;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let bestEntry = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const trigger of entry.triggers) {
      if (q.includes(trigger)) {
        score += trigger.length * 2;
      }
      const words = trigger.split(' ');
      for (const word of words) {
        if (word.length >= 4 && q.includes(word)) {
          score += word.length;
        }
      }
    }
    if (entry.dayCode.toLowerCase() === currentDay.code.toLowerCase()) {
      score *= 1.2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }
  return bestScore >= 6 ? { entry: bestEntry, score: bestScore } : null;
};

// ─────────────────────────────────────────────────────────────────────────────
//  FORMAT RICH ANSWER
// ─────────────────────────────────────────────────────────────────────────────
const formatRichAnswer = (entry, currentDay) => {
  const slideDay = COURSE_DAYS.find(d => d.code === entry.dayCode) || currentDay;
  const slideRefs = entry.slidePages.map(p => `[slide ${p}]`).join(', ');
  const citations = entry.slidePages.map(p => `${entry.dayCode} - slide ${p}`);

  let answer = `### ${entry.title} ${slideRefs}\n\n`;
  answer += entry.content;

  if (entry.followup) {
    answer += `\n\n---\n💡 **Gợi ý tiếp theo:** ${entry.followup}`;
  }

  const slideDetails = entry.slidePages
    .map(p => {
      const slide = slideDay.slides?.find(s => s.page === p);
      return slide ? `- **[slide ${p}]** — *${slide.title}*` : null;
    })
    .filter(Boolean);

  if (slideDetails.length > 0) {
    answer += `\n\n---\n**Trang slide tham khảo:** ${entry.dayCode}\n${slideDetails.join('\n')}`;
  }

  return {
    answer,
    confidence: 0.96,
    citations
  };
};

// ─────────────────────────────────────────────────────────────────────────────
//  FALLBACK RAG — keyword scoring on slides (last resort)
// ─────────────────────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'la', 'gi', 'nhu', 'the', 'nao', 'khi', 'bai', 'trong', 'duoc', 'co', 'cua',
  'voi', 'cho', 'toi', 'biet', 'va', 'hay', 'hoac', 'mot', 'cac', 'nhung',
  'minh', 'ban', 'em', 'anh', 'nay', 'do', 'thi', 'da', 'dang', 'se',
  'hoi', 'muon', 'giai', 'thich', 've', 'tai', 'sao', 'hieu', 'ro', 'hon',
  'nhat', 'khong', 'o', 'vao', 'ra', 'len', 'xuong', 'day', 'du', 'vi', 'nen',
  'là', 'gì', 'như', 'thế', 'nào', 'được', 'có', 'của', 'với', 'và', 'hay',
  'hoặc', 'một', 'các', 'những', 'mình', 'bạn', 'này', 'đó', 'đã', 'đang',
  'sẽ', 'về', 'tại', 'sao', 'không', 'ở', 'vào'
]);

const fallbackRagSearch = (question, currentDay) => {
  const q = question.toLowerCase().trim();
  const rawWords = q.split(/[\s,?.!()[\]]+/);
  const keywords = rawWords.filter(w => w.length >= 3 && !STOP_WORDS.has(w));

  if (keywords.length === 0) return null;

  const scoredSlides = [];
  for (const dayItem of COURSE_DAYS) {
    for (const slide of (dayItem.slides || [])) {
      if (slide.page === 1) continue; // Skip title/cover slides

      const titleLower = slide.title.toLowerCase();
      const contentLower = slide.content.toLowerCase();
      const subtitleLower = (slide.subtitle || '').toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        if (kw.length < 3) continue;
        if (titleLower.includes(kw)) score += 6;
        if (subtitleLower.includes(kw)) score += 3;
        if (contentLower.includes(kw)) score += 2;
      }
      if (dayItem.id === currentDay.id) score += 0.5;
      if (score > 0) scoredSlides.push({ dayItem, slide, score });
    }
  }

  if (scoredSlides.length === 0) return null;
  scoredSlides.sort((a, b) => b.score - a.score);
  const top = scoredSlides.slice(0, 3);

  if (top[0].score < 4) return null;

  const primary = top[0];
  const supplementary = top.slice(1).filter(s => s.score >= 3);

  let answer = `### ${primary.slide.title} [slide ${primary.slide.page}] — ${primary.dayItem.code}\n\n`;
  answer += `**Nội dung chính:**\n${primary.slide.content}\n`;
  if (primary.slide.subtitle) {
    answer += `\n*${primary.slide.subtitle}*\n`;
  }

  if (supplementary.length > 0) {
    answer += `\n---\n**Xem thêm nội dung liên quan:**\n`;
    for (const { slide, dayItem } of supplementary) {
      answer += `- **[slide ${slide.page}]** *${slide.title}* (${dayItem.code}): ${slide.content.split('\n')[0]}\n`;
    }
  }

  const citations = top.filter(s => s.score >= 3).map(s => `${s.dayItem.code} - slide ${s.slide.page}`);

  return {
    answer,
    confidence: Math.min(0.85, 0.55 + primary.score * 0.04),
    citations
  };
};

// ─────────────────────────────────────────────────────────────────────────────
//  SAFE JSON PARSE
// ─────────────────────────────────────────────────────────────────────────────
const safeParseJSON = (rawText) => {
  try { return JSON.parse(rawText); } catch (_) {}
  const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) { try { return JSON.parse(fenced[1].trim()); } catch (_) {} }
  const objMatch = rawText.match(/\{[\s\S]*\}/);
  if (objMatch) { try { return JSON.parse(objMatch[0]); } catch (_) {} }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
//  VALIDATE TUTOR RESPONSE
// ─────────────────────────────────────────────────────────────────────────────
const validateTutorResponse = (parsed) => {
  if (!parsed || typeof parsed !== 'object') return null;
  if (!parsed.answer || typeof parsed.answer !== 'string' || parsed.answer.trim().length < 60) return null;
  const validCitations = (parsed.citations || []).filter(c =>
    typeof c === 'string' && /Day\d{2}\s*-\s*slide\s*\d+/i.test(c)
  );
  return {
    answer: parsed.answer.trim(),
    confidence: typeof parsed.confidence === 'number' ? Math.min(1, Math.max(0, parsed.confidence)) : 0.9,
    citations: validCitations
  };
};

// ─────────────────────────────────────────────────────────────────────────────
//  PROFESSIONAL SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────────────────────
const buildTutorPrompt = (day, activeQuestion, originalQuestion, hasCorrection) => {
  const slideContext = (day.slides || [])
    .map(s => `[slide ${s.page}] ${s.title}: ${s.content}${s.subtitle ? ` | ${s.subtitle}` : ''}`)
    .join('\n');

  const outputFormat = '{"answer":"Câu trả lời đầy đủ Markdown có [slide X], phân tích và ví dụ thực tế","confidence":0.95,"citations":["' + day.code + ' - slide N"]}';

  return `Bạn là VLearn Tutor AI — Giảng viên & Chuyên gia AI của khóa học "AI Thực Chiến" tại VinUniversity.

== BỐI CẢNH BÀI HỌC ==
Bài học: ${day.code} — ${day.title}
Key Concepts: ${day.keyConcepts?.map(c => `${c.name} (${c.citation})`).join(', ')}

== NỘI DUNG TẤT CẢ SLIDES ==
${slideContext}

== TÓM TẮT BÀI HỌC ==
${day.summaryContent || ''}

== CÂU HỎI HỌC VIÊN ==
"${activeQuestion}"${hasCorrection ? ` (Đã sửa lỗi chính tả từ: "${originalQuestion}")` : ''}

== YÊU CẦU TRẢ LỜI BẮT BUỘC ==
1. ĐỘ DÀI: Tối thiểu 4-6 đoạn văn đầy đủ. KHÔNG trả lời ngắn ngủn dưới 100 từ!
2. CẤU TRÚC:
   - Định nghĩa & bản chất khái niệm
   - Phân tích chi tiết từng thành phần / cấp độ
   - Ví dụ doanh nghiệp thực tế sinh động
   - Nguyên tắc vàng / bài học kinh nghiệm
3. TRÍCH DẪN: Gắn slide-số chính xác ngay trong văn bản (ví dụ: "như đã nêu ở trang 10")
4. KHÔNG copy-paste nguyên xi từ slide — PHẢI giải thích thêm
5. NẾU NGOÀI PHẠM VI: Nói thật là không có trong bài học này

== OUTPUT (CHỈ JSON THUẦN TÚY, KHÔNG CÓ TEXT NGOÀI JSON) ==
${outputFormat}`;
};

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN LLM SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export const llmService = {
  generateLearningBridge: async ({ fromDay, toDay, pathMode = 'happy', forceMock = false }) => {
    const apiKey = getApiKey();
    const startTime = Date.now();

    if (forceMock || !apiKey || pathMode !== 'happy') {
      const mockResult = PREBAKED_EXPERIENCE_PATHS[pathMode] || PREBAKED_EXPERIENCE_PATHS.happy;
      logger.logLLMCall({ prompt: `Mock: ${fromDay.code}->${toDay.code} [${pathMode}]`, model: 'prebaked', isRealAPI: false, pathMode }, mockResult, Date.now() - startTime);
      await new Promise(r => setTimeout(r, 400));
      return { ...mockResult, isRealAPI: false };
    }

    try {
      const promptText = `Ban la AI Learning Bridge Agent cho VLearn cua khoa "AI Thuc Chien".
Tao cau noi kien thuc giua 2 buoi hoc.

BUOI CU (${fromDay.code}): ${fromDay.summaryContent || ''} | Concepts: ${JSON.stringify(fromDay.keyConcepts)}
BUOI MOI (${toDay.code}): ${toDay.summaryContent || ''} | Concepts: ${JSON.stringify(toDay.keyConcepts)}

OUTPUT JSON DUY NHAT:
{"pathName":"Happy Path","status":"success","confidenceScore":0.92,
"recap":[{"id":1,"text":"Recap ngan gon","citation":"Day 01 - slide 10","refId":"slide-10"}],
"bridgeLinks":[{"id":"b1","sourceConcept":"Khai niem cu","sourceRef":"Day 01 - slide 20","targetConcept":"Khai niem moi","targetRef":"Day 02 - slide 13","explanation":"Giai thich lien ket"}],
"checklist":[{"id":"ck1","text":"Viec can lam","done":false}],
"quiz":[{"id":"q1","question":"Cau hoi","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Giai thich"}]}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${getModelName()}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
          })
        }
      );

      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsedJSON = safeParseJSON(rawText);
      if (!parsedJSON) throw new Error('JSON parse failed');
      const finalResult = { ...parsedJSON, isRealAPI: true, badgeClass: 'badge-happy' };
      logger.logLLMCall({ prompt: promptText, model: getModelName(), isRealAPI: true, pathMode: 'happy' }, finalResult, Date.now() - startTime);
      return finalResult;
    } catch (err) {
      console.warn('[VLearn Bridge] Fallback to pre-baked:', err.message);
      return { ...PREBAKED_EXPERIENCE_PATHS.happy, isRealAPI: false };
    }
  },

  /**
   * VLearn Tutor — 6-step pipeline
   */
  answerTutorQuestion: async ({ day, question }) => {
    const startTime = Date.now();

    // Step 1: Typo correction
    const { correctedText, hasCorrection, originalText } = normalizeAndCorrectTypos(question);
    const activeQuestion = correctedText;
    const typoCorrection = hasCorrection ? { originalText, correctedText } : null;

    // Step 2: Casual greeting
    const casualResponse = getCasualGreetingResponse(activeQuestion, day);
    if (casualResponse) {
      await new Promise(r => setTimeout(r, 120));
      return { ...casualResponse, typoCorrection };
    }

    const apiKey = getApiKey();

    // Step 3: Gemini API (real key only)
    if (apiKey && apiKey.startsWith('AIzaSy')) {
      try {
        const promptText = buildTutorPrompt(day, activeQuestion, originalText, hasCorrection);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${getModelName()}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 2048, responseMimeType: 'application/json' }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const parsed = safeParseJSON(rawText);
          const validated = validateTutorResponse(parsed);
          if (validated) {
            logger.logLLMCall({ prompt: `Q&A: ${activeQuestion}`, model: getModelName(), isRealAPI: true }, validated, Date.now() - startTime);
            return { ...validated, typoCorrection };
          }
          console.warn('[Tutor] Gemini validation failed -> Knowledge Base');
        }
      } catch (err) {
        console.warn('[Tutor] Gemini API failed:', err.message);
      }
    }

    // Step 4: Knowledge Base intent match
    const kbMatch = findBestKnowledgeMatch(activeQuestion, day);
    if (kbMatch) {
      await new Promise(r => setTimeout(r, 150));
      const richAnswer = formatRichAnswer(kbMatch.entry, day);
      logger.logLLMCall({ prompt: `KB: ${activeQuestion} -> ${kbMatch.entry.id}`, model: 'knowledge-base', isRealAPI: false }, richAnswer, Date.now() - startTime);
      return { ...richAnswer, typoCorrection };
    }

    // Step 5: Fallback RAG
    const ragResult = fallbackRagSearch(activeQuestion, day);
    if (ragResult) {
      await new Promise(r => setTimeout(r, 180));
      logger.logLLMCall({ prompt: `RAG: ${activeQuestion}`, model: 'fallback-rag', isRealAPI: false }, ragResult, Date.now() - startTime);
      return { ...ragResult, typoCorrection };
    }

    // Step 6: Honest fallback
    const topicHints = (day.keyConcepts || []).slice(0, 3).map(c => `- **${c.name}** (${c.citation})`).join('\n');

    return {
      answer: `Mình chưa tìm thấy thông tin chính xác về **"${activeQuestion}"** trong tài liệu **${day.code}: ${day.title}**.\n\nĐể đảm bảo độ chính xác, mình sẽ không tự đoán ra câu trả lời.\n\n**Bạn có thể thử:**\n1. Diễn đạt lại câu hỏi cụ thể hơn (ví dụ: "3 cấp giải pháp là gì?" hoặc "PAIR Framework là gì?")\n2. Hỏi trực tiếp về một trong các chủ đề trọng tâm:\n${topicHints}\n3. Mở trực tiếp Slide để xem nội dung đầy đủ\n\n*Nếu câu hỏi liên quan đến bài học khác, hãy cho mình biết để mình tìm đúng nguồn nhé.*`,
      confidence: 0.0,
      citations: [],
      typoCorrection,
      isFallback: true
    };
  }
};
