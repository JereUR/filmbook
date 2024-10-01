import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsLoadingSkeleton() {
  return (
    <div className="w-full space-y-2 rounded-2xl bg-card p-5 shadow-sm">
      <ReviewLoadingSkeleton />
      <ReviewLoadingSkeleton />
      <ReviewLoadingSkeleton />
    </div>
  );
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
    </div>
  );
}
