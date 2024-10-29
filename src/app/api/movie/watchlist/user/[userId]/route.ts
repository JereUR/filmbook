import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { WatchlistData } from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const cursor = req.nextUrl.searchParams.get("cursor") || undefined
  const pageSize = 10

  const watchlist = await prisma.watchlist.findMany({
    where: {
      userId: params.userId,
    },
    select: {
      id: true,
      movieId: true,
      movie: {
        select: {
          id: true,
          overview: true,
          genres: true,
          runtime: true,
          directors: true,
          posterPath: true,
          title: true,
          releaseDate: true,
          voteAverage: true,
          providers: true,
        },
      },
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
  })

  const nextCursor = watchlist.length > pageSize ? watchlist[pageSize].id : null

  const movieIds = watchlist.map((item) => item.movieId)

  const movieRatings = await prisma.movieRating.findMany({
    where: {
      movieId: { in: movieIds },
    },
    select: {
      movieId: true,
      averageRating: true,
    },
  })

  const ratingsMap = movieRatings.reduce(
    (map, rating) => {
      map[rating.movieId] = rating.averageRating
      return map
    },
    {} as Record<string, number>,
  )

  const data: WatchlistData[] = watchlist.slice(0, pageSize).map((item) => ({
    id: item.id,
    movieId: item.movieId,
    movie: item.movie,
    voteApp: ratingsMap[item.movieId] || null,
  }))

  return NextResponse.json({ watchlist: data, nextCursor })
}
