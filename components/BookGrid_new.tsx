'use client';

import { Book } from '@/types';
import { BookCard } from './BookCard';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Header } from './Header';

interface BookGridProps {
  books: Book[];
}

export function BookGrid({ books }: BookGridProps) {
  const { currentBook, playBook, isPlaying, currentTime, duration, seekTo } = useAudioPlayer();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Header />
      
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            className="min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* 히어로 섹션 - 귀여워진 버전 ✨ */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden mt-20 bg-gradient-to-br from-yellow-50 via-white to-green-50">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white z-10" />
                <Image
                  src="https://cdn.imweb.me/thumbnail/20241107/f160c6c87fe70.png"
                  alt="Little Crack Background"
                  fill
                  className="object-cover opacity-80"
                  priority
                  unoptimized
                />
                {/* 귀여운 떠다니는 별들 ✨ */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <motion.div
                    className="absolute top-20 left-10 text-4xl"
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    ⭐
                  </motion.div>
                  <motion.div
                    className="absolute top-32 right-16 text-3xl"
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, -10, 0]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    🌟
                  </motion.div>
                  <motion.div
                    className="absolute bottom-32 left-20 text-3xl"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 15, 0]
                    }}
                    transition={{ 
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    💫
                  </motion.div>
                  <motion.div
                    className="absolute bottom-40 right-24 text-2xl"
                    animate={{ 
                      y: [0, -12, 0],
                      rotate: [0, -12, 0]
                    }}
                    transition={{ 
                      duration: 2.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3
                    }}
                  >
                    ✨
                  </motion.div>
                </div>
              </div>

              <motion.div
                className="relative z-20 text-center px-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.4 }}
              >
                <motion.div 
                  className="mb-8"
                  animate={{ 
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src="https://cdn.imweb.me/upload/S202311105b2365df139e7/da7ac0e771e0c.png"
                    alt="Little Crack Logo"
                    width={400}
                    height={150}
                    className="mx-auto drop-shadow-2xl"
                    priority
                    unoptimized
                  />
                </motion.div>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
                  className="text-xl md:text-2xl text-gray-800 font-bold bg-gradient-to-r from-yellow-600 via-green-600 to-yellow-600 bg-clip-text text-transparent"
                >
                  ✨ 특이한 동물들의 특별한 이야기 ✨
                </motion.p>
              </motion.div>
            </section>

            {/* Gallery 섹션 - 귀여워진 버전 🎨 */}
            <section id="gallery" className="py-20 px-6 bg-gradient-to-b from-white via-yellow-50/30 to-white relative overflow-hidden">
              {/* 귀여운 배경 패턴 */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 text-6xl">🌈</div>
                <div className="absolute top-20 right-20 text-6xl">🎵</div>
                <div className="absolute bottom-20 left-20 text-6xl">🎨</div>
                <div className="absolute bottom-10 right-10 text-6xl">💕</div>
              </div>

              <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                  className="text-center mb-12"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                  viewport={{ once: true }}
                >
                  <motion.h2 
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 inline-block"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="inline-block">🎵</span>
                    <span className="mx-3 bg-gradient-to-r from-yellow-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                      캐릭터 갤러리
                    </span>
                    <span className="inline-block">🎨</span>
                  </motion.h2>
                  <motion.p 
                    className="text-lg text-gray-700 font-medium bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 inline-block shadow-sm border-2 border-yellow-200"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                    viewport={{ once: true }}
                  >
                    ✨ 캐릭터를 클릭하여 음성을 들어보세요 ✨
                  </motion.p>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {books.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      viewport={{ once: true }}
                    >
                      <BookCard
                        book={book}
                        onPlay={playBook}
                        onShowPopup={() => {}}
                        isCurrentlyPlaying={currentBook?.id === book.id && isPlaying}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* 오디오 플레이어 - 화면 중앙 정사각형 모달 🎧 */}
            <AnimatePresence>
              {currentBook && (
                <>
                  {/* 배경 오버레이 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={() => playBook(currentBook)}
                  />

                  {/* 정사각형 플레이어 모달 */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-6"
                  >
                    <motion.div
                      className="bg-white rounded-[3rem] shadow-2xl border-4 border-yellow-300 w-full max-w-[600px] aspect-square overflow-hidden relative"
                      animate={{
                        boxShadow: isPlaying
                          ? ["0 25px 80px rgba(251, 191, 36, 0.4)", "0 30px 100px rgba(251, 191, 36, 0.6)", "0 25px 80px rgba(251, 191, 36, 0.4)"]
                          : "0 25px 80px rgba(0, 0, 0, 0.3)"
                      }}
                      transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                    >
                      {/* 헤더 */}
                      <div className="bg-gradient-to-r from-yellow-300 via-green-300 to-yellow-300 px-8 py-6 flex justify-between items-center relative overflow-hidden">
                        {/* 귀여운 배경 애니메이션 */}
                        {isPlaying && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        <div className="flex items-center gap-4 relative z-10">
                          <span className="text-4xl">
                            🎵
                          </span>
                          <span className="font-bold text-gray-800 text-2xl">✨ Now Playing ✨</span>
                        </div>
                        {isPlaying && (
                          <div className="flex items-center gap-2 relative z-10">
                            <motion.span
                              className="inline-block w-4 h-4 rounded-full bg-white shadow-lg"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.span
                              className="inline-block w-4 h-4 rounded-full bg-white shadow-lg"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                            />
                            <motion.span
                              className="inline-block w-4 h-4 rounded-full bg-white shadow-lg"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                            />
                          </div>
                        )}
                      </div>

                      {/* 메인 콘텐츠 */}
                      <div className="p-8 bg-gradient-to-b from-white to-yellow-50 h-[calc(100%-88px)] flex flex-col justify-center gap-6">
                        {/* 캐릭터 이미지 */}
                        <div className="flex items-center justify-center">
                          <motion.div
                            className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-2xl border-3 border-yellow-200"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Image
                              src={currentBook.coverImage}
                              alt={currentBook.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </motion.div>
                        </div>

                        {/* 재생 컨트롤 */}
                        <div className="space-y-4">
                          <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {currentBook.title}
                            </h3>
                            <p className="text-base text-gray-600 font-medium">
                              {currentBook.author}
                            </p>
                          </div>

                          {/* 재생 버튼 & 시간 */}
                          <div className="flex items-center justify-between px-2">
                            <motion.button
                              onClick={() => playBook(currentBook)}
                              className="group"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <motion.div
                                className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-300 to-green-400 flex items-center justify-center shadow-xl relative overflow-hidden"
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <motion.span
                                  className="text-3xl text-white relative z-10"
                                  animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
                                  transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
                                >
                                  {isPlaying ? '⏸' : '▶️'}
                                </motion.span>
                              </motion.div>
                            </motion.button>

                            <div className="text-right bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-yellow-200 shadow-lg">
                              <div className="text-xl text-gray-700 font-bold font-mono">
                                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
                              </div>
                              <div className="text-xs text-gray-500 font-medium">
                                / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                              </div>
                            </div>
                          </div>

                          {/* 프로그레스 바 */}
                          <div
                            className="relative h-3 bg-gradient-to-r from-yellow-100 to-green-100 rounded-full overflow-hidden cursor-pointer hover:h-4 transition-all shadow-inner border-2 border-yellow-200"
                            onClick={(e) => {
                              if (duration > 0) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickX = e.clientX - rect.left;
                                const percentage = clickX / rect.width;
                                const newTime = percentage * duration;
                                seekTo(newTime);
                              }
                            }}
                          >
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 rounded-full shadow-lg"
                              initial={{ width: 0 }}
                              animate={{
                                width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'
                              }}
                              transition={{ duration: 0.2 }}
                            />
                            {/* 귀여운 진행 표시 점 */}
                            {duration > 0 && (
                              <motion.div
                                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-xl border-2 border-yellow-400"
                                style={{ left: `${(currentTime / duration) * 100}%` }}
                                animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.6, repeat: isPlaying ? Infinity : 0 }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
