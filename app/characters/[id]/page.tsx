import { fetchBooks } from '@/lib/supabase';
import { Header } from '@/components/Header';
import CharacterDetailClient from './CharacterDetailClient';
import { notFound } from 'next/navigation';

// 동적 렌더링: 매 요청마다 최신 데이터 가져오기 (배포 후 즉시 반영)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const books = await fetchBooks();
  const character = books.find(b => b.id === parseInt(resolvedParams.id));

  if (!character) {
    notFound();
  }

  return (
    <>
      <Header />
      <CharacterDetailClient character={character} />
    </>
  );
}

export async function generateStaticParams() {
  const books = await fetchBooks();

  return books.map((book) => ({
    id: book.id.toString(),
  }));
}
