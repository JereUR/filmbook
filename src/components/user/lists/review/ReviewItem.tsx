import { ReviewInfo } from '@/lib/types'
import React from 'react'

interface ReviewItemProps{
  review: ReviewInfo
}

export default function ReviewItem({review}:ReviewItemProps) {
  return (
    <div>{review.movie.title}</div>
  )
}
