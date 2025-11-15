"use client"

import { LatLngExpression } from 'leaflet'
import L from 'leaflet';
import { MapContainer, Marker, Popup } from 'react-leaflet'

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { LayersControlSection } from './layers-control-section';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

let DefaultIcon = L.icon({
  iconUrl: icon as unknown as string,
  shadowUrl: iconShadow as unknown as string,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map() {
  const [position, setPosition] = useState<LatLngExpression | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setPosition([latitude, longitude])
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  if (!position) return null

  return (
    <>
      <MapContainer
        style={{ flex: 1 }}
        center={position}
        zoom={13}
        scrollWheelZoom={true}
      >
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>

        <LayersControlSection />
      </MapContainer>
    </>
  )
}
