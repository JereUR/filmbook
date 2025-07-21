"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import kyInstance from "@/lib/ky"
import { TournamentsPage } from "@/lib/types"
import TournamentItem from "./TournamentItem"
import TournamentsLoadingSkeleton from "../skeletons/TournamentsLoadingSkeleton"

interface TournamentListProps {
  admin: boolean
}

export default function TournamentsList({ admin }: TournamentListProps) {
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
          `/api/tournaments`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<TournamentsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const tournaments = data?.pages.flatMap((page) => page.tournaments) || []

  if (status === "pending") {
    return <TournamentsLoadingSkeleton />
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
    <div className="flex flex-col gap-4 md:gap-8 px-5 pb-5">
      <InfiniteScrollContainer
        className="space-y-5"
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {tournaments.map((tournament) => {
            return(
            <TournamentItem key={tournament.id} tournament={tournament} admin={admin} />
          )})}
        </div>
        {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
      </InfiniteScrollContainer>
    </div>
  )
}
