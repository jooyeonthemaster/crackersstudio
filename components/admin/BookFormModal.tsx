'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book } from '@/types';
import Image from 'next/image';
import { uploadImage, uploadAudio } from '@/lib/supabase';
import CharacterEditor from '@/components/editor/CharacterEditor';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id'> | Book) => void;
  editBook?: Book | null;
}

export function BookFormModal({ isOpen, onClose, onSave, editBook }: BookFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: '',
    audioFile: '',
    description: '',
    content: '',
    genre: 'Character',
    publishedYear: new Date().getFullYear(),
  });

  const [imagePreview, setImagePreview] = useState('');
  const [audioPreview, setAudioPreview] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    if (editBook) {
      setFormData({
        title: editBook.title,
        author: editBook.author,
        coverImage: editBook.coverImage,
        audioFile: editBook.audioFile,
        description: editBook.description || '',
        content: editBook.content || '',
        genre: editBook.genre || 'Character',
        publishedYear: editBook.publishedYear || new Date().getFullYear(),
      });
      setImagePreview(editBook.coverImage);
      setAudioPreview(editBook.audioFile);
      setAudioFileName(editBook.audioFile.split('/').pop() || '');
    } else {
      // 초기화
      setFormData({
        title: '',
        author: '',
        coverImage: '',
        audioFile: '',
        description: '',
        content: '',
        genre: 'Character',
        publishedYear: new Date().getFullYear(),
      });
      setImagePreview('');
      setAudioPreview('');
      setAudioFileName('');
    }
  }, [editBook, isOpen]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 실제 업로드
      setIsUploading(true);
      setUploadStatus('이미지 업로드 중...');
      
      const { url, error } = await uploadImage(file);
      
      setIsUploading(false);
      
      if (error) {
        setUploadStatus(`업로드 실패: ${error}`);
        alert(`이미지 업로드 실패: ${error}`);
      } else {
        setUploadStatus('이미지 업로드 완료!');
        setFormData(prev => ({ ...prev, coverImage: url }));
        setTimeout(() => setUploadStatus(''), 2000);
      }
    }
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      
      // 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 실제 업로드
      setIsUploading(true);
      setUploadStatus('음성 파일 업로드 중...');
      
      const { url, error } = await uploadAudio(file);
      
      setIsUploading(false);
      
      if (error) {
        setUploadStatus(`업로드 실패: ${error}`);
        alert(`음성 파일 업로드 실패: ${error}`);
      } else {
        setUploadStatus('음성 파일 업로드 완료!');
        setFormData(prev => ({ ...prev, audioFile: url }));
        setTimeout(() => setUploadStatus(''), 2000);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editBook) {
      onSave({ ...editBook, ...formData });
    } else {
      onSave(formData);
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col border-4 border-yellow-300 overflow-hidden">
              {/* 헤더 (고정) */}
              <div className="bg-gradient-to-r from-yellow-300 via-green-300 to-yellow-300 px-8 py-6 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {editBook ? '✏️ 카드 수정' : '➕ 새 카드 추가'}
                    </h2>
                    {uploadStatus && (
                      <p className="text-sm mt-1 font-medium text-gray-700">
                        {isUploading ? '⏳' : '✅'} {uploadStatus}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                    disabled={isUploading}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* 폼 (스크롤 가능) */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* 이미지 업로드 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🖼️ 캐릭터 이미지
                  </label>
                  <div className="flex gap-4 items-start">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploading}
                      className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {imagePreview && (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-yellow-300 shadow-lg">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    또는 이미지 URL을 아래에 직접 입력하세요
                  </p>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, coverImage: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.png"
                    className="mt-2 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* 제목 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📝 캐릭터 이름 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="예: 토끼 크랙이"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* 작가 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    👤 작가/시리즈 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="예: Little Crack"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* 음성 파일 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🎵 음성 파일 *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="audio/mpeg,audio/mp3,audio/mp4,video/mp4,.mp3,.mp4"
                      onChange={handleAudioChange}
                      disabled={isUploading}
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {audioPreview && (
                      <div className="bg-gray-50 rounded-xl p-4 border-2 border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">🎧</span>
                          <span className="text-sm font-medium text-gray-700 truncate flex-1">
                            {audioFileName || '음성 파일'}
                          </span>
                        </div>
                        <audio
                          controls
                          src={audioPreview}
                          className="w-full"
                          style={{ height: '40px' }}
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      또는 음성 파일 URL을 아래에 직접 입력하세요
                    </p>
                    <input
                      type="text"
                      value={formData.audioFile}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, audioFile: e.target.value }));
                        setAudioPreview(e.target.value);
                        setAudioFileName(e.target.value.split('/').pop() || '');
                      }}
                      placeholder="/audio/character.mp3"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 설명 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📖 설명 (선택)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="캐릭터 설명을 입력하세요"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* 블로그 스토리 에디터 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📝 캐릭터 스토리 (블로그 형태)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    이미지, 링크, 테이블 등을 자유롭게 추가하여 풍부한 스토리를 작성하세요!
                  </p>
                  <CharacterEditor
                    content={formData.content}
                    onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                    placeholder="캐릭터의 배경 스토리, 특징, 에피소드 등을 자유롭게 작성하세요..."
                  />
                </div>

                {/* 버튼 */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isUploading}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-white font-bold rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? '업로드 중...' : editBook ? '수정 완료' : '추가하기'} ✨
                  </button>
                </div>
              </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

