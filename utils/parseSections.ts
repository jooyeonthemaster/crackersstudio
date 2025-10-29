// TipTap에서 생성된 HTML에서 섹션을 파싱하는 유틸리티

export interface ParsedSection {
  title: string;
  content: string;
}

export function parseSections(html: string): { sections: ParsedSection[]; regularContent: string } {
  if (!html) {
    return { sections: [], regularContent: '' };
  }

  // DOMParser를 사용해서 HTML을 제대로 파싱
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 간단한 정규식 사용
    return parseWithRegex(html);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const sections: ParsedSection[] = [];
  const sectionElements = doc.querySelectorAll('[data-section="true"]');

  sectionElements.forEach((sectionEl) => {
    // 섹션 제목 추출
    const title = sectionEl.getAttribute('data-section-title') || '제목 없음';

    // 섹션 콘텐츠 추출
    const contentDiv = sectionEl.querySelector('.editor-section-content');
    const content = contentDiv ? contentDiv.innerHTML.trim() : '';

    sections.push({ title, content });

    // 원본 HTML에서 섹션 제거
    sectionEl.remove();
  });

  // 남은 콘텐츠 추출 (섹션이 아닌 일반 콘텐츠)
  const regularContent = doc.body.innerHTML.trim();

  return { sections, regularContent };
}

// 서버 사이드용 폴백 (정규식 기반)
function parseWithRegex(html: string): { sections: ParsedSection[]; regularContent: string } {
  const sections: ParsedSection[] = [];
  let regularContent = html;

  // 섹션을 찾기 위한 임시 container
  const tempDiv = { innerHTML: html };

  // 간단한 정규식 매칭 (중첩 처리 없음)
  const sectionRegex = /<div[^>]*data-section="true"[^>]*data-section-title="([^"]*)"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;

  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const [fullMatch, title] = match;

    // 콘텐츠 추출을 위한 더 정확한 매칭
    const contentMatch = fullMatch.match(/class="editor-section-content"[^>]*>([\s\S]*?)$/);
    const content = contentMatch ? contentMatch[1].replace(/<\/div>\s*<\/div>$/, '').trim() : '';

    sections.push({ title, content });
    regularContent = regularContent.replace(fullMatch, '');
  }

  return { sections, regularContent: regularContent.trim() };
}
