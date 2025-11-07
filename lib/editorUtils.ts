/**
 * 에디터 HTML 콘텐츠에서 섹션의 "새 섹션" 텍스트만 제거
 * 저장 직전에 호출하여 깨끗한 HTML을 저장
 */
export function cleanSectionContent(html: string): string {
  if (typeof window === 'undefined' || !html) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sectionContents = doc.querySelectorAll('.editor-section-content');

  sectionContents.forEach((contentDiv) => {
    const paragraphs = contentDiv.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const text = p.textContent?.trim();
      // "새 섹션" 텍스트만 있는 paragraph 제거
      if (text === '새 섹션') {
        p.remove();
      }
    });
  });

  return doc.body.innerHTML;
}
