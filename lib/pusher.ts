import PusherClient from "pusher-js";
import Pusher from 'pusher';

const APP_ID = process.env.PUSHER_APP_ID;
const APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const APP_SECRET = process.env.PUSHER_APP_SECRET;
const APP_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

export const pusherClient = new PusherClient(APP_KEY!, {
  cluster: APP_CLUSTER!,
  authEndpoint: "/api/pusher/auth"
})

export const pusherServer = new Pusher({
  appId: APP_ID!,
  key: APP_KEY!,
  secret: APP_SECRET!,
  cluster: APP_CLUSTER!,
  useTLS: true,
});