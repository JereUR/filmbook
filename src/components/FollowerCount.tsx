"use client"

import useFollowerInfo from "@/hooks/useFollowerInfo"
import { FollowerInfo } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

interface FollowerCountProps {
  userId: string
  initialState: FollowerInfo
}

export default function FollowerCount({
  userId,
  initialState,
}: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState)

  return (
    <span className='py-2 px-4 bg-card/40 border rounded-2xl border-primary/70'>
      Seguidores:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  )
}
