import { NextRequest } from "next/server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { getPostDataInclude, PostsPage } from "@/lib/types"

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    const pageSize = 10

    const { user } = await validateRequest()

    if (!user) {
      return Response.json({ error: "No autorizado." }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    }

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: "Error Interno del Servidor." },
      { status: 500 },
    )
  }
}
