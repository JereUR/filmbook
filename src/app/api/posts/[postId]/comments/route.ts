import { NextRequest } from "next/server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { CommentsPage, getCommentDataInclude } from "@/lib/types"

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    const pageSize = 5

    const { user } = await validateRequest()

    if (!user) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const previousCursor = comments.length > pageSize ? comments[0].id : null

    const data: CommentsPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor,
    }

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
