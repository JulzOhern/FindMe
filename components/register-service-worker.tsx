'use client';

import { saveSubscription } from "@/actions/save-subscription";
import { useEffect } from "react";

export function RegisterServiceWorker() {
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(registration => {
        console.log("Service Worker registered:", registration);
      });
    }
  }, []);

  useEffect(() => {
    async function subscribeUser() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.ready;

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!
            ),
          });

          /* console.log("subscription", subscription) */

          // Send subscription object to your server
          await saveSubscription(JSON.stringify(subscription));

          console.log("Subscribed for push notifications:", subscription);
        } catch (error) {
          if (error instanceof Error) console.error(error.message);
        }
      }
    }

    subscribeUser()
  }, []);

  return null
}
