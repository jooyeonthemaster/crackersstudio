'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  onCancel?: () => void;
  maxSize?: number; // MB
  accept?: string;
}

export default function ImageUploader({
  onImageUpload,
  onCancel,
  maxSize = 5,
  accept = 'image/jpeg,image/png,image/jpg,image/webp'
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToSupabase = async (file: File): Promise<string> => {
    const supabase = createClient();

    // 🔑 파일명 생성: 타임스탬프 + 랜덤문자열 + 확장자
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `characters/${fileName}`;

    // 📊 업로드 진행률 시뮬레이션 (Supabase Storage는 네이티브 progress 미지원)
    setProgress(30);

    // 🚀 Supabase Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    setProgress(70);

    // ✅ Public URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    setProgress(100);

    return publicUrl;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // 1️⃣ 파일 크기 검증
    if (file.size > maxSize * 1024 * 1024) {
      setError(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
      return;
    }

    // 2️⃣ 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 3️⃣ 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 4️⃣ 업로드 시작
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const url = await uploadToSupabase(file);
      onImageUpload(url);
      setPreview(null);
      setProgress(0);
    } catch (err: unknown) {
      console.error('Image upload error:', err);
      const errorMessage = err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onCancel?.();
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-xl p-6 border-2 border-dashed border-yellow-300 hover:border-yellow-400 transition-all">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload-input"
      />

      {!preview ? (
        <label
          htmlFor="image-upload-input"
          className="flex flex-col items-center justify-center cursor-pointer py-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-green-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <ImageIcon className="w-10 h-10 text-white" />
          </div>
          <p className="text-base font-bold text-gray-900 mb-1">
            이미지를 업로드하세요
          </p>
          <p className="text-sm text-gray-600 mb-4">
            JPG, PNG, WEBP 파일 (최대 {maxSize}MB)
          </p>
          <div className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-green-400 text-white rounded-full hover:from-yellow-500 hover:to-green-500 transition-all font-bold shadow-lg hover:shadow-xl">
            <Upload className="w-4 h-4 inline mr-2" />
            파일 선택
          </div>
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-96 object-contain bg-white"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white font-bold text-xl">{progress}%</p>
                  <p className="text-white/80 text-sm mt-2">업로드 중...</p>
                </div>
              </div>
            )}
          </div>

          {!uploading && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                <X className="w-4 h-4 inline mr-2" />
                취소
              </button>
              <label
                htmlFor="image-upload-input"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-green-400 text-white rounded-xl hover:from-yellow-500 hover:to-green-500 transition-all font-bold text-center cursor-pointer shadow-lg"
              >
                다른 이미지 선택
              </label>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <p className="text-sm text-red-600 font-semibold">⚠️ {error}</p>
        </div>
      )}
    </div>
  );
}
