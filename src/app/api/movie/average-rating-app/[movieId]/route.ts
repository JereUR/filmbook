import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ movieId: string }> },
) {
  const { movieId } = await params
  const rating = await prisma.movieRating.findFirst({
    where: {
      movieId: movieId,
    },
    select: {
      averageRating: true,
      numberOfRatings: true,
    },
  })

  if (!rating) {
    return NextResponse.json(null)
  }

  return NextResponse.json(rating)
}
