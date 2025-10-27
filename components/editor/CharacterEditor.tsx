'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';

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
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'editor-image rounded-xl shadow-lg my-4 mx-auto max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link text-yellow-600 underline hover:text-yellow-700',
        },
      }),
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
      Placeholder.configure({
        placeholder,
      }),
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
    <div className="bg-white rounded-2xl border-2 border-yellow-200 shadow-lg overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="border-t-2 border-yellow-100">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
