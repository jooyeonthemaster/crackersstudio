'use client';

import { Book } from '@/types';
import { BookCard } from './BookCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Header } from './Header';

interface BookGridProps {
  books: Book[];
}

export function BookGrid({ books }: BookGridProps) {
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
                  className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-800 font-bold bg-gradient-to-r from-yellow-600 via-green-600 to-yellow-600 bg-clip-text text-transparent"
                >
                  특이한 동물들의 특별한 이야기
                </motion.p>
              </motion.div>
            </section>

            {/* Gallery 섹션 - 귀여워진 버전 🎨 */}
            <section id="gallery" className="py-20 px-6 bg-gradient-to-b from-white via-yellow-50/30 to-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                  className="text-center mb-12"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                  viewport={{ once: true }}
                >
                  <motion.h2
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="bg-gradient-to-r from-yellow-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                      굿즈 갤러리
                    </span>
                  </motion.h2>
                  <motion.p
                    className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 font-medium bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 shadow-sm border-2 border-yellow-200 mx-auto w-fit"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                    viewport={{ once: true }}
                  >
                    각 굿즈를 클릭하여 상세 정보를 확인하세요
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
                        isCurrentlyPlaying={false}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
