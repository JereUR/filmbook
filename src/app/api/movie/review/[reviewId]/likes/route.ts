import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { LikeInfo } from "@/lib/types"

export async function GET(
  req: Request,
  { params: { reviewId } }: { params: { reviewId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: {
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

    if (!review) {
      return Response.json({ error: "Review no encontrada." }, { status: 404 })
    }

    const data: LikeInfo = {
      likes: review._count.likes,
      isLikedByUser: !!review.likes.length,
    }

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}

export async function POST(
  req: Request,
  { params: { reviewId } }: { params: { reviewId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        userId: true,
      },
    })

    if (!review) {
      return Response.json({ error: "Review no encontrada." }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.like.upsert({
        where: {
          userId_reviewId: {
            userId: loggedInUser.id,
            reviewId,
          },
        },
        create: { userId: loggedInUser.id, reviewId },
        update: {},
      }),
      ...(loggedInUser.id !== review.userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: review.userId,
                reviewId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ])

    return new Response()
  } catch (error) {
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: Request,
  { params: { reviewId } }: { params: { reviewId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        userId: true,
      },
    })

    if (!review) {
      return Response.json({ error: "Review no encontrada." }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          reviewId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: review.userId,
          reviewId,
          type: "LIKE",
        },
      }),
    ])

    return new Response()
  } catch (error) {
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
