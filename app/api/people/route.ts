import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('search');
    const me = await getMe();

    if (!me) return new Response(null, { status: 401 });

    const people = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search ?? "",
              mode: "insensitive"
            }
          },
          {
            email: {
              contains: search ?? "",
              mode: "insensitive"
            }
          }
        ],
        NOT: {
          id: me.id
        }
      },
      include: {
        receivedFriends: true,
        requestedFriends: true
      }
    })

    return NextResponse.json(people, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
}