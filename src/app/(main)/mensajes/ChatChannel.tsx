import { Menu } from 'lucide-react'
import {
	Channel,
	ChannelHeader,
	MessageInput,
	MessageList,
	Window,
	ChannelHeaderProps
} from 'stream-chat-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatChannelProps {
	open: boolean
	openSidebar: () => void
}

export default function ChatChannel({ open, openSidebar }: ChatChannelProps) {
	return (
		<div className={cn('w-full md:block', !open && 'hidden')}>
			<Channel>
				<Window>
					<CustomChannelHeader openSidebar={openSidebar} />
					<MessageList />
					<MessageInput />
				</Window>
			</Channel>
		</div>
	)
}

interface CustomChannelHeaderProps extends ChannelHeaderProps {
	openSidebar: () => void
}

const CustomChannelHeader = ({
	openSidebar,
	...props
}: CustomChannelHeaderProps) => {
	return (
		<div className="flex items-center gap-3">
			<div className="h-full p-2 md:hidden">
				<Button size="icon" variant="ghost" onClick={openSidebar}>
					<Menu className="size-5" />
				</Button>
			</div>
			<ChannelHeader {...props} />
		</div>
	)
}
