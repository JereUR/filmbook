import { Skeleton } from "@/components/ui/skeleton"

export function HeaderSkeleton() {
  return (
    <header className="border-b border-gray-800 bg-[#0a0a1b] px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Skeleton className="h-16 w-52" />
          <Skeleton className="h-10 w-48 rounded-md" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </header>
  )
}

