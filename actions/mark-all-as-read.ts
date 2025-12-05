"use server";

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAllAsRead() {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  await prisma.notification.updateMany({
    where: {
      receiverId: me.id
    },
    data: {
      isRead: true
    }
  })

  revalidatePath("/");
}