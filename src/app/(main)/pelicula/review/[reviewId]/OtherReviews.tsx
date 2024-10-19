'use client'

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import kyInstance from "@/lib/ky";
import { ReviewResumeInfoPage } from "@/lib/types";
import Link from "next/link";
import { dateFormat } from "@/lib/utils";
import CircularImage from "@/components/movies/CircularImage";
import { useEffect } from "react";

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
    refetch,
    isRefetching
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

  useEffect(() => {
    refetch();
  }, [reviewId, refetch]);

  const reviews = data?.pages.flatMap((page) => page.reviews) || [];

  return (
    <div className='flex flex-col gap-2 p-5 bg-card rounded-2xl'>
      <div className="text-xl font-bold">Otras reviews</div>
      {status === "pending" || isFetching || isRefetching ? (
        <Loader2 className="animate-spin mx-auto" />
      ) : status === "success" && !reviews.length && !hasNextPage ? (
        <p className="text-xs md:text-sm italic text-center text-foreground/40">
          Nadie ha realizado una review de esta película aún...
        </p>
      ) : status === "error" ? (
        <p className="text-xs md:text-sm italic text-center text-destructive">
          Ocurrió un error al cargar las reviews.
        </p>
      ) : (
        reviews.map(review => (
          <Link
            key={review.id}
            href={`/pelicula/review/${review.id}?title=${review.movie?.title}&date=${review.movie?.releaseDate}&username=${review.user?.username}&movieId=${review.movieId}`}
            className='p-2 md:p-4 bg-card-child rounded-2xl transition duration-300 ease-in-out hover:bg-card-child/70'
          >
            <div className="flex gap-2 md:gap-4 items-center">
              <CircularImage
                src={review.user?.avatarUrl}
                alt={`${review.user?.username} photo`}
                className="relative"
                transform={false}
              />
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-medium">{review.user?.username}</span>
                <span className="text-xs md:text-sm font-light text-foreground/40">
                  {dateFormat(review.createdAt.toISOString())}
                </span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
