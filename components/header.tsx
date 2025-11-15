"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "@/generated/prisma/client";
import { Sidebar } from "./sidebar";

type HeaderProps = {
  me: User | null;
}

export function Header({ me }: HeaderProps) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur-md shadow-sm fixed z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/find-me.png"
            alt="Find Me"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold tracking-tight">FindMe</span>
        </Link>

        {/* Profile avatar */}
        <div className="flex items-center gap-5">
          <Sidebar />

          <Image
            src={me?.image || "/default-avatar.png"}
            alt="User"
            width={36}
            height={36}
            className="rounded-full border"
          />
        </div>
      </div>
    </header>
  );
}
