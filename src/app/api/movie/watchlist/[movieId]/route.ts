import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { WatchlistInfo } from "@/lib/types"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    const watchlist = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId: loggedInUser.id,
          movieId,
        },
      },
    })

    const data: WatchlistInfo = {
      isAddToWatchlistByUser: !!watchlist,
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
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    await prisma.watchlist.upsert({
      where: {
        userId_movieId: {
          userId: loggedInUser.id,
          movieId,
        },
      },
      create: { userId: loggedInUser.id, movieId },
      update: {},
    })

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
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params
    const { user: loggedInUser } = await validateRequest()

    if (!loggedInUser) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    await prisma.watchlist.deleteMany({
      where: {
        userId: loggedInUser.id,
        movieId,
      },
    })

    return new Response()
  } catch (error) {
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
