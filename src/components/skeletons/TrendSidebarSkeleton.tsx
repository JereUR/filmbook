import { Skeleton } from "@/components/ui/skeleton"

export function TrendSidebarSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-lg bg-gray-900/50 border" />
      <div className="rounded-lg bg-gray-900/50 p-4">
        <Skeleton className="mb-4 h-6 w-32" />
        {Array(2).fill(null).map((_, i) => (
          <div key={i} className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-gray-900/50 p-4">
        <Skeleton className="mb-4 h-6 w-48" />
        {Array(2).fill(null).map((_, i) => (
          <div key={i} className="mb-4 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

