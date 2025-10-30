import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 파일 업로드 함수
export async function uploadFile(
  file: File,
  bucket: 'images' | 'audio',
  path?: string
): Promise<{ url: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { url: '', error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { url: '', error: String(error) };
  }
}

// 이미지 업로드
export async function uploadImage(file: File): Promise<{ url: string; error?: string }> {
  return uploadFile(file, 'images');
}

// 오디오 업로드
export async function uploadAudio(file: File): Promise<{ url: string; error?: string }> {
  return uploadFile(file, 'audio');
}

// ============================================
// Books CRUD 함수
// ============================================

// 모든 books 가져오기
export async function fetchBooks() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  if (!data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((book: any) => ({
    id: book.id,
    title: book.title,
    author: book.author || '',
    coverImage: book.cover_image || '',
    audioFile: book.audio_file || '',
    description: book.description || '',
    content: book.content || '',
    genre: book.genre || 'Character',
    publishedYear: book.published_year || 2024,
  }));
}

// Book 추가
export async function createBook(book: {
  title: string;
  author: string;
  coverImage: string;
  audioFile: string;
  description?: string;
  content?: string;
  genre?: string;
  publishedYear?: number;
}): Promise<{ success: boolean; data?: Database['public']['Tables']['books']['Row']; error?: string }> {
  const { data, error } = await supabase
    .from('books')
    .insert([{
      title: book.title,
      author: book.author,
      cover_image: book.coverImage,
      audio_file: book.audioFile,
      description: book.description,
      content: book.content,
      genre: book.genre || 'Character',
      published_year: book.publishedYear || 2024,
      display_order: 0, // 기본값, 나중에 재정렬
    } as never])
    .select()
    .single();

  if (error) {
    console.error('Error creating book:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// Book 수정
export async function updateBook(id: number, updates: {
  title?: string;
  author?: string;
  coverImage?: string;
  audioFile?: string;
  description?: string;
  content?: string;
  genre?: string;
  publishedYear?: number;
  display_order?: number;
}) {
  const dbUpdates: Record<string, string | number | null | undefined> = {};
  if (updates.title) dbUpdates.title = updates.title;
  if (updates.author) dbUpdates.author = updates.author;
  if (updates.coverImage) dbUpdates.cover_image = updates.coverImage;
  if (updates.audioFile) dbUpdates.audio_file = updates.audioFile;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.content !== undefined) dbUpdates.content = updates.content;
  if (updates.genre) dbUpdates.genre = updates.genre;
  if (updates.publishedYear) dbUpdates.published_year = updates.publishedYear;
  if (updates.display_order !== undefined) dbUpdates.display_order = updates.display_order;

  const { error } = await supabase
    .from('books')
    .update(dbUpdates as never)
    .eq('id', id);

  if (error) {
    console.error('Error updating book:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Book 삭제
export async function deleteBook(id: number) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting book:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Books 순서 재정렬
export async function reorderBooks(books: Array<{ id: number; displayOrder: number }>) {
  const updates = books.map((book, index) => 
    supabase
      .from('books')
      .update({ display_order: index + 1 } as never)
      .eq('id', book.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter(r => r.error);

  if (errors.length > 0) {
    console.error('Error reordering books:', errors);
    return { success: false };
  }

  return { success: true };
}
