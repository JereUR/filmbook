import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { ReviewInfo } from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const cursor = req.nextUrl.searchParams.get("cursor") || undefined
  const sortAttr = req.nextUrl.searchParams.get("sortAttr") || "createdAt"
  const sortType = req.nextUrl.searchParams.get("sortType") || "desc"
  const pageSize = 20

  let orderBy: any = {}

  if (sortAttr === "releaseDate") {
    orderBy = { movie: { releaseDate: sortType } }
  } else {
    orderBy = { [sortAttr]: sortType }
  }

  const reviews = await prisma.review.findMany({
    where: {
      userId: params.userId,
    },
    select: {
      id: true,
      movieId: true,
      liked: true,
      watched: true,
      rating: true,
      review: true,
      updatedAt: true,
      createdAt: true,
      movie: {
        select: {
          posterPath: true,
          title: true,
          releaseDate: true,
        },
      },
      user: {
        select: {
          username: true,
        },
      },
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: orderBy,
  })

  const nextCursor = reviews.length > pageSize ? reviews[pageSize].id : null

  const data: ReviewInfo[] = reviews.slice(0, pageSize).map((review) => ({
    id: review.id,
    movieId: review.movieId,
    movie: review.movie,
    user: review.user,
    userId: params.userId,
    liked: review.liked,
    watched: review.watched,
    rating: review.rating,
    review: review.review,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  }))

  return NextResponse.json({ reviews: data, nextCursor })
}
