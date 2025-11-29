import { prisma } from "@/lib/prisma";
import { getMe } from "./me";

export async function getUser(userId: string) {
  const me = await getMe();

  if (!me) return null;

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      receivedFriends: true,
      requestedFriends: true
    }
  });

  return user;
}