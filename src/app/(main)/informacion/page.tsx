import { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Github, Linkedin } from "lucide-react";
import Image from "next/image";

import TrendsSidebar from "@/components/TrendsSidebar";
import portfolioLogo from "@/assets/logo-portfolio.png";

export const metadata: Metadata = {
  title: "Información de Filmbook",
};

export default function InfoPage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="h-fit w-full min-w-0 space-y-5 bg-card p-5 shadow-sm rounded-2xl">
        <h1 className="text-center text-4xl font-bold text-primary">Información de Filmbook</h1>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl shadow-inner">
            <h2 className="text-xl font-semibold mb-3 text-primary">Sobre Filmbook</h2>
            <p className="text-muted-foreground/70 leading-relaxed">
              Filmbook es una innovadora red social que fusiona las mejores características de X y Letterboxd.
              Nuestra plataforma ofrece a los cinéfilos un espacio único para compartir, discutir y reseñar películas,
              creando una comunidad vibrante de amantes del cine.
            </p>
          </div>
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl shadow-inner">
            <h2 className="text-xl font-semibold mb-3 text-primary">Tecnologías Utilizadas</h2>
            <p className="text-muted-foreground/70 leading-relaxed">
              Desarrollada con un stack tecnológico de vanguardia, Filmbook utiliza:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground/70">
              <li>Next.js para renderizado eficiente</li>
              <li>Prisma para gestión de base de datos</li>
              <li>Lucia Auth para autenticación segura</li>
              <li>React Query para manejo de estado</li>
              <li>TypeScript para código robusto</li>
              <li>Tailwind CSS para diseño responsivo</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl shadow-inner">
            <h2 className="text-xl font-semibold mb-3 text-primary">Inspiración y Desarrollo</h2>
            <p className="text-muted-foreground/70 leading-relaxed">
              Este proyecto está inspirado en una estructura original de{' '}
              <Link
                href="https://www.youtube.com/@codinginflow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center"
              >
                Coding In Flow
                <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
              , a la cual he añadido nuevas funcionalidades para integrar las características únicas de Letterboxd,
              creando así una experiencia de usuario enriquecida y personalizada.
            </p>
          </div>
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl shadow-inner">
            <h2 className="text-xl font-semibold mb-3 text-primary">Consideraciones sobre las imágenes</h2>
            <p className="text-muted-foreground/70 leading-relaxed">
              Filmbook utiliza <strong>Vercel Storage</strong> en su versión gratuita para alojar las bases de datos
              y gestionar las imágenes. Esta modalidad permite procesar hasta 1000 imágenes por mes. Debido a esta
              limitación, es posible que algunas imágenes no se rendericen correctamente en la plataforma en casos de
              alta demanda. Agradecemos su comprensión y estamos trabajando para ofrecer una experiencia óptima.
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-6 mt-40 items-center">
          <Link
            href="https://www.linkedin.com/in/jeremias-dominguez-vega/"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            title="Linkedin"
          >
            <Linkedin className="w-8 h-8 text-blue-600 transition-transform group-hover:scale-110" />
          </Link>
          <Link
            href="https://github.com/JereUR"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            title="Github"
          >
            <Github className="w-8 h-8 text-gray-800 transition-transform group-hover:scale-110" />
          </Link>
          <Link
            href="https://jeremiasdvportfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            title="Portfolio"
          >
            <Image
              src={portfolioLogo}
              alt="Portfolio Logo"
              width={34}
              height={34}
              className="transition-transform group-hover:scale-110"
            />
          </Link>
        </div>
      </div>
      <TrendsSidebar />
    </main>
  );
}
