import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Loader2} from "lucide-react";
import { Suspense } from 'react';

import UserReview from './UserReview'
import OtherReviews from './OtherReviews';

interface PageProps {
  params: { id: string },
  searchParams: { username?:string, title?: string, date?: string, movieId:string }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const title = searchParams.title || 'Sin título';
  const date = searchParams.date || '';
  const username = searchParams.username || '';
  
  if (!title) {
    return notFound();
  }

  return {
    title: `${username} | ${title} (${date})`,
  };
}

export default function ReviewPage({ params, searchParams }: PageProps) {
  const movieId = searchParams.movieId

  return (
    <main className="flex flex-col md:flex-row w-full min-w-0 gap-5">
      <div className="flex-grow md:w-3/4">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserReview id={params.id} />
      </Suspense>
      </div>
      <div className="md:w-1/4">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <OtherReviewsContainer movieId={movieId} />
        </Suspense>
      </div>
    </main>
  );
}

function OtherReviewsContainer({ movieId }: { movieId: string }) {
  return (
    <div className="h-fit w-full px-2 flex-none space-y-5 md:block">
      <OtherReviews movieId={movieId} />
    </div>
  );
}
