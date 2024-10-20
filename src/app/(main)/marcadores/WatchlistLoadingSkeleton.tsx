import { Skeleton } from '@/components/ui/skeleton'

export default function WatchlistsLoadingSkeleton() {
	return (
		<div className="w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
			<WatchlistLoadingSkeleton />
			<WatchlistLoadingSkeleton />
			<WatchlistLoadingSkeleton />
		</div>
	)
}

const WatchlistLoadingSkeleton = () => {
	return (
		<div className="flex w-full flex-wrap gap-5">
			<div className="flex w-full gap-2 rounded-2xl border p-2 md:gap-4 md:p-4">
				<Skeleton className="h-40 w-28" />
				<div className="w-full">
					<div className="space-y-1.5">
						<Skeleton className="h-4 w-52 rounded" />
						<Skeleton className="h-4 w-60 rounded" />
					</div>
					<Skeleton className="mt-4 h-12 w-full rounded-t rounded-bl-none" />
					<Skeleton className="h-4 w-40 rounded-b rounded-t-none" />
					<div className="mt-6 flex justify-between">
						<Skeleton className="h-10 w-48 rounded" />
						<Skeleton className="h-10 w-40 rounded" />
					</div>
				</div>
			</div>
		</div>
	)
}
