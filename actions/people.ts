"use server";

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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