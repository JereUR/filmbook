import { Skeleton } from "@/components/ui/skeleton"

export function LeftSideSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-5 bg-gray-900/50 px-3 py-5 rounded-2xl">
        {Array(7).fill(null).map((_, i) => (
          <div key={i} className="flex items-center gap-5">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-5 w-32" />
          </div>
        ))}
      </div>
      <div className="space-y-4 bg-gray-900/50 px-3 py-5 rounded-2xl">
        <Skeleton className="h-6 w-52" />
        {Array(3).fill(null).map((_, i) => (
          <div key={i} className="flex gap-3 bg-gray-900/50 p-2 rounded-2xl">
            <Skeleton className="h-16 w-12" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

