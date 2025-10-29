import { Node, mergeAttributes } from '@tiptap/core';

export interface SectionOptions {
  HTMLAttributes: Record<string, string>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    section: {
      setSection: () => ReturnType;
      toggleSection: () => ReturnType;
      deleteSection: (pos: number) => ReturnType;
    };
  }
}

export const Section = Node.create<SectionOptions>({
  name: 'section',

  group: 'block',

  content: 'block+',

  defining: true,

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      title: {
        default: '새 섹션',
        parseHTML: element => element.getAttribute('data-section-title'),
        renderHTML: attributes => {
          return {
            'data-section-title': attributes.title,
          };
        },
      },
      collapsed: {
        default: false,
        parseHTML: element => element.getAttribute('data-collapsed') === 'true',
        renderHTML: attributes => {
          return {
            'data-collapsed': String(attributes.collapsed),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-section]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-section': 'true',
        class: 'editor-section',
      }),
      [
        'div',
        {
          class: 'editor-section-header',
          contenteditable: 'false',
        },
        [
          'div',
          {
            class: 'editor-section-title-wrapper',
          },
          [
            'span',
            {
              class: 'editor-section-title',
            },
            HTMLAttributes.title || '새 섹션',
          ],
        ],
      ],
      [
        'div',
        {
          class: 'editor-section-content',
        },
        0,
      ],
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-section', 'true');
      dom.className = 'editor-section';
      dom.setAttribute('data-section-title', node.attrs.title);

      const header = document.createElement('div');
      header.className = 'editor-section-header';
      header.contentEditable = 'false';

      const titleWrapper = document.createElement('div');
      titleWrapper.className = 'editor-section-title-wrapper';

      const input = document.createElement('input');
      input.className = 'editor-section-title';
      input.type = 'text';
      input.value = node.attrs.title || '새 섹션';
      input.placeholder = '섹션 제목을 입력하세요';

      // input 이벤트 처리: 제목 업데이트
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        if (typeof getPos === 'function') {
          const pos = getPos();
          if (pos !== undefined) {
            editor.view.dispatch(
              editor.view.state.tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                title: target.value,
              })
            );
          }
        }
      });

      // 키보드 이벤트 전파 방지: 백스페이스, 삭제 등이 에디터로 전달되지 않도록
      input.addEventListener('keydown', (e) => {
        e.stopPropagation();
      });

      // 포커스 이벤트 처리
      input.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });

      // 삭제 버튼 추가
      const deleteButton = document.createElement('button');
      deleteButton.className = 'editor-section-delete';
      deleteButton.innerHTML = '✕';
      deleteButton.type = 'button';
      deleteButton.contentEditable = 'false';
      deleteButton.style.cssText = 'margin-left: auto; padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold;';

      // mousedown에서 삭제 처리 (click 이벤트보다 안정적)
      deleteButton.onmousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('🗑️ 섹션 삭제 버튼 클릭 (mousedown)');
        console.log('🔍 현재 섹션 제목:', node.attrs.title);

        try {
          // editor state를 순회하면서 현재 섹션 노드 찾기
          let foundPos: number | null = null;
          const { state } = editor;

          state.doc.descendants((descendantNode, pos) => {
            // 이미 찾았으면 순회 중단
            if (foundPos !== null) {
              return false;
            }

            // section 노드이고, 제목이 일치하면
            if (
              descendantNode.type.name === 'section' &&
              descendantNode.attrs.title === node.attrs.title &&
              descendantNode.nodeSize === node.nodeSize
            ) {
              console.log('✅ 섹션 발견! Position:', pos);
              foundPos = pos;
              return false; // 순회 중단
            }
          });

          if (foundPos === null) {
            console.error('❌ 섹션을 찾을 수 없습니다');
            return;
          }

          console.log('📍 Final Position:', foundPos);
          console.log('📏 Node size:', node.nodeSize);

          // 섹션 삭제
          const tr = state.tr.delete(foundPos, foundPos + node.nodeSize);
          editor.view.dispatch(tr);
          console.log('✅ 섹션 삭제 완료');
        } catch (error) {
          console.error('❌ 섹션 삭제 실패:', error);
        }
      };

      deleteButton.onmouseenter = () => {
        deleteButton.style.background = '#dc2626';
      };

      deleteButton.onmouseleave = () => {
        deleteButton.style.background = '#ef4444';
      };

      titleWrapper.appendChild(input);
      titleWrapper.appendChild(deleteButton);
      header.appendChild(titleWrapper);

      const content = document.createElement('div');
      content.className = 'editor-section-content';

      dom.appendChild(header);
      dom.appendChild(content);

      return {
        dom,
        contentDOM: content,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'section') return false;
          // input이 focus되어 있지 않을 때만 value 업데이트 (사용자 입력 중에는 덮어쓰지 않음)
          if (document.activeElement !== input) {
            input.value = updatedNode.attrs.title;
          }
          dom.setAttribute('data-section-title', updatedNode.attrs.title);
          return true;
        },
      };
    };
  },

  addCommands() {
    return {
      setSection:
        () =>
        ({ state, chain }) => {
          // 무조건 문서 끝에 새 섹션 추가 (에디터 최상위 레벨)
          const docSize = state.doc.content.size;

          return chain()
            .focus()
            .insertContentAt(docSize, {
              type: 'section',
              attrs: { title: '새 섹션' },
              content: [{ type: 'paragraph' }],
            })
            .run();
        },
      toggleSection:
        () =>
        ({ commands }) => {
          return commands.toggleWrap(this.name);
        },
      deleteSection:
        (pos: number) =>
        ({ state, dispatch }) => {
          const node = state.doc.nodeAt(pos);
          if (!node || node.type.name !== 'section') {
            return false;
          }

          if (dispatch) {
            const tr = state.tr.delete(pos, pos + node.nodeSize);
            dispatch(tr);
          }

          return true;
        },
    };
  },
});
