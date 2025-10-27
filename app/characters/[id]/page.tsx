import { fetchBooks } from '@/lib/supabase';
import { Header } from '@/components/Header';
import CharacterDetailClient from './CharacterDetailClient';
import { notFound } from 'next/navigation';

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
