import { getMe } from "@/GET/me";
import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const me = await getMe();

  const user_id = me?.id;
  const params = new URLSearchParams(bodyText);
  const socket_id = params.get("socket_id")!;
  const channel_name = params.get("channel_name")!;

  if (!user_id) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const auth = pusherServer.authorizeChannel(socket_id, channel_name, {
    user_id,
    user_info: me, // optional object like { name: "Juliana" }
  });

  return NextResponse.json(auth);
}
