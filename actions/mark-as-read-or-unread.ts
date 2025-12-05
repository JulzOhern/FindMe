"use server";

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAsReadOrUnread(notificationId: string, isRead: boolean) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  await prisma.notification.update({
    where: {
      id: notificationId
    },
    data: {
      isRead: !isRead
    }
  })

  revalidatePath('/')
}