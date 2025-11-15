"use client"

import { LatLngExpression } from 'leaflet'
import L from 'leaflet';
import { LayersControl, MapContainer, Marker, Popup } from 'react-leaflet'
import { TileLayer } from 'react-leaflet/TileLayer'

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon as unknown as string,
  shadowUrl: iconShadow as unknown as string,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map() {
  const center: LatLngExpression | undefined = [51.505, -0.09]

  return (
    <>
      <MapContainer
        style={{ flex: 1 }}
        center={center}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />

        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>

        <LayersControl position="topright">
          {/* Google Maps – Street Map */}
          <LayersControl.BaseLayer checked name="Google Maps - Street">
            <TileLayer
              attribution="&copy; Google Maps"
              url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>

          {/* Google Maps – Satellite */}
          <LayersControl.BaseLayer name="Google Maps - Satellite">
            <TileLayer
              attribution="&copy; Google Maps"
              url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>

          {/* Google Maps – Hybrid (Satellite + Labels) */}
          <LayersControl.BaseLayer name="Google Maps - Hybrid">
            <TileLayer
              attribution="&copy; Google Maps"
              url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>

          {/* Google Maps – Terrain */}
          <LayersControl.BaseLayer name="Google Maps - Terrain">
            <TileLayer
              attribution="&copy; Google Maps"
              url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>

          {/* OpenStreetMap */}
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
      </MapContainer>
    </>
  )
}
