import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { validateRequest } from "@/auth"
import { LikedInfo } from "@/lib/types"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ movieId: string }> },
) {
  const { movieId } = await params
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const movie = await prisma.review.findFirst({
    where: {
      userId: loggedInUser.id,
      movieId: movieId,
    },
    select: {
      liked: true,
    },
  })

  if (!movie) {
    return NextResponse.json({ isLikedByUser: false })
  }

  const data: LikedInfo = {
    isLikedByUser: !!movie?.liked,
  }

  return NextResponse.json(data)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    await prisma.review.upsert({
      where: {
        userId_movieId: {
          userId: loggedInUser.id,
          movieId,
        },
      },
      create: { userId: loggedInUser.id, movieId, liked: true },
      update: { liked: true },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    await prisma.review.upsert({
      where: {
        userId_movieId: {
          userId: loggedInUser.id,
          movieId,
        },
      },
      create: { userId: loggedInUser.id, movieId, liked: false },
      update: { liked: false },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
