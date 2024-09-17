import Link from "next/link";
import Image from "next/image";

import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import logoImg from '@/assets/logo.png'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-[90] bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-primary">
          <div className="flex flex-col items-center">
            <Image src={logoImg} alt="App logo" width={60} height={60}/>
            <span className="text-2xl font-bold">Filmbook</span>
          </div>
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}