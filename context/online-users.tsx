"use client";

import { User } from "@/generated/prisma/client";
import { pusherClient } from "@/lib/pusher";
import { Members } from "pusher-js";
import { createContext, useContext, useEffect, useState } from "react";

type ContextType = {
  onlineUsers: (User & { lat?: number; lng?: number })[];
  setOnlineUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

type MemberType = {
  id: string
  info: User
}

const Context = createContext({} as ContextType);

export function OnlineUsersProvider({ children }: { children: React.ReactNode }) {
  const [onlineUsers, setOnlineUsers] = useState<(User & { lat?: number; lng?: number })[]>([]);

  useEffect(() => {
    // Subscribe to a presence channel
    const channel = pusherClient.subscribe("presence-online-users");

    // Bind to presence events
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const users: User[] = [];
      members.each((member: MemberType) => {
        users.push(member.info);
      });
      setOnlineUsers(users);
    });

    channel.bind("pusher:member_added", (member: MemberType) => {
      setOnlineUsers((prev) => [...prev, member?.info]);
    });

    channel.bind("pusher:member_removed", (member: MemberType) => {
      setOnlineUsers((prev) => prev.filter((u) => u.id !== member.id));
    });

    return () => {
      pusherClient.disconnect();
    };
  }, []);

  return (
    <Context
      value={{
        onlineUsers,
        setOnlineUsers
      }}
    >
      {children}
    </Context>
  );
}

export function useOnlineUsersContext() {
  return useContext(Context);
}