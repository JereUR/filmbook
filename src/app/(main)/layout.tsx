import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

import SessionProvider from './SessionProvider'
import Navbar from './Navbar'
import MenuBar from './MenuBar'
import PopularMovies from './PopularMovies'

import { validateRequest } from '@/auth'

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await validateRequest()

	if (!session.user) redirect('/iniciar-sesion')

	return (
		<SessionProvider value={session}>
			<div className="flex min-h-screen flex-col">
				<Navbar />
				<div className="mx-auto flex w-full max-w-[1500px] grow gap-5 p-2 md:p-5">
					<div className="sticky top-[8.25rem] flex flex-col gap-5">
						<MenuBar className="z-50 hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
						<Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
							<PopularMovies className="z-50 hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
						</Suspense>
					</div>
					{children}
				</div>
				<MenuBar className="sticky bottom-0 z-50 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
			</div>
		</SessionProvider>
	)
}
