'use server';

import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function saveSubscription(subscription: string) {
  const me = await getMe();

  if (!me) throw new Error("Not authenticated");

  await prisma.user.update({
    where: {
      id: me.id
    },
    data: {
      webPushSubscription: JSON.parse(subscription)
    }
  })

  revalidatePath("/");
}