export interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  audioFile?: string;
  description?: string;
  content?: string;
  genre?: string;
  publishedYear?: number;
  isPlaying?: boolean;
  showCopyrightPopup?: boolean;
  isPictureBook?: boolean;
}

export interface AudioPlayer {
  currentBook: Book | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
}

export interface GridLayout {
  columns: number;
  gap: number;
  aspectRatio: string;
}
