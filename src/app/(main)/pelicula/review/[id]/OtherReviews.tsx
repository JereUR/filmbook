interface OtherReviewsProps {
  movieId: string
}

export default function OtherReviews({ movieId }: OtherReviewsProps) {
  return <div className='p-2 md:p-5 bg-card rounded-2xl'><div className="text-xl font-bold">Otras reviews</div>{movieId}</div>
}