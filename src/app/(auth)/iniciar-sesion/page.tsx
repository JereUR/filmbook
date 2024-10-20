import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import LoginForm from './LoginForm'
import GoogleSignInButton from './google/GoogleSignInButton'

import loginImage from '@/assets/login-image.jpg'

export const metadata: Metadata = {
	title: 'Iniciar sesión',
	description:
		'Inicia sesión en filmbook para compartir tus películas favoritas y comentar.'
}

export default function LoginPage() {
	return (
		<main className="flex h-screen items-center justify-center p-5">
			<div className="flex size-full max-h-[40rem] max-w-5xl overflow-hidden rounded-2xl bg-card shadow-2xl">
				<div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
					<h1 className="text-center text-3xl font-bold">Iniciar Sesión</h1>
					<div className="space-y-5">
						<GoogleSignInButton />
						<div className="flex items-center gap-3">
							<div className="h-px flex-1 bg-muted" />
							<span className="text-primary">ó</span>
							<div className="h-px flex-1 bg-muted" />
						</div>
						<LoginForm />
						<Link
							href="/registrarse"
							className="block text-center text-primary hover:text-primary/70 hover:underline"
						>
							¿No tienes una cuenta? Regístrate aquí.
						</Link>
					</div>
				</div>
				<Image
					src={loginImage}
					alt="Imagen inicio de sesión"
					className="hidden w-1/2 object-cover md:block"
				/>
			</div>
		</main>
	)
}
