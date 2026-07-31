import { NextRequest, NextResponse } from 'next/server';
import { d1Slides, d2Slides } from '@/data/slidesData';

const sections: { [key: string]: Array<{ id: string; title: string; slideStart: number; slideEnd: number }> } = {
  d1: [
    { id: "d1-s1", title: "Bức tranh AI & các tầng của AI", slideStart: 0, slideEnd: 3 },
    { id: "d1-s2", title: "Lịch sử AI 70 năm", slideStart: 4, slideEnd: 8 },
    { id: "d1-s3", title: "Bên trong LLM: cơ chế vận hành", slideStart: 9, slideEnd: 21 },
    { id: "d1-s4", title: "Từ LLM đến AI Agent", slideStart: 22, slideEnd: 23 },
    { id: "d1-s5", title: "Chọn model & chi phí token", slideStart: 24, slideEnd: 28 }
  ],
  d2: [
    { id: "d2-s1", title: "Problem Discovery", slideStart: 0, slideEnd: 6 },
    { id: "d2-s2", title: "Problem Statement & định lượng hoá", slideStart: 7, slideEnd: 11 },
    { id: "d2-s3", title: "PAIR ①② — Automate/Augment & mức giải pháp", slideStart: 12, slideEnd: 19 },
    { id: "d2-s4", title: "Reward function & tiêu chí thành công", slideStart: 20, slideEnd: 23 }
  ]
};

function getSection(day: string, sectionId: string) {
  const list = sections[day];
  if (!list) return null;
  return list.find(s => s.id === sectionId) || null;
}

function getSectionGroundingText(day: string, sectionId: string) {
  const section = getSection(day, sectionId);
  const slides = day === 'd1' ? d1Slides : d2Slides;
  if (!section || !slides) return null;

  const citationPrefix = day === 'd1' ? 'T01' : 'T02';
  const chunks: string[] = [];

  for (let i = section.slideStart; i <= section.slideEnd; i++) {
    const slide = slides[i];
    if (!slide) continue;
    const page = i + 1;
    const citation = `${citationPrefix}-${String(page).padStart(3, '0')}`;
    const lines = [`[${citation}] ${slide.heading}`];
    if (slide.subheading) lines.push(slide.subheading);
    if (slide.body && slide.body.length) lines.push(...slide.body);
    if (slide.takeaway) lines.push(`Takeaway: ${slide.takeaway}`);
    chunks.push(lines.join('\n'));
  }
  return chunks.join('\n\n');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { day, sectionId, questionCount = 4, regenerate = false } = body || {};

    if (!day || !sectionId) {
      return NextResponse.json({ error: 'day and sectionId are required' }, { status: 400 });
    }

    // Try calling Express backend server at port 3000 if active
    try {
      const backendRes = await fetch('http://localhost:3000/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, sectionId, questionCount, regenerate }),
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend Express server not running or port 3001 unreachable -> proceed with fallback
    }

    const section = getSection(day, sectionId);
    if (!section) {
      return NextResponse.json({ error: `Unknown section ${day}/${sectionId}` }, { status: 404 });
    }

    const groundingText = getSectionGroundingText(day, sectionId);

    return NextResponse.json({
      day,
      sectionId,
      sectionTitle: section.title,
      groundingText,
      status: 'OK',
      source: 'Next.js Local Grounded Engine',
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process generate-quiz request' }, { status: 500 });
  }
}
