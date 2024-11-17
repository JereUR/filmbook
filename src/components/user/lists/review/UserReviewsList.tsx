"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { ArrowDownWideNarrow, ChevronDown, ChevronUp, Filter, Loader2 } from "lucide-react"
import { useState } from "react"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import kyInstance from "@/lib/ky"
import { ReviewsPage } from "@/lib/types"
import ReviewItem from "./ReviewItem"
import ReviewsLoadingSkeleton from './ReviewsLoadingSkeleton'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserReviewsListProps {
  userId: string
  username: string
}

interface SortInput {
  attr: string,
  type: string
}

const defaultSort: SortInput = {
  attr: 'createdAt',
  type: 'desc'
}

export default function UserReviewsList({ userId, username }: UserReviewsListProps) {
  const [sortedBy, setSortedBy] = useState<SortInput>(defaultSort)
  const [selectedValue, setSelectedValue] = useState<string>("createdAtDesc")

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["reviews", userId, sortedBy],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/reviews`,
          {
            searchParams: {
              ...(pageParam ? { cursor: pageParam } : {}),
              sortAttr: sortedBy.attr,
              sortType: sortedBy.type,
            }
          },
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

  const changeSort = (value: string) => {
    setSelectedValue(value)
    switch (value) {
      case 'createdAtAsc':
        setSortedBy({ attr: 'createdAt', type: 'asc' })
        break;
      case 'createdAtDesc':
        setSortedBy({ attr: 'createdAt', type: 'desc' })
        break;
      case 'ratingDesc':
        setSortedBy({ attr: 'rating', type: 'desc' })
        break;
      case 'ratingAsc':
        setSortedBy({ attr: 'rating', type: 'asc' })
        break;
      case 'releaseDateDesc':
        setSortedBy({ attr: 'releaseDate', type: 'desc' })
        break;
      case 'releaseDateAsc':
        setSortedBy({ attr: 'releaseDate', type: 'asc' })
        break;
      default:
        break;
    }
  }

  return (
    <div className="relative rounded-2xl bg-card p-5 shadow-sm flex flex-col gap-2 md:gap-5">
      <Select value={selectedValue} onValueChange={changeSort}>
        <SelectTrigger className="w-fit absolute top-2 right-4 gap-2">
          <Filter className="h-3 w-3 md:h-5 md:w-5" /> <SelectValue placeholder="Ordenar por..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Ordenar por...</SelectLabel>
            <SelectItem value="createdAtDesc">De la más nueva</SelectItem>
            <SelectItem value='createdAtAsc'>De la más antigua</SelectItem>
            <SelectItem value="ratingDesc">Mayor puntaje</SelectItem>
            <SelectItem value="ratingAsc">Menor puntaje</SelectItem>
            <SelectItem value="releaseDateDesc">Película mas nueva</SelectItem>
            <SelectItem value="releaseDateAsc">Películas mas antigua</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <h1 className='mt-8 md:mt-0 md:-py-3 text-xl md:text-2xl text-primary italic font-semibold'>Reviews de {username}</h1>
      <InfiniteScrollContainer
        className="space-y-5"
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-2 '>
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
        {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
      </InfiniteScrollContainer>
    </div>
  )
}
