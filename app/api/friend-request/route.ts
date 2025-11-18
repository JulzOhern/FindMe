import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('search');
    const me = await getMe();

    if (!me) return new Response(null, { status: 401 });

    const data = await prisma.friend.findMany({
      where: {
        receiverId: me.id,
        status: "PENDING",
        OR: [
          {
            requester: {
              name: {
                contains: search ?? "",
                mode: "insensitive"
              }
            }
          },
          {
            requester: {
              email: {
                contains: search ?? "",
                mode: "insensitive"
              }
            }
          }
        ],
      },
      include: {
        requester: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return new Response(error.message, { status: 500 });
    }
  }
}