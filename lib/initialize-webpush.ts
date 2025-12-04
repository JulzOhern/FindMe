import webpush from "web-push";

export function initWebPush() {
  webpush.setVapidDetails(
    "mailto:luffysungodnikaaaa@gmail.com",
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
    process.env.WEB_PUSH_PRIVATE_KEY!
  );
}