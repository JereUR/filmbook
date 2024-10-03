'use client'

import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

import { ReviewInfo } from "@/lib/types";

interface UserReviewProps{
  id:string
}

export default function UserReview({id}:UserReviewProps) {
  const [review, setReview] = useState<ReviewInfo | null>(null);
  const {toast} = useToast()

  async function getReview(){
    const response = await fetch(`/api/movie/review/${id}`);
    if(!response.ok) toast({variant:'destructive', title:response.statusText})
    const data = await response.json();
    setReview(data);
  }

  useEffect(() => {
    getReview();
  }, [])

  return (
    <div className='p-2 md:p-5 bg-card rounded-2xl'>{review?.movie.title}</div>
  )
}
