"use server";

import { pusherServer } from "@/lib/pusher";

export async function requestFriendPosition(friendId: string) {
  if (!friendId) throw new Error("Friend ID is required");

  pusherServer.trigger(`private-friend-request-${friendId}`, "position-request", {
    userId: friendId,
  });

  return null;
}