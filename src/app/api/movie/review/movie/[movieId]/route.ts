import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { ReviewData } from "@/lib/types"

export async function GET(
  req: Request,
  { params }: { params: { movieId: string } },
) {
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return NextResponse.json(null)
  }

  const review = await prisma.review.findFirst({
    where: {
      userId: loggedInUser.id,
      movieId: params.movieId,
    },
    select: {
      id: true,
      liked: true,
      watched: true,
      rating: true,
      review: true,
    },
  })

  if (!review) {
    return NextResponse.json(null)
  }

  const data: ReviewData = {
    id: review.id,
    liked: review.liked,
    watched: review.watched,
    rating: review.rating,
    review: review.review,
  }

  return NextResponse.json(data)
}
