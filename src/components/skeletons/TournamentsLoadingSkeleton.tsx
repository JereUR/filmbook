import { Skeleton } from "@/components/ui/skeleton"

export default function TournamentsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <ItemLoadingSkeleton />
      <ItemLoadingSkeleton />
      <ItemLoadingSkeleton />
    </div>
  )
}

function ItemLoadingSkeleton() {
  return (
    <div className="flex flex-wrap gap-5 w-full border rounded-2xl p-2 md:p-5">
      <div className='w-full p-2'>
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-52 rounded" />
          <div className="w-full">
            <Skeleton className="h-6 w-full rounded-t rounded-r rounded-bl-none" />
            <Skeleton className="h-3 w-40 rounded-b rounded-t-none" />
          </div>
          <div className="flex flex-col items-center gap-5 w-full border rounded-2xl p-2 md:p-5">
            <div className="flex gap-8 justify-around items-end">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <div className="p-2 border rounded">
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </div>
        </div>
        <Skeleton className="h-3 w-40 rounded text-start mt-5" />
      </div>
    </div>
  )
}