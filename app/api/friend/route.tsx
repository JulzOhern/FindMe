import { getMe } from "@/GET/me";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search');
  const me = await getMe();

  if (!me) return new Response(null, { status: 401 });

  const data = await prisma.friend.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        {
          requesterId: me.id,
          receiver: {
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
            ]
          }
        },
        {
          receiverId: me.id,
          requester: {
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
            ]
          }
        },
      ]
    },
    include: {
      receiver: true,
      requester: true
    }
  })

  return NextResponse.json(data, { status: 200 });
}