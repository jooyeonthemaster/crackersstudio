'use client';

import { Book } from '@/types';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface BookCardProps {
  book: Book;
  isCurrentlyPlaying?: boolean;
}

export function BookCard({ book, isCurrentlyPlaying = false }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCurrentlyPlaying && cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    } else if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isCurrentlyPlaying]);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link href={`/characters/${book.id}`}>
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, rotate: isCurrentlyPlaying ? 0 : 2 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      {/* 귀여운 그림자 효과 ✨ */}
      <div className="absolute -inset-3 bg-gradient-to-br from-yellow-300/60 via-green-300/60 to-yellow-300/60 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300" />

      {/* 재생 중일 때 반짝이는 효과 */}
      {isCurrentlyPlaying && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 rounded-[2rem] opacity-50"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* 메인 카드 - 더 둥글고 귀엽게 */}
      <div className="relative bg-white rounded-[1.5rem] border-3 border-yellow-200 overflow-hidden shadow-xl transition-all duration-300 group-hover:border-yellow-400 group-hover:shadow-2xl group-hover:border-4">
        {/* 캐릭터 이미지 */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          {/* 반짝이는 효과 */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '200%', opacity: [0, 0.3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent z-10"
              />
            )}
          </AnimatePresence>

          {!imageError ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={handleImageError}
              priority={book.id <= 6}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
              <div className="text-center p-4">
                <div className="text-5xl mb-3">🎵</div>
                <div className="text-sm font-bold text-gray-700">{book.title}</div>
              </div>
            </div>
          )}

          {/* 귀여운 재생 중 표시 🎵 */}
          <AnimatePresence>
            {isCurrentlyPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="absolute top-3 right-3 z-20"
              >
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-400 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl border-2 border-white"
                  animate={{ 
                    boxShadow: ["0 4px 12px rgba(251, 191, 36, 0.4)", "0 6px 20px rgba(251, 191, 36, 0.6)", "0 4px 12px rgba(251, 191, 36, 0.4)"]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="flex gap-0.5">
                    <motion.span 
                      className="inline-block w-1 h-3 bg-white rounded-full"
                      animate={{ height: ["12px", "16px", "12px"] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    <motion.span 
                      className="inline-block w-1 h-3 bg-white rounded-full"
                      animate={{ height: ["12px", "16px", "12px"] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                    />
                    <motion.span 
                      className="inline-block w-1 h-3 bg-white rounded-full"
                      animate={{ height: ["12px", "16px", "12px"] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-gray-800">재생중 ♪</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 귀여운 호버 오버레이 ✨ */}
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/80 via-green-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              whileHover={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="text-center opacity-0 group-hover:opacity-100"
            >
              {/* 귀여운 재생 버튼 */}
              <div className="relative">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-yellow-100 backdrop-blur-sm flex items-center justify-center mb-3 mx-auto shadow-2xl border-4 border-white"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.span 
                    className="text-3xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {isCurrentlyPlaying ? '⏸️' : '▶️'}
                  </motion.span>
                </motion.div>
                {/* 반짝이는 효과 */}
                <motion.div
                  className="absolute -top-1 -right-1 text-xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              </div>

              <motion.div
                className="text-white font-bold text-sm drop-shadow-2xl bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                📖 스토리 보기
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* 귀여운 캐릭터 정보 💕 */}
        <div className="p-4 bg-gradient-to-b from-white to-yellow-50 border-t-2 border-yellow-100">
          {/* 제목 */}
          <motion.h3
            className="font-bold text-gray-900 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 leading-tight text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {book.title}
          </motion.h3>

          {/* 작가 */}
          <div className="text-[10px] sm:text-xs text-gray-600 text-center mb-2 sm:mb-3 font-medium">
            {book.author}
          </div>

          {/* 재생 중 상태 표시 */}
          {isCurrentlyPlaying && (
            <div className="flex items-center justify-center gap-2">
              <motion.span
                className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-green-400"
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(251, 191, 36, 0.4)",
                    "0 0 0 8px rgba(251, 191, 36, 0)",
                    "0 0 0 0 rgba(251, 191, 36, 0)"
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
              <span className="text-[10px] sm:text-xs font-bold text-yellow-600">
                🎵 재생 중
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
    </Link>
  );
}
