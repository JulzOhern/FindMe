"use server";

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";


export async function unFriend(id: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  const data = await prisma.friend.delete({
    where: {
      id: id
    }
  });

  return data;
}