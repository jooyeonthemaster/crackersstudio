'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Book, AudioPlayer } from '@/types';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 부드러운 프로그레스 바 업데이트
  const updateProgress = useCallback(() => {
    if (audioRef.current && isPlaying) {
      setCurrentTime(audioRef.current.currentTime);
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, [isPlaying]);

  // 재생/일시정지 시 애니메이션 프레임 관리
  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateProgress]);

  const playBook = useCallback((book: Book) => {
    if (currentBook?.id === book.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.warn('Audio play failed:', error);
          setIsPlaying(true);
          setTimeout(() => setIsPlaying(false), 3000);
        });
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setCurrentBook(book);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    try {
      if (audioRef.current) {
        // audioFile이 없거나 빈 문자열이면 재생하지 않음
        if (!book.audioFile || book.audioFile.trim() === '') {
          alert('이 카드에는 음성 파일이 없습니다.');
          return;
        }
        
        setIsLoading(true);
        audioRef.current.src = book.audioFile;
        audioRef.current.volume = volume;
        audioRef.current.load();

        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          console.log('Successfully playing:', book.title, book.audioFile);
        }).catch((error) => {
          console.warn('Audio file failed to play:', error);
          setIsLoading(false);
          setIsPlaying(true);
          setTimeout(() => setIsPlaying(false), 5000);
        });
      }
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
      setIsLoading(false);
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 5000);
    }
  }, [currentBook, isPlaying, volume]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const setVolumeLevel = useCallback((level: number) => {
    setVolume(level);
    if (audioRef.current) {
      audioRef.current.volume = level;
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
      setCurrentTime(audioRef.current.currentTime);
    }
  }, [duration]);

  if (typeof window !== 'undefined' && !audioRef.current) {
    audioRef.current = new Audio();

    audioRef.current.addEventListener('loadstart', () => {
      setIsLoading(true);
    });

    audioRef.current.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.current?.duration || 0);
      setIsLoading(false);
    });

    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      console.log('Audio playback ended');
    });

    audioRef.current.addEventListener('error', (e) => {
      console.warn('Audio error:', e);
      setIsPlaying(false);
      setIsLoading(false);
    });

    audioRef.current.addEventListener('canplay', () => {
      console.log('Audio can start playing');
    });
  }

  return {
    currentBook,
    isPlaying,
    volume,
    currentTime,
    duration,
    playBook,
    stopAudio,
    setVolume: setVolumeLevel,
    seekTo,
  };
}
