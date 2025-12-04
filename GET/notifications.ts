import { prisma } from "@/lib/prisma";
import { getMe } from "./me";

export async function getNotifications() {
  const me = await getMe();
  if (!me) return null;

  const notifications = await prisma.notification.findMany({
    where: {
      receiverId: me.id
    },
    include: {
      sender: true
    }
  })

  return notifications
}