import MovieShow from '@/components/movies/MovieShow';
import Recommendations from '@/components/movies/Recommendations';
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

export default function MoviePage({ params }: PageProps) {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="flex-grow md:basis-11/12">
        <MovieShow id={params.id} />
      </div>

      <div className="md:basis-1/12">
        <RecommendationsContainer id={params.id} />
      </div>
    </main>
  );
}

function RecommendationsContainer({ id }: { id: string }) {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-48 p-5 flex-none space-y-5 md:block">
      <Recommendations id={id} />
    </div>
  );
}
