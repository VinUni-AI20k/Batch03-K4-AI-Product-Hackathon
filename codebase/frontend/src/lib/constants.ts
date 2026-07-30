import { Scene, Peer, LoadingStep, MindmapData } from './types';

export const SCENE_TYPES: Record<Scene['type'], { label: string; icon: string }> = {
  slide: { label: 'Slide', icon: '📑' },
  code: { label: 'Code', icon: '💻' },
  dashboard: { label: 'Tương tác', icon: '🎛️' },
  mindmap: { label: 'Sơ đồ tư duy', icon: '🧠' },
  quiz: { label: 'Bài tập', icon: '📝' },
  game: { label: 'Trò chơi', icon: '🎮' },
};

export const INITIAL_SCENES: Scene[] = [
  { id: 's0', type: 'slide', title: 'Welcome to Python' },
  { id: 's1', type: 'code', title: 'Your First Line of Code' },
  { id: 's2', type: 'dashboard', title: 'Variables as Containers' },
  { id: 's3', type: 'slide', title: 'Control Flow Basics' },
  { id: 's4', type: 'mindmap', title: 'The Logic Flowchart' },
  { id: 's5', type: 'quiz', title: 'Conditional Coding Challenge' },
  { id: 's6', type: 'game', title: 'Looping Logic Lab' },
];

export const NARRATIONS: Record<string, string> = {
  s0: 'Xin chào! Chào mừng đến với khóa học Python. Mình rất hào hứng được đồng hành cùng bạn trong hành trình này!',
  s1: 'Bây giờ hãy viết dòng lệnh Python đầu tiên của bạn. Nhấn Run Code để xem kết quả nhé.',
  s2: 'Hãy hình dung một biến giống như một chiếc hộp có nhãn. Thử kéo thanh trượt bên dưới để xem giá trị thay đổi thế nào nhé.',
  s3: 'Control flow quyết định thứ tự thực thi các câu lệnh — hãy cùng xem qua if/else, for và while.',
  s4: 'Đây là sơ đồ tư duy tổng hợp toàn bộ logic điều khiển chương trình mà chúng ta vừa học.',
  s5: 'Đến lúc kiểm tra nhanh kiến thức rồi! Trả lời lần lượt các câu hỏi bên dưới nhé.',
  s6: 'Hãy kéo thả các khối lệnh đúng thứ tự để hoàn thành vòng lặp for nhé!',
};

export const QUIZ_BANK = [
  { q: 'Lệnh nào dùng để in ra màn hình trong Python?', opts: ['console.log()', 'print()', 'echo()', 'System.out.println()'], correct: 1 },
  { q: 'Cấu trúc nào dùng để rẽ nhánh theo điều kiện?', opts: ['for', 'while', 'if / else', 'def'], correct: 2 },
  { q: 'range(5) sinh ra dãy số nào?', opts: ['1,2,3,4,5', '0,1,2,3,4', '0,1,2,3,4,5', '5,4,3,2,1'], correct: 1 },
];

export const GAME_CHIPS = ['for', 'i', 'in', 'range(5):', 'print(i)'];

export const PEERS: Peer[] = [
  { initial: '🙂', name: 'Curious Mind', role: 'Student', desc: 'Always curious, loves asking why and how' },
  { initial: '🤓', name: 'Logic Master', role: 'Student', desc: 'Thinks in patterns, enjoys solving step by step' },
  { initial: '✨', name: 'Bright Spark', role: 'Student', desc: 'Quick to try things out, learns by experimenting' },
];

export const DISCUSSION_TEMPLATES: Record<string, (t: string) => string[]> = {
  'Curious Mind': (t: string) => [
    `Mình tò mò là tại sao "${t}" lại quan trọng trong bài học này nhỉ?`,
    `Cho hỏi thêm, "${t}" có liên quan gì tới biến hay vòng lặp không?`,
    `Có ví dụ thực tế nào cho "${t}" không, mình muốn thử ngay!`,
  ],
  'Logic Master': (t: string) => [
    `Theo mình hiểu, "${t}" hoạt động rất logic nếu chia nhỏ từng bước.`,
    `Nếu áp dụng "${t}" vào bài tập trước thì kết quả sẽ khác đấy.`,
    `Mình nghĩ nên viết ra sơ đồ để dễ hình dung "${t}" hơn.`,
  ],
  'Bright Spark': (t: string) => [
    `Để mình thử code nhanh với "${t}" xem sao!`,
    `Mình vừa thử nghiệm liên quan tới "${t}" và thấy khá hay ho.`,
    `"${t}" làm mình nhớ tới một bài tập mình từng làm trước đây.`,
  ],
};

export const LOADING_STEPS: LoadingStep[] = [
  { label: 'Đang phân tích nội dung slide bạn vừa tải lên', from: 0, to: 20 },
  { label: 'Đang tạo kịch bản bài giảng và giọng đọc (TTS)', from: 20, to: 42 },
  { label: 'Đang tạo slide tương tác (biến, dashboard)', from: 42, to: 60 },
  { label: 'Đang tạo sơ đồ tư duy tổng hợp bài học', from: 60, to: 78 },
  { label: 'Đang tạo bài tập và trò chơi tương tác', from: 78, to: 100 },
];

export const MINDMAP_DATA: MindmapData = {
  root: 'Control Flow',
  branches: [
    { name: 'if / else', angle: -55, leaves: ['Điều kiện đúng/sai', 'Rẽ nhánh chương trình'] },
    { name: 'for loop', angle: 5, leaves: ['Lặp qua tập hợp', 'range(), list, string'] },
    { name: 'while loop', angle: 65, leaves: ['Lặp khi còn đúng', 'Cẩn thận vòng lặp vô hạn'] },
  ],
};
