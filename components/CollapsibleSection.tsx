'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-6 border-2 border-yellow-300 rounded-xl overflow-hidden bg-gradient-to-br from-yellow-50 to-green-50 shadow-lg">
      {/* 헤더 (클릭 가능) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-yellow-200 to-green-200 px-6 py-4 cursor-pointer hover:from-yellow-300 hover:to-green-300 transition-all flex items-center justify-between group"
        aria-expanded={isOpen}
        aria-label={`${title} 섹션 ${isOpen ? '접기' : '펼치기'}`}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.3 }}
            className="text-yellow-700"
          >
            {isOpen ? (
              <ChevronDown className="w-6 h-6" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </motion.div>
          <span className="text-2xl">📂</span>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <span className="text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          {isOpen ? '접기' : '펼치기'}
        </span>
      </button>

      {/* 콘텐츠 (애니메이션) */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white border-t-2 border-yellow-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
