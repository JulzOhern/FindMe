"use server";

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";

export async function changeName(newName: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");
  if (newName.length < 2) throw new Error("Name must be at least 2 characters");

  await prisma.user.update({
    where: {
      id: me.id
    },
    data: {
      name: newName
    }
  })
}