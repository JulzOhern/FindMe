'use server';

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function saveSubscription(subscription: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");
  if (me.webPushSubscription) return;

  await prisma.user.update({
    where: {
      id: me.id
    },
    data: {
      webPushSubscription: JSON.stringify(subscription)
    }
  })

  revalidatePath("/");
}