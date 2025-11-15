"use client";

import Image from "next/image";
import { User } from "@/generated/prisma/client";
import { Sidebar } from "./sidebar";
import Link from "next/link";

type FloatingElementsProps = {
  me: User | null;
};

export function Header({ me }: FloatingElementsProps) {
  return (
    <>
      {/* Logo + Title */}
      <Link
        href="/"
        className="fixed top-4 left-4 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg z-1000 hover:scale-105 transition-transform duration-200"
      >
        <Image
          src="/find-me.png"
          alt="Find Me"
          width={30}
          height={30}
          priority
          className="rounded-full"
        />
      </Link>


      {/* Profile Avatar */}
      <div className="fixed top-4 right-4 flex items-center gap-3 px-3 py-2 z-1000">
        <Sidebar />
        <Image
          src={me?.image || "/default-avatar.png"}
          alt={me?.name || "Avatar"}
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </>
  );
}
