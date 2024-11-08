import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

import { validateAdmin } from '@/auth'
import AddTournamentButton from './editor/AddTournamentButton'
import TournamentsList from './TournamentsList'
import AddAssignParticipantButton from './participants/editor/AddAssignParticipantButton'
import AssignPointsButton from './points/editor/AssignPointsButton'

export default async function TournamentsView() {
  const { admin } = await validateAdmin()

  return (
    <div className='w-full min-h-[80vh] flex flex-col gap-4 md:gap-10 p-2 md:p-5 rounded-2xl bg-card'>
      {admin &&
        <div className="flex flex-col w-full my-2 md:my-0 justify-center items-center gap-2 md:gap-5 md:flex-row md:justify-end">
          <AddTournamentButton />
          <AddAssignParticipantButton />
          <AssignPointsButton />
        </div>
      }
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <TournamentsList admin={admin} />
      </Suspense>
    </div>
  )
}
