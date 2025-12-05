"use server";

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAllNotification() {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  await prisma.notification.deleteMany({ where: { receiverId: me.id } });

  revalidatePath("/");
}