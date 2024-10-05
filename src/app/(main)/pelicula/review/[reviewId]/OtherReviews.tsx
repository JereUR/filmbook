'use client'

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import kyInstance from "@/lib/ky";
import { ReviewResumeInfoPage } from "@/lib/types";

interface OtherReviewsProps {
  movieId: string
  reviewId: string
}
export default function OtherReviews({ movieId, reviewId }: OtherReviewsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["other-reviews", movieId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/movie/review/others/${movieId}/${reviewId}`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<ReviewResumeInfoPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const reviews = data?.pages.flatMap((page) => page.reviews) || [];

  if (status === "pending") {
    return <Loader2 className="animate-spin mx-auto" />;
  }

  if (status === "success" && !reviews.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        Todavía nadie a posteado nada.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Ocurrió un error al cargar las publicaciones
      </p>
    );
  }

  return <div className='p-2 md:p-5 bg-card rounded-2xl'><div className="text-xl font-bold">Otras reviews</div>{reviews.map(review=>review.user?.username)}</div>
}