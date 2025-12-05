"use client";

import { useOnlineUsersContext } from "@/context/online-users";
import { User } from "@/app/generated/prisma/client";
import Image from "next/image";

type ProfileImageProps = {
  user: User | null;
  online?: boolean; // optional prop
};

export function ProfileImage({ user }: ProfileImageProps) {
  const { onlineUsers } = useOnlineUsersContext();

  const isOnline = onlineUsers?.some((u) => u.id === user?.id);

  return (
    <div className="inline-block">
      <div className="w-fit relative">
        <Image
          src={user?.image ?? "/default-avatar.png"}
          alt={user?.name ?? "User Avatar"}
          width={100}
          height={100}
          className="w-20 h-20 rounded-2xl shadow-md"
        />

        {/* Online indicator */}
        {isOnline && (
          <span
            className="
            absolute -bottom-1 -right-1
            w-4 h-4 rounded-full 
            bg-green-500
            border-2 border-white 
            shadow-[0_0_4px_rgba(0,0,0,0.3)]
          "
          />
        )}
      </div>
    </div>
  );
}
