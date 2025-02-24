"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PredictionFormSkeleton() {
  const renderNomineesSkeletons = (count: number) =>
    Array(count)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="relative w-full items-center max-w-[85vw] sm:max-w-[400px] lg:max-w-[470px]">
          <div className="relative flex items-start gap-2 sm:gap-3 rounded-lg border p-2 sm:p-3">
            <Skeleton className="h-14 sm:h-16 w-10 sm:w-12 rounded" />
            <div className="flex-1 min-w-0">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full" />
          </div>
        </div>
      ))

  const renderCategorySkeleton = () => (
    <Card className="overflow-hidden dark:bg-slate-950">
      <div className="border-b bg-muted/50 px-4 sm:px-6 py-3 sm:py-4 dark:bg-slate-900">
        <Skeleton className="h-6 w-2/3" />
      </div>
      <div className="grid md:grid-cols-2">
        <div className="p-4 sm:p-6 border-b md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2">{renderNomineesSkeletons(5)}</div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">{renderNomineesSkeletons(5)}</div>
        </div>
      </div>
    </Card>
  )

  const renderSectionSkeleton = () => (
    <div className="space-y-2 lg:space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-2 lg:gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i}>{renderCategorySkeleton()}</div>
          ))}
      </div>
    </div>
  )

  return (
    <div className="container flex flex-col min-h-screen mx-auto px-1 py-2 lg:px-4 lg:py-6">
      <div className="rounded-2xl bg-card p-2 lg:p-5 shadow-sm mb-2 sm:mb-8">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-5/6 mx-auto mt-2" />
      </div>

      <div className="space-y-4 sm:space-y-12">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i}>{renderSectionSkeleton()}</div>
          ))}
      </div>

      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 mt-4 lg:mt-8 border-t">
        <div className="container w-full mx-auto">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

