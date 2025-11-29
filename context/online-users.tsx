"use client";

import { getPosition } from "@/actions/position";
import { User } from "@/generated/prisma/client";
import { pusherClient } from "@/lib/pusher";
import { Members } from "pusher-js";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

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
      toast.info("User left", {
        description: `${member.info.name} left`,
      });
      setOnlineUsers((prev) => prev.filter((u) => u.id !== member.id));
    });

    return () => {
      pusherClient.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        getPosition(latitude, longitude)
      },
      (err) => console.error(err),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 5000 }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  useEffect(() => {
    const channel = pusherClient.subscribe("position-update")

    channel.bind("position", (data: any) => {
      setOnlineUsers(prev =>
        prev.map(u => u.id === data.userId ? { ...u, lat: data.lat, lng: data.lng } : u)
      );
    })

    return () => {
      channel.unbind("position")
      pusherClient.unsubscribe("position-update")
    }
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