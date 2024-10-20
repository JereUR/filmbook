import { NextRequest } from 'next/server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { getPostDataInclude, PostsPage } from '@/lib/types'

export async function GET(req: NextRequest) {
	try {
		const cursor = req.nextUrl.searchParams.get('cursor') || undefined

		const pageSize = 10

		const { user } = await validateRequest()

		if (!user) {
			return Response.json({ error: 'No autorizado.' }, { status: 401 })
		}

		const bookmarks = await prisma.bookmark.findMany({
			where: {
				userId: user.id
			},
			include: {
				post: {
					include: getPostDataInclude(user.id)
				}
			},
			orderBy: { createdAt: 'desc' },
			take: pageSize + 1,
			cursor: cursor ? { id: cursor } : undefined
		})

		const nextCursor =
			bookmarks.length > pageSize ? bookmarks[pageSize].id : null

		const data: PostsPage = {
			posts: bookmarks.slice(0, pageSize).map(bookmark => bookmark.post),
			nextCursor
		}

		return Response.json(data)
	} catch {
		return Response.json(
			{ error: 'Error Interno del Servidor.' },
			{ status: 500 }
		)
	}
}
