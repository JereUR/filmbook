'use client'

import { useInfiniteQuery } from "@tanstack/react-query"
import { Calendar, Loader2 } from "lucide-react"

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import kyInstance from "@/lib/ky"
import { DiariesPage, DiaryInfo } from "@/lib/types"
import DiaryItem from './DiaryItem'
import DiariesLoadingSkeleton from "@/components/skeletons/DiariesLoadingSkeleton"

interface UserDiariesListProps {
  userId: string
}

const groupDiariesByDate = (diaries: DiaryInfo[]) => {
  const groupedDiaries = diaries.reduce((acc: Record<string, DiaryInfo[]>, diary: DiaryInfo) => {
    const date = new Date(diary.watchedOn)
    const month = date.toLocaleString("es-ES", { month: "long" })

    if (!acc[month]) {
      acc[month] = []
    }

    acc[month].push(diary)

    return acc
  }, {})

  return groupedDiaries
}

export default function UserDiariesList({ userId }: UserDiariesListProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["diaries", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/diaries`,
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<DiariesPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const diaries = data?.pages.flatMap((page) => page.diaries) || []
  const groupedDiaries = groupDiariesByDate(diaries)

  if (status === "pending") {
    return <DiariesLoadingSkeleton />
  }

  if (status === "success" && !diaries.length && !hasNextPage) {
    return <p className="text-center text-muted-foreground">Este usuario todavía no cuenta con entradas en su bitácora.</p>
  }

  if (status === "error") {
    return <p className="text-center text-destructive">Ocurrió un error al cargar la bitácora</p>
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {Object.entries(groupedDiaries).map(([month, monthDiaries]) => (
        <div key={month} className='bg-card/50 p-2 md:p-4 my-2 md:my-4 rounded-2xl '>
          <h2 className="flex items-center gap-2 md:text-lg font-extrabold text-primary p-2 md:p-4 border border-primary/50 rounded-2xl mb-2 md:mb-4"><Calendar />{month.toUpperCase()}</h2>
          <div className="space-y-3 ml-2 md:ml-4">
            {monthDiaries.reduce((acc: JSX.Element[], diary, index) => {
              const date = new Date(diary.watchedOn)
              const day = date.getDate().toString()

              if (index === 0 || (index > 0 && new Date(monthDiaries[index - 1].watchedOn).getDate().toString() !== day)) {
                acc.push(
                  <div key={day}>
                    <h3 className="text-lg font-bold text-foreground/40 mb-3 italic">Día {day}</h3>
                    <hr className='w-[95%] text-foreground/40 h-[1px] mx-auto md:my-2' />
                  </div>
                )
              }
              acc.push(<DiaryItem key={diary.id} diary={diary} />)

              return acc
            }, [] as JSX.Element[])}
          </div>
        </div>
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin text-primary" />}
    </InfiniteScrollContainer>
  )
}
