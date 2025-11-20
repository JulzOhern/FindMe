"use server";

import { getMe } from "@/GET/me"
import { pusherServer } from "@/lib/pusher";

export const getPosition = async (lat: number, lng: number) => {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  await pusherServer.trigger("position-update", "position", {
    userId: me.id,
    lat: lat,
    lng: lng
  });

  return null
}