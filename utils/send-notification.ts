import { getMe } from "@/GET/me";
import webpush from "web-push";

export async function sendNotification(title: string, body: string, subscription: any) {
  const me = await getMe();

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        profile: me?.image,
        title,
        body
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      console.log(error.message);
    }
  }
}