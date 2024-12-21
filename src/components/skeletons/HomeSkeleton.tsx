import { Skeleton } from "@/components/ui/skeleton"

export function HomeSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gray-900/50 p-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded-md bg-green-600" />
      </div>
      <div className="flex justify-around gap-4 border-b bg-gray-900/50 border-gray-800 py-2 rounded-md">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
      </div>
      {Array(2).fill(null).map((_, i) => (
        <div key={i} className="space-y-4 rounded-lg bg-gray-900/50 p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      ))}
    </div>
  )
}

