import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ movieId: string }> },
) {
  const { movieId } = await params
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const review = await prisma.review.findFirst({
    where: {
      userId: loggedInUser.id,
      movieId: movieId,
    },
    select: {
      rating: true,
    },
  })

  if (!review) {
    return NextResponse.json(null)
  }

  return NextResponse.json(review.rating)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ movieId: string }> },
) {
  const { movieId } = await params
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const { rating } = await req.json()

  await prisma.review.upsert({
    where: {
      userId_movieId: {
        userId: loggedInUser.id,
        movieId,
      },
    },
    create: { userId: loggedInUser.id, movieId, rating },
    update: { rating },
  })

  return NextResponse.json({ success: true })
}
