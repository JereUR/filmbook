import { useState } from 'react'
import { Loader2, SendHorizonal } from 'lucide-react'

import { Input } from '../ui/input'
import { Button } from '../ui/button'

import { useSubmitCommentMutation } from './mutations'

import { PostData } from '@/lib/types'

interface CommentInputProps {
	post: PostData
}

export default function CommentInput({ post }: CommentInputProps) {
	const [input, setInput] = useState('')

	const mutation = useSubmitCommentMutation(post.id)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()

		if (!input) return

		mutation.mutate(
			{
				post,
				content: input
			},
			{ onSuccess: () => setInput('') }
		)
	}

	return (
		<form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
			<Input
				placeholder="Escribe un comentario..."
				value={input}
				onChange={({ target }) => setInput(target.value)}
				autoFocus
			/>
			<Button
				type="submit"
				variant="ghost"
				size="icon"
				disabled={!input.trim() || mutation.isPending}
			>
				{!mutation.isPending ? (
					<SendHorizonal />
				) : (
					<Loader2 className="animate-spin" />
				)}
			</Button>
		</form>
	)
}
