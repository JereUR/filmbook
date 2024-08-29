import { Metadata } from "next";
import React from "react";
import Link from "next/link";

import LoginForm from "./LoginForm";
import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Inicia sesión en filmbook para compartir tus películas favoritas y comentar.",
};

export default function LoginPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">Iniciar Sesión</h1>
          <div className="space-y-5">
            <LoginForm />
            <Link
              href="/registrarse"
              className="block text-center text-purple-600 hover:text-purple-700 hover:underline"
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
  );
}
