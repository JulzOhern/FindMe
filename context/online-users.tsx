"use client";

import { User } from "@/generated/prisma/client";
import { pusherClient } from "@/lib/pusher";
import { Members } from "pusher-js";
import { createContext, useContext, useEffect, useState } from "react";

type ContextType = {
  onlineUsers: User[];
  setOnlineUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const Context = createContext({} as ContextType);

export function OnlineUsersProvider({ children }: { children: React.ReactNode }) {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    // Subscribe to a presence channel
    const channel = pusherClient.subscribe("presence-online-users");

    // Bind to presence events
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const users: User[] = [];
      members.each((member: any) => {
        users.push(member.info);
      });
      setOnlineUsers(users);
    });

    channel.bind("pusher:member_added", (member: any) => {
      setOnlineUsers((prev) => [...prev, member?.info]);
    });

    channel.bind("pusher:member_removed", (member: any) => {
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