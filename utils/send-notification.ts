import webpush from "web-push";

export async function sendNotification(title: string, body: string, subscription: any) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
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