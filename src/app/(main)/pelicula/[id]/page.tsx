import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

import MovieShow from '@/components/movies/MovieShow'
import Recommendations from '@/components/movies/Recommendations'

interface PageProps {
	params: { id: string }
	searchParams: { title?: string; date?: string }
}

export async function generateMetadata({
	searchParams
}: PageProps): Promise<Metadata> {
	const title = searchParams.title || 'Sin título'
	const date = searchParams.date || ''

	if (!title) {
		return notFound()
	}

	return {
		title: `${title} (${date})`
	}
}

export default function MoviePage({ params }: PageProps) {
	return (
		<main className="flex w-full min-w-0 flex-col gap-5 md:flex-row">
			<div className="md:w-3/4 md:grow">
				<Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
					<MovieShow id={params.id} />
				</Suspense>
			</div>
			<div className="md:w-1/4">
				<Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
					<RecommendationsContainer id={params.id} />
				</Suspense>
			</div>
		</main>
	)
}

const RecommendationsContainer = ({ id }: { id: string }) => {
	return (
		<div className="h-fit w-full flex-none space-y-5 px-2 md:block">
			<Recommendations id={id} />
		</div>
	)
}
