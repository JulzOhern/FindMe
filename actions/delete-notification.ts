"use server";

import { Notification } from "@/app/generated/prisma/client";
import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function deleteNotification(notificationId: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  const data = await prisma.notification.delete({ where: { id: notificationId } });

  revalidatePath("/");
  return data;
}

export async function undoDeleteNotification(deletedNotification: Notification) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  const data = await prisma.notification.create({
    data: deletedNotification
  })

  revalidatePath("/");
  return data;
}