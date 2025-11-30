import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Toaster } from "@/components/ui/sonner";
import { TanstackQueryProvider } from "@/components/tanstack-query-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FindMe - Connect, Track, Stay Close",
  description: "FindMe is a social connection app that lets you add friends, share your location with trusted people, and see where your friends are in real time. Stay connected, stay safe, and stay closer with the people who matter most.",
  keywords: [
    "FindMe",
    "friend tracker",
    "social app",
    "location sharing",
    "real-time tracking",
    "add friends",
    "friend requests",
    "location app",
    "connect with friends",
    "friend network",
    "track friends safely",
    "social networking",
    "map tracking",
    "geolocation app",
    "friend locator",
    "interactive map",
    "location-based social",
    "online friends",
    "location privacy",
    "FindMe app"
  ],
  openGraph: {
    title: "FindMe - Connect, Track, Stay Close",
    description: "FindMe is a social connection app that lets you add friends, share your location with trusted people, and see where your friends are in real time. Stay connected, stay safe, and stay closer with the people who matter most.",
    siteName: "FindMe",
  },
  twitter: {
    card: 'summary_large_image',
    title: "FindMe - Connect, Track, Stay Close",
    description: "FindMe is a social connection app that lets you add friends, share your location with trusted people, and see where your friends are in real time. Stay connected, stay safe, and stay closer with the people who matter most."
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
          */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <main>
          <TanstackQueryProvider>
            {children}
          </TanstackQueryProvider>
        </main>
        <Toaster
          position="top-center"
          richColors
        />
      </body>
    </html>
  );
}
