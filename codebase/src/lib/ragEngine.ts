import { d1Slides, d2Slides, SlideItem } from '../data/slidesData';

export interface SlideSearchResult {
  heading: string;
  subheading?: string;
  takeaway?: string;
  bodyText: string;
  doc: 'd1' | 'd2';
  page: number;
  prefix: string;
  citation: string;
  score: number;
}

const STOPWORDS = new Set([
  'la','gi','sao','tai','khi','nao','co','khong','va','cua','cho','trong',
  'mot','cac','de','nen','a','oi','giup','minh','ban','hay','lam','the',
  'nhu','neu','se','duoc','nay','do','voi','ve','tu','ra','vi','no',
  'nhung','vay','sao','ai','hon'
]);

function stripDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function tokenize(str: string): string[] {
  return stripDiacritics(str.toLowerCase())
    .replace(/[?.,!;:"'()]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2 && !STOPWORDS.has(w));
}

export function searchSlides(query: string): SlideSearchResult | null {
  const queryWords = tokenize(query);
  if (queryWords.length === 0) return null;

  const d1Mapped = d1Slides.map((s, i) => ({ ...s, doc: 'd1' as const, page: i + 1, prefix: 'T01' }));
  const d2Mapped = d2Slides.map((s, i) => ({ ...s, doc: 'd2' as const, page: i + 1, prefix: 'T02' }));
  const allSlides = [...d1Mapped, ...d2Mapped];

  let bestMatch: SlideSearchResult | null = null;
  let highestScore = 0;

  allSlides.forEach(slide => {
    const fullText = [
      slide.heading,
      slide.subheading || '',
      (slide.body || []).join(' '),
      slide.takeaway || ''
    ].join(' ');

    const haystack = tokenize(fullText);
    const haystackSet = new Set(haystack);
    
    let score = 0;
    queryWords.forEach(word => {
      if (haystackSet.has(word)) score++;
    });

    if (score > highestScore) {
      highestScore = score;
      const citation = `${slide.prefix}-${String(slide.page).padStart(3, '0')}`;
      bestMatch = {
        heading: slide.heading,
        subheading: slide.subheading,
        takeaway: slide.takeaway,
        bodyText: (slide.body || []).join(' • '),
        doc: slide.doc,
        page: slide.page,
        prefix: slide.prefix,
        citation,
        score
      };
    }
  });

  return highestScore > 0 ? bestMatch : null;
}
