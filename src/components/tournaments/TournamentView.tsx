import { validateAdmin } from '@/auth'
import AddTournamentButton from './editor/AddTournamentButton'
import TournamentList from './TournamentList'
import AddParticipantButton from './participants/editor/AddParticipantButton'
import AsignPointsButton from './points/editor/AsignPointsButton'

export default async function TournamentView() {
  const { admin } = await validateAdmin()

  return (
    <div className='w-full min-h-[80vh] flex flex-col gap-4 md:gap-10 p-2 md:p-5 rounded-2xl bg-card'>
      {admin &&
        <div className='flex justify-end gap-2 md:gap-5'>
          <AddTournamentButton />
          <AddParticipantButton />
          <AsignPointsButton />
        </div>
      }
      <TournamentList />
    </div>
  )
}
