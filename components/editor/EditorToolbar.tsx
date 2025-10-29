'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Minus,
  Undo,
  Redo,
  FolderOpen,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Code,
  CheckSquare,
  Youtube,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Palette,
  Type,
  Maximize2,
  Trash2,
} from 'lucide-react';
import ImageUploader from './ImageUploader';

// 폰트 크기 옵션
const FONT_SIZES = [
  { label: '매우 작게', value: '12px' },
  { label: '작게', value: '14px' },
  { label: '보통', value: '16px' },
  { label: '크게', value: '18px' },
  { label: '매우 크게', value: '24px' },
  { label: '특대', value: '32px' },
  { label: '초대형', value: '48px' },
];

interface EditorToolbarProps {
  editor: Editor;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const [showImageUploader, setShowImageUploader] = useState(false);

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2.5 rounded-lg transition-all ${
        isActive
          ? 'bg-yellow-100 text-yellow-700 shadow-sm'
          : 'text-gray-700 hover:bg-yellow-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
    >
      {children}
    </button>
  );

  const handleImageUpload = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
    setShowImageUploader(false);
  };

  const addLink = () => {
    const url = window.prompt('링크 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addSection = () => {
    editor.chain().focus().setSection().run();
  };

  const addYoutube = () => {
    const url = window.prompt('Youtube URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const setImageSize = (width: string) => {
    editor.chain().focus().updateAttributes('image', { width }).run();
  };

  return (
    <div className="sticky top-0 z-40 flex flex-wrap items-center gap-1 p-4 bg-gradient-to-r from-yellow-50 via-white to-green-50 border-b-2 border-yellow-100 backdrop-blur-sm shadow-md rounded-t-2xl">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1 mr-3 pr-3 border-r-2 border-yellow-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="실행 취소 (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="다시 실행 (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Text Formatting */}
      <div className="flex items-center gap-1 mr-3 pr-3 border-r-2 border-yellow-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="굵게 (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="기울임 (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="밑줄 (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="취소선"
        >
          <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">S</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
          title="아래첨자"
        >
          <SubscriptIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
          title="위첨자"
        >
          <SuperscriptIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 mr-3 pr-3 border-r-2 border-yellow-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="제목 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="제목 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="제목 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Font Size */}
      <div className="flex items-center gap-2 mr-3 pr-3 border-r-2 border-yellow-200">
        <Type className="w-4 h-4 text-gray-600" />
        <select
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontSize(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontSize().run();
            }
          }}
          className="text-xs sm:text-sm px-2 py-1 border-2 border-yellow-200 rounded-lg bg-white hover:border-yellow-400 focus:outline-none focus:border-yellow-400 cursor-pointer"
          title="텍스트 크기"
        >
          <option value="">크기 선택</option>
          {FONT_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label} ({size.value})
            </option>
          ))}
        </select>
      </div>

      {/* Text Alignment */}
      <div className="flex items-center gap-1 mr-3 pr-3 border-r-2 border-yellow-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="왼쪽 정렬"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="가운데 정렬"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="오른쪽 정렬"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="양쪽 정렬"
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Text Color & Highlight */}
      <div className="flex items-center gap-1 mr-3 pr-3 border-r-2 border-yellow-200">
        <div className="flex items-center gap-1">
          <label className="cursor-pointer" title="텍스트 색상">
            <Palette className="w-4 h-4 text-gray-700 hover:text-yellow-600" />
            <input
              type="color"
              className="w-0 h-0 opacity-0 absolute"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            />
          </label>
        </div>
        <div className="flex items-center gap-1">
          <label className="cursor-pointer" title="하이라이트">
            <Highlighter className="w-4 h-4 text-gray-700 hover:text-yellow-600" />
            <input
              type="color"
              className="w-0 h-0 opacity-0 absolute"
              onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
            />
          </label>
        </div>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 mr-3 pr-3 border-r-2 border-yellow-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="글머리 기호 목록"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="번호 매기기 목록"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          title="체크리스트"
        >
          <CheckSquare className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Insert Elements */}
      <div className="flex items-center gap-1 mr-3 pr-3 border-r-2 border-yellow-200">
        <ToolbarButton onClick={() => setShowImageUploader(true)} title="이미지 업로드">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addLink} title="링크 삽입">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addYoutube} title="Youtube 동영상 삽입">
          <Youtube className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addTable} title="표 삽입">
          <TableIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="코드 블록"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="구분선 삽입"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Image Size Controls - Only show when image is selected */}
      {editor.isActive('image') && (
        <div className="flex items-center gap-1 mr-3 pr-3 border-r-2 border-yellow-200">
          <Maximize2 className="w-4 h-4 text-gray-600" />
          <button
            type="button"
            onClick={() => setImageSize('400px')}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-yellow-200 rounded hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            title="작게 (400px)"
          >
            작게
          </button>
          <button
            type="button"
            onClick={() => setImageSize('600px')}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-yellow-200 rounded hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            title="중간 (600px)"
          >
            중간
          </button>
          <button
            type="button"
            onClick={() => setImageSize('800px')}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-yellow-200 rounded hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            title="크게 (800px)"
          >
            크게
          </button>
          <button
            type="button"
            onClick={() => setImageSize('100%')}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-yellow-200 rounded hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            title="원본 크기"
          >
            원본
          </button>
        </div>
      )}

      {/* Table Controls - Only show when table is selected */}
      {editor.isActive('table') && (
        <div className="flex items-center gap-1 mr-3 pr-3 border-r-2 border-yellow-200">
          <TableIcon className="w-4 h-4 text-gray-600" />
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-yellow-200 rounded hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            title="왼쪽에 열 추가"
          >
            ← 열
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-yellow-200 rounded hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            title="오른쪽에 열 추가"
          >
            열 →
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-yellow-200 rounded hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            title="위에 행 추가"
          >
            ↑ 행
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-yellow-200 rounded hover:bg-yellow-50 hover:border-yellow-400 transition-all"
            title="아래에 행 추가"
          >
            행 ↓
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-red-200 text-red-600 rounded hover:bg-red-50 hover:border-red-400 transition-all"
            title="열 삭제"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-red-200 text-red-600 rounded hover:bg-red-50 hover:border-red-400 transition-all"
            title="행 삭제"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-2 py-1 text-xs font-medium bg-white border-2 border-red-300 text-red-700 rounded hover:bg-red-50 hover:border-red-500 transition-all"
            title="표 삭제"
          >
            표 삭제
          </button>
        </div>
      )}

      {/* Section */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={addSection}
          isActive={editor.isActive('section')}
          title="접을 수 있는 섹션 추가"
        >
          <FolderOpen className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Image Upload Modal */}
      {showImageUploader && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border-4 border-yellow-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">이미지 업로드</h3>
              <button
                onClick={() => setShowImageUploader(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <ImageUploader
              onImageUpload={handleImageUpload}
              onCancel={() => setShowImageUploader(false)}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
