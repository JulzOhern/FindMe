"use server";

import { getMe } from "@/GET/me";
import { initWebPush } from "@/lib/initialize-webpush";
import { prisma } from "@/lib/prisma";
import { sendNotification } from "@/utils/send-notification";
import { revalidatePath } from "next/cache";

initWebPush();

export async function addFriend(receiverId: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");
  const requesterId = me.id;

  const data = await prisma.friend.findFirst({
    where: {
      AND: [
        {
          requesterId: requesterId
        },
        {
          receiverId: receiverId
        }
      ]
    }
  });

  if (!data) {
    await prisma.friend.create({
      data: {
        requesterId: requesterId,
        receiverId: receiverId
      }
    })
  };

  if (me?.webPushSubscription) {
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } })
    if (!receiver) return

    const title = "Friend request";
    const body = `${receiver?.name} wants to be your friend`;
    const subscription = receiver.webPushSubscription as string;
    await sendNotification(title, body, subscription);
  };

  revalidatePath(`/user/${receiverId}`);
  return data;
}

export async function cancelRequest(receiverId: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");
  const requesterId = me.id;

  const data = await prisma.friend.deleteMany({
    where: {
      requesterId: requesterId,
      receiverId: receiverId
    }
  })

  revalidatePath(`/user/${receiverId}`);
  return data;
}

export async function acceptRequest(receiverId: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");
  const requesterId = me.id;

  const data = await prisma.friend.updateMany({
    where: {
      requesterId: receiverId,
      receiverId: requesterId
    },
    data: {
      status: "ACCEPTED"
    }
  })

  revalidatePath(`/user/${receiverId}`);
  return data;
}

export async function unFriend(receiverId: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");
  const requesterId = me.id;

  const data = await prisma.friend.deleteMany({
    where: {
      OR: [
        {
          requesterId: requesterId,
          receiverId: receiverId
        },
        {
          receiverId: requesterId,
          requesterId: receiverId
        }
      ]
    }
  })

  revalidatePath(`/user/${receiverId}`);
  return data;
}

export async function declineRequest(requesterId: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");
  const myId = me.id;

  const data = await prisma.friend.deleteMany({
    where: {
      requesterId: requesterId,
      receiverId: myId
    }
  })

  revalidatePath(`/user/${requesterId}`);
  return data;
}