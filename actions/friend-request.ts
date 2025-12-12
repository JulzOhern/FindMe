"use server";

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { sendNotification } from "@/utils/send-notification";

export async function acceptRequest(id: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  const data = await prisma.$transaction(async (tx) => {
    const friend = await tx.friend.update({
      where: {
        id: id
      },
      data: {
        status: "ACCEPTED"
      }
    })

    const receiverId = friend.requesterId;

    await tx.notification.create({
      data: {
        senderId: me.id,
        receiverId,
        title: "Friend Request Accepted",
        body: `${me.name} accepted your friend request`
      }
    })

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } })
    if (receiver) {
      const title = "Friend Request Accepted";
      const body = `${me?.name} accepted your friend request`;
      const subscription = receiver.webPushSubscription as string;
      await sendNotification(title, body, subscription);
    }

    pusherServer.trigger(`private-channel-${receiverId}`, "accept-request", {});

    return friend
  })

  return data;
}

export async function declineRequest(id: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  const data = await prisma.friend.delete({
    where: {
      id: id,
    }
  });

  return data;
}