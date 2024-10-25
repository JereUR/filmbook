import { Calendar } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton";

export default function DiariesLoadingSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-card p-5 shadow-sm">

      <DiaryLoadingSkeleton />
      <DiaryLoadingSkeleton />
    </div>
  );
}

function DiaryLoadingSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-2 w-full md:gap-4 p-2 md:p-4 border rounded-2xl mb-2 md:mb-4">
        <Calendar className='text-muted' /> <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="h-4 w-24 ml-2 md:ml-4" />
      <hr className='w-[95%] text-muted h-[1px] mx-auto md:my-2' />
      <DiaryLoadingSkeleton />
      <DiaryLoadingSkeleton />
    </div>
  );
}
