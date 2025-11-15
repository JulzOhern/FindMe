import { LayersControl } from 'react-leaflet'
import { TileLayer } from 'react-leaflet/TileLayer'

export function LayersControlSection() {
  return (
    <LayersControl position="bottomright">
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
  )
}
