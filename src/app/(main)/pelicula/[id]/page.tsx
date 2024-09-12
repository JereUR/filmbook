import MovieShow from '@/components/movies/MovieShow';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string },
  searchParams: { title?: string, date?: string }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const title = searchParams.title || 'Sin título';
  const date = searchParams.date || '';
  
  if (!title) {
    return notFound();
  }

  return {
    title: `${title} (${date})`,
  };
}

export default function MoviePage({ params }: { params: { id: string } }) {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <MovieShow id={params.id}/>
    </main>
  );
}
