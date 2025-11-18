"use server";

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";

export async function acceptRequest(id: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  const data = await prisma.friend.update({
    where: {
      id: id
    },
    data: {
      status: "ACCEPTED"
    }
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