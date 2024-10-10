import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Loader2, TriangleAlert } from "lucide-react";
import { Suspense } from 'react';

import MovieShow from '@/components/movies/MovieShow';
import Recommendations from '@/components/movies/Recommendations';

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

export default function MoviePage({ params }: PageProps) {
  return (
    <main className="flex flex-col md:flex-row w-full min-w-0 gap-5">
      <div className="flex-grow md:w-3/4">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <MovieShow id={params.id} />
        </Suspense>
      </div>
      <div className="md:w-1/4">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <RecommendationsContainer id={params.id} />
        </Suspense>
      </div>
    </main>
  );
}

function RecommendationsContainer({ id }: { id: string }) {
  return (
    <div className="h-fit w-full px-2 flex-none space-y-5 md:block">
      <Recommendations id={id} />
    </div>
  );
}