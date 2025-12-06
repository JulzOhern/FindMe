"use client"

import { User } from "@/generated/prisma/client"
import dynamic from "next/dynamic"
const Map = dynamic(() => import("./map"), { ssr: false });

type LeafletProps = {
  user: User | null
  me: User | null
}

export function Leaflet({ user, me }: LeafletProps) {
  return (
    <Map user={user} me={me} />
  )
}
