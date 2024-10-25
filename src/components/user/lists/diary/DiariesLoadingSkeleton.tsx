import { Calendar } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton";

export default function DiariesLoadingSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-card p-5 shadow-sm">
      <DiariesItemsLoadingSkeleton/>
      <DiariesItemsLoadingSkeleton/>
    </div>
  );
}

function DiariesItemsLoadingSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-2 w-full md:gap-4 p-2 md:p-4 border rounded-2xl mb-2 md:mb-4">
        <Calendar className='text-muted' /> <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="h-4 w-24 ml-2 md:ml-4" />
      <hr className='w-[95%] text-muted h-[1px] mx-auto md:my-2' />
      <DiaryItemLoadingSkeleton />
      <DiaryItemLoadingSkeleton />
    </div>
  );
}

function DiaryItemLoadingSkeleton() {
  return (
    <div className="flex flex-wrap w-full p-2 md:p-4">
      <div className="flex gap-2 w-full md:gap-4 p-2 md:p-4 bg-background rounded-2xl">
        <Skeleton className="h-28 w-20" />
        <div className='w-full'>
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-52 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
