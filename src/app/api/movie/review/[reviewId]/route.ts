import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { LikeInfo, ReviewInfo } from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params }: { params: { reviewId: string } },
) {
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const reviewData = await prisma.review.findUnique({
    where: {
      id: params.reviewId,
    },
    select: {
      id: true,
      userId: true,
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
          directors: true,
        },
      },
      user: {
        select: {
          username: true,
          avatarUrl: true,
          displayName: true,
        },
      },
      likes: {
        where: {
          userId: loggedInUser.id,
        },
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  })

  if (!reviewData) {
    return NextResponse.json(null)
  }

  const likesData: LikeInfo = {
    likes: reviewData._count.likes,
    isLikedByUser: !!reviewData.likes.length,
  }

  const review: ReviewInfo = {
    id: reviewData.id,
    userId: reviewData.userId,
    movieId: reviewData.movieId,
    movie: reviewData.movie,
    user: reviewData.user,
    liked: reviewData.liked,
    watched: reviewData.watched,
    rating: reviewData.rating,
    review: reviewData.review,
    createdAt: reviewData.createdAt,
    updatedAt: reviewData.updatedAt,
    likesData,
  }

  return NextResponse.json(review)
}
