import ForYouFeed from './ForYouFeed'
import FollowingFeed from './FollowingFeed'
import AddToDiaryButton from './AddToDiaryButton'

import PostEditor from '@/components/posts/editor/PostEditor'
import TrendsSidebar from '@/components/TrendsSidebar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function Home() {
	return (
		<main className="flex w-full min-w-0 gap-5">
			<div className="w-full min-w-0 space-y-5">
				<div>
					<PostEditor className="rounded-t-2xl border-b-0" />
					<AddToDiaryButton />
				</div>
				<Tabs defaultValue="for-you">
					<TabsList>
						<TabsTrigger value="for-you">Para ti</TabsTrigger>
						<TabsTrigger value="following">Seguidos</TabsTrigger>
					</TabsList>
					<TabsContent value="for-you">
						<ForYouFeed />
					</TabsContent>
					<TabsContent value="following">
						<FollowingFeed />
					</TabsContent>
				</Tabs>
			</div>
			<TrendsSidebar />
		</main>
	)
}
