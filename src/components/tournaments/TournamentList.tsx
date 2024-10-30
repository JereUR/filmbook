"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import kyInstance from "@/lib/ky"
import { TournamentsPage } from "@/lib/types"
import WatchlistsLoadingSkeleton from "@/app/(main)/marcadores/WatchlistLoadingSkeleton"
import TournamentItem from "./TournamentItem"

interface TournamentListProps {
  admin: boolean
}

export default function TournamentList({ admin }: TournamentListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["tournaments"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/tournament`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<TournamentsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const tournaments = data?.pages.flatMap((page) => page.tournaments) || []

  if (status === "pending") {
    return <WatchlistsLoadingSkeleton />
  }

  if (status === "success" && !tournaments.length && !hasNextPage) {
    return (
      <p className="text-center text-foreground/40">
        Aún no hay torneos disponibles.
      </p>
    )
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Ocurrió un error al cargar los torneos
      </p>
    )
  }


  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className='flex justify-start gap-2 w-full rounded-2xl bg-card p-5 shadow-sm'>
        {tournaments.map((tournament) => (
          <TournamentItem key={tournament.id} tournament={tournament} admin={admin} />
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  )
}
