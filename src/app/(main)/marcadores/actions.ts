'use server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'

export async function deleteWatchlistItem(id: string) {
	const { user } = await validateRequest()

	if (!user) throw new Error('No autorizado.')

	const watchlistItem = await prisma.watchlist.findUnique({
		where: {
			id
		}
	})

	if (!watchlistItem) throw new Error('Película no encontrada.')

	if (watchlistItem.userId !== user.id)
		throw new Error('No tienes permisos para eliminar esta película.')

	const deletedWatchlistItem = await prisma.watchlist.delete({
		where: { id }
	})

	return deletedWatchlistItem
}
