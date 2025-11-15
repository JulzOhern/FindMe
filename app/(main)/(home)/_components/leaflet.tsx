"use client"

import dynamic from 'next/dynamic'
const Map = dynamic(() => import("./map"), { ssr: false })

export function Leaflet() {
  return <Map />
}
