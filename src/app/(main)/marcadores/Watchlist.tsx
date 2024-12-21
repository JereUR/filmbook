"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import kyInstance from "@/lib/ky"
import { WatchlistPage } from "@/lib/types"
import WatchlistItem from "./WatchlistItem"
import WatchlistsLoadingSkeleton from "@/components/skeletons/WatchlistLoadingSkeleton"

interface WatchlistProps {
  userId: string
}

export default function Watchlist({ userId }: WatchlistProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["watchlist", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/movie/watchlist/user/${userId}`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<WatchlistPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const watchlist = data?.pages.flatMap((page) => page.watchlist) || []

  if (status === "pending") {
    return <WatchlistsLoadingSkeleton />
  }

  if (status === "success" && !watchlist.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        Todavía no tienes ninguna pelicula en tu watchlist.
      </p>
    )
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Ocurrió un error al cargar la watchlist.
      </p>
    )
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="flex flex-col items-start gap-2 w-full rounded-2xl bg-card p-5 shadow-sm">
        {watchlist.map((item) => (
          <WatchlistItem key={item.id} item={item} />
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  )
}
