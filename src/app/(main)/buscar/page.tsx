import { Metadata } from 'next'

import SearchResults from './SearchResults'

import TrendsSidebar from '@/components/TrendsSidebar'

interface SearchPageProps {
	searchParams: { q: string }
}

export function generateMetadata({
	searchParams: { q }
}: SearchPageProps): Metadata {
	return {
		title: `Resultado de búsqueda para "${q}"`
	}
}

export default function SearchPage({ searchParams: { q } }: SearchPageProps) {
	return (
		<main className="flex w-full min-w-0 gap-5">
			<div className="w-full min-w-0 space-y-5">
				<div className="rounded-2xl bg-card p-5 shadow-sm">
					<h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
						Resultado de búsqueda para &quot;{q}&quot;
					</h1>
				</div>
				<SearchResults query={q} />
			</div>
			<TrendsSidebar />
		</main>
	)
}
