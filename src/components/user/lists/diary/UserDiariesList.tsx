"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import kyInstance from "@/lib/ky";
import { DiariesPage } from "@/lib/types";
import ReviewsLoadingSkeleton from "../review/ReviewsLoadingSkeleton";

interface UserDiariesListProps {
  userId: string;
}

export default function UserDiariesList({ userId }: UserDiariesListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["diaries", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/diaries`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<DiariesPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const diaries = data?.pages.flatMap((page) => page.diaries) || [];

  if (status === "pending") {
    return <ReviewsLoadingSkeleton />;
  }

  if (status === "success" && !diaries.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        Este usuario todavía no cuenta con entradas en su bitácora.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Ocurrió un error al cargar la bitácora
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className='flex justify-start gap-2 w-full rounded-2xl bg-card p-5 shadow-sm'>
        {diaries.map((diary) => (
          <p key={diary.id}>{ diary.movie.title }</p>
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
