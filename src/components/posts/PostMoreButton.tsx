import { useState } from 'react'
import { MoreHorizontal, Trash2 } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'

import DeletePostDialog from './DeletePostDialog'

import { PostData } from '@/lib/types'

interface PostMoreButtonProps {
	post: PostData
	className?: string
}

export default function PostMoreButton({
	post,
	className
}: PostMoreButtonProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost" className={className}>
						<MoreHorizontal className="size-5 text-muted-foreground" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={() => setShowDeleteDialog(true)}
						className="cursor-pointer"
					>
						<span className="flex items-center gap-3 font-bold text-foreground">
							<Trash2 className="size-4 text-destructive" />
							Borrar
						</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeletePostDialog
				post={post}
				open={showDeleteDialog}
				onClose={() => setShowDeleteDialog(false)}
			/>
		</div>
	)
}
