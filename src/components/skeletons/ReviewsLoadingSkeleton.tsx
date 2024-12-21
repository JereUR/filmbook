import { Skeleton } from "@/components/ui/skeleton"

export default function ReviewsLoadingSkeleton() {
  return (
    <div className="w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm mt-5">
      <div className='flex justify-between'>
        <Skeleton className='h-10 w-80 mt-2' />
        <div className="p-2 border rounded">
          <Skeleton className="h-6 w-32 rounded" />
        </div>
      </div>
      <ReviewLoadingSkeleton />
      <ReviewLoadingSkeleton />
      <ReviewLoadingSkeleton />
    </div>
  )
}

function ReviewLoadingSkeleton() {
  return (
    <div className="flex justify-center gap-2 animate-pulse">
      <div className="space-y-1">
        <Skeleton className="h-40 w-28 rounded" />
        <Skeleton className="h-5 w-28 rounded" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-40 w-28 rounded" />
        <Skeleton className="h-5 w-28 rounded" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-40 w-28 rounded" />
        <Skeleton className="h-5 w-28 rounded" />
      </div>
      <div className="hidden md:block space-y-1">
        <Skeleton className="h-40 w-28 rounded" />
        <Skeleton className="h-5 w-28 rounded" />
      </div>
      <div className="hidden md:block space-y-1">
        <Skeleton className="h-40 w-28 rounded" />
        <Skeleton className="h-5 w-28 rounded" />
      </div>
      <div className="hidden md:block space-y-1">
        <Skeleton className="h-40 w-28 rounded" />
        <Skeleton className="h-5 w-28 rounded" />
      </div>
    </div>
  )
}
