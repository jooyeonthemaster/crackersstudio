'use client';

import { Book } from '@/types';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CharacterDetailClientProps {
  character: Book;
}

export default function CharacterDetailClient({ character }: CharacterDetailClientProps) {
  const { playBook, isPlaying, currentTime, duration, seekTo, currentBook } = useAudioPlayer();

  const isCurrentPlaying = currentBook?.id === character.id && isPlaying;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 pt-24">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 뒤로 가기 버튼 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-yellow-300 rounded-full hover:bg-yellow-50 transition-all shadow-md hover:shadow-lg group"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700 group-hover:text-yellow-600 transition-colors" />
            <span className="font-bold text-gray-800 text-sm">갤러리로 돌아가기</span>
          </Link>
        </motion.div>
        {/* 캐릭터 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* 캐릭터 이미지 + 기본 정보 */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            {/* 이미지 */}
            <motion.div
              className="relative w-full md:w-80 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={character.coverImage}
                alt={character.title}
                fill
                className="object-cover"
                priority
              />
              {/* 재생 중 오버레이 */}
              {isCurrentPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-6xl"
                  >
                    🎵
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            {/* 정보 */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                {character.title}
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl text-gray-600 font-medium">
                  {character.author}
                </span>
                {character.genre && (
                  <span className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-full text-sm font-bold">
                    {character.genre}
                  </span>
                )}
              </div>

              {character.description && (
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {character.description}
                </p>
              )}
            </div>
          </div>

          {/* 오디오 플레이어 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border-3 border-yellow-300 shadow-xl"
            role="region"
            aria-label="오디오 플레이어"
          >
            <div className="flex items-center gap-6">
              {/* 재생 버튼 */}
              <motion.button
                onClick={() => playBook(character)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
                aria-label={isCurrentPlaying ? `${character.title} 일시정지` : `${character.title} 재생`}
                aria-pressed={isCurrentPlaying}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-300 to-green-400 flex items-center justify-center shadow-xl">
                  <motion.span
                    className="text-3xl text-white"
                    animate={{ scale: isCurrentPlaying ? [1, 1.15, 1] : 1 }}
                    transition={{ duration: 0.5, repeat: isCurrentPlaying ? Infinity : 0 }}
                    aria-hidden="true"
                  >
                    {isCurrentPlaying ? '⏸' : '▶️'}
                  </motion.span>
                </div>
              </motion.button>

              {/* 프로그레스 바 + 시간 */}
              <div className="flex-1">
                <div
                  className="relative h-3 bg-gradient-to-r from-yellow-100 to-green-100 rounded-full overflow-hidden cursor-pointer hover:h-4 transition-all shadow-inner mb-2"
                  role="progressbar"
                  aria-label="재생 진행률"
                  aria-valuemin={0}
                  aria-valuemax={duration}
                  aria-valuenow={currentTime}
                  aria-valuetext={`${Math.floor(currentTime / 60)}분 ${Math.floor(currentTime % 60)}초 / ${Math.floor(duration / 60)}분 ${Math.floor(duration % 60)}초`}
                  onClick={(e) => {
                    if (duration > 0) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const percentage = clickX / rect.width;
                      const newTime = percentage * duration;
                      seekTo(newTime);
                    }
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                      seekTo(Math.min(currentTime + 5, duration));
                    } else if (e.key === 'ArrowLeft') {
                      seekTo(Math.max(currentTime - 5, 0));
                    }
                  }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 rounded-full"
                    animate={{
                      width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-mono text-gray-600 font-medium">
                    {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-gray-500">
                    {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 스토리 콘텐츠 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {character.content ? (
            <article className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-yellow-200">
              <div
                className="prose prose-lg prose-yellow max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-7
                  prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-6
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-yellow-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-ul:my-6 prose-ol:my-6
                  prose-li:text-gray-700 prose-li:my-2
                  prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
                "
                dangerouslySetInnerHTML={{ __html: character.content }}
              />
            </article>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border-2 border-yellow-200">
              <div className="text-7xl mb-6">📝</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">스토리가 아직 작성되지 않았습니다</h2>
              <p className="text-gray-600">
                관리자 페이지에서 캐릭터의 이야기를 작성해주세요!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
