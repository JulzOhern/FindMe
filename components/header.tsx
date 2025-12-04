"use client";

import Image from "next/image";
import { User } from "@/generated/prisma/client";
import Link from "next/link";
import { Button } from "./ui/button";
import { Bell, Menu } from "lucide-react";
import { useSideBarStore } from "@/lib/zustand";

type FloatingElementsProps = {
  me: User | null;
};

export function Header({ me }: FloatingElementsProps) {
  const toggle = useSideBarStore(state => state.toggle)

  return (
    <>
      {/* Logo + Title */}
      <Link
        href="/"
        className="fixed top-4 left-4 text-lg p-2 flex items-center justify-center bg-white rounded-full shadow-md z-1000"
      >
        <Image
          src="/find-me.png"
          alt="Find Me"
          width={35}
          height={35}
          priority
          className="rounded-full"
        />
      </Link>


      {/* Profile Avatar */}
      <div className="fixed top-4 right-4 flex items-center gap-3 px-3 py-2 z-1000">
        <Button
          onClick={() => console.log("Open notifications")}
          variant="outline"
          size="icon-sm"
          className="relative"
        >
          <Bell className="w-6 h-6 text-gray-700" />

          {/* Red Dot for unread notifications */}
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>

        <Button
          onClick={() => toggle()}
          variant="outline"
          size="icon-sm"
        >
          <Menu />
        </Button>

        <Link href={`/profile/${me?.id}`}>
          <Image
            src={me?.image || "/default-avatar.png"}
            alt={me?.name || "Avatar"}
            width={70}
            height={90}
            className="h-9 w-9 rounded-full object-cover"
          />
        </Link>
      </div>
    </>
  );
}
