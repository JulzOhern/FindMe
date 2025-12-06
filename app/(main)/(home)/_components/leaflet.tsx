"use client"

import { User } from '@/generated/prisma/client'
import dynamic from 'next/dynamic'
const Map = dynamic(() => import("./map"), { ssr: false })

type LeafletProps = {
  me: User | null
}

export function Leaflet({ me }: LeafletProps) {
  return <Map me={me} />
}
