import { Skeleton } from "@/components/ui/skeleton"

interface PopularMoviesSkeletonProps {
  className?: string
}

export function PopularMoviesSkeleton({ className }: PopularMoviesSkeletonProps) {
  return (
    <div className={className}>
      <Skeleton className="h-7 w-40 mb-4" />
      <ul className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <li key={index} className="flex items-start gap-3 rounded-2xl border border-primary/40 p-2 md:p-4">
            <Skeleton className="flex-none w-[50px] h-[75px] rounded" />
            <div className="flex-grow">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <div className="flex items-center gap-1 md:gap-2 mt-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
