"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import kyInstance from "@/lib/ky"
import { ReviewsPage } from "@/lib/types"
import ReviewItem from "./ReviewItem"
import ReviewsLoadingSkeleton from './ReviewsLoadingSkeleton'

interface UserReviewsListProps {
  userId: string
}

export default function UserReviewsList({ userId }: UserReviewsListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["reviews", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/reviews`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<ReviewsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const reviews = data?.pages.flatMap((page) => page.reviews) || []

  if (status === "pending") {
    return <ReviewsLoadingSkeleton />
  }

  if (status === "success" && !reviews.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        Este usuario todavía no cuenta con reviews.
      </p>
    )
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Ocurrió un error al cargar las reviews
      </p>
    )
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-2 rounded-2xl bg-card p-5 shadow-sm'>
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  )
}
