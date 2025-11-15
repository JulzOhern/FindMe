import { auth } from "@/auth"
import { prisma } from "@/lib/prisma";

export async function getMe() {
  const session = await auth();

  if (!session || !session.user?.email) return null;
  const { email } = session?.user

  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  return user
}