import { Skeleton } from "@/components/ui/skeleton";

export default function DiariesLoadingSkeleton() {
  return (
    <div className="w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <DiaryLoadingSkeleton />
      <DiaryLoadingSkeleton />
      <DiaryLoadingSkeleton />
    </div>
  );
}

function DiaryLoadingSkeleton() {
  return (
    <div className="flex flex-wrap gap-5 w-full">
      <div className="flex gap-2 w-full md:gap-4 p-2 md:p-4 border rounded-2xl">
        <Skeleton className="h-40 w-28" />
        <div className='w-full'>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-52 rounded" />
            <Skeleton className="h-4 w-60 rounded" />
          </div>
          <Skeleton className="h-12 w-full rounded-t rounded-r rounded-bl-none mt-4" />
          <Skeleton className="h-4 w-40 rounded-b rounded-t-none" />
          <div className='flex justify-between mt-6'>
            <Skeleton className="h-10 w-48 rounded" />
            <Skeleton className="h-10 w-40 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
