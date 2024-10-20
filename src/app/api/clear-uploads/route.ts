import { UTApi } from 'uploadthing/server'

import prisma from '@/lib/prisma'

export async function GET(req: Request) {
	try {
		const authHeader = req.headers.get('Authorization')

		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			return Response.json(
				{ message: 'Encabezado de autorización no válido.' },
				{ status: 401 }
			)
		}

		const unusedMedia = await prisma.media.findMany({
			where: {
				postId: null,
				...(process.env.NODE_ENV === 'production'
					? {
							createdAt: {
								lte: new Date(Date.now() - 60 * 60 * 1000 * 24) // 24 hours
							}
						}
					: {})
			},
			select: {
				id: true,
				url: true
			}
		})

		new UTApi().deleteFiles(
			unusedMedia.map(
				media =>
					media.url.split(
						`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
					)[1]
			)
		)

		await prisma.media.deleteMany({
			where: {
				id: {
					in: unusedMedia.map(media => media.id)
				}
			}
		})

		return new Response()
	} catch {
		return Response.json(
			{ error: 'Error Interno del Servidor.' },
			{ status: 500 }
		)
	}
}
