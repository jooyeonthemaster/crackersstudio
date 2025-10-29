'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ResizableImageExtension from 'tiptap-extension-resize-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { common, createLowlight } from 'lowlight';
import EditorToolbar from './EditorToolbar';
import { Section } from './extensions/Section';
import { FontSize } from './extensions/FontSize';

// Syntax highlighting 설정
const lowlight = createLowlight(common);

interface CharacterEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export default function CharacterEditor({
  content,
  onChange,
  placeholder = '캐릭터 스토리를 작성하세요... 이미지, 링크, 테이블 등을 자유롭게 추가할 수 있습니다!'
}: CharacterEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // SSR 환경에서 hydration mismatch 방지
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // CodeBlockLowlight 사용을 위해 비활성화
      }),
      // 텍스트 스타일링
      Underline,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'editor-highlight',
        },
      }),
      Subscript,
      Superscript,
      // 텍스트 정렬
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      // 이미지 (리사이즈 가능)
      ResizableImageExtension.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'editor-image rounded-xl shadow-lg my-4 mx-auto',
        },
      }),
      // 링크
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link text-yellow-600 underline hover:text-yellow-700',
        },
      }),
      // 테이블
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table border-collapse border-2 border-yellow-300 rounded-lg overflow-hidden my-4',
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-yellow-200 px-4 py-3',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-yellow-300 px-4 py-3 bg-yellow-50 font-bold text-gray-800',
        },
      }),
      // 코드 블록 (Syntax Highlighting)
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'editor-code-block bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto',
        },
      }),
      // Task List (체크리스트)
      TaskList.configure({
        HTMLAttributes: {
          class: 'editor-task-list',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'editor-task-item flex items-start gap-2',
        },
        nested: true,
      }),
      // Youtube 임베드
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'editor-youtube rounded-xl my-4 mx-auto',
        },
      }),
      // 플레이스홀더
      Placeholder.configure({
        placeholder,
      }),
      // 커스텀 섹션
      Section,
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[500px] px-6 py-6',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // content prop이 변경되면 에디터 내용 업데이트
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentContent = editor.getHTML();
      // 현재 에디터 내용과 다를 때만 업데이트 (무한 루프 방지)
      if (currentContent !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-yellow-200 shadow-lg">
      <EditorToolbar editor={editor} />
      <div className="border-t-2 border-yellow-100 overflow-hidden rounded-b-2xl">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
