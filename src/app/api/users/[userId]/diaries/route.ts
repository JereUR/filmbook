import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { DiaryInfo } from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  /* const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  } */

  const cursor = req.nextUrl.searchParams.get("cursor") || undefined
  const pageSize = 20

  const diaries = await prisma.diary.findMany({
    where: {
      userId: params.userId,
    },
    select: {
      id: true,
      movieId: true,
      userId: true,
      reviewId: true,
      movie: {
        select: {
          id: true,
          posterPath: true,
          title: true,
          releaseDate: true,
        },
      },
      review: {
        select: {
          liked: true,
          rating: true,
          review: true,
        },
      },
      user: {
        select: {
          username: true,
        },
      },
      watchedOn: true,
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
  })

  const nextCursor = diaries.length > pageSize ? diaries[pageSize].id : null

  const data: DiaryInfo[] = diaries.slice(0, pageSize).map((diary) => ({
    id: diary.id,
    userId: params.userId,
    movieId: diary.movieId,
    movie: diary.movie,
    reviewId: diary.reviewId,
    review: {
      liked: diary.review?.liked ?? false,
      reviewText: diary.review?.review ?? null,
      rating: diary.review?.rating ?? null,
    },
    user: diary.user,
    watchedOn: diary.watchedOn,
  }))

  return NextResponse.json({ diaries: data, nextCursor })
}
