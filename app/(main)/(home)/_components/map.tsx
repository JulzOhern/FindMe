import L from 'leaflet';
import { MapContainer, Marker, Popup, ZoomControl } from 'react-leaflet'
import 'leaflet-routing-machine';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { LayersControlSection } from './layers-control-section';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { RoutingMachine } from './routing-machine';
import { User } from '@/generated/prisma/client';
import { pusherClient } from '@/lib/pusher';
import { getPosition } from '@/actions/position';
import { useOnlineUsersContext } from '@/context/online-users';
import { useTrackFriendsStore } from '@/lib/zustand';
import { leafletMarkerIcon } from '@/utils/leaflet-marker-icon';

const DefaultIcon = L.icon({
  iconUrl: icon as unknown as string,
  shadowUrl: iconShadow as unknown as string,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export type PositionType = { lat: number, lng: number }

type MapProps = {
  me: User | null
}

export default function Map({ me }: MapProps) {
  const { onlineUsers, setOnlineUsers } = useOnlineUsersContext();
  const userIdToTrack = useTrackFriendsStore(s => s.userId);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        getPosition(latitude, longitude)
      },
      (err) => console.error(err),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 5000 }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  useEffect(() => {
    const channel = pusherClient.subscribe("position-update")

    channel.bind("position", (data: any) => {
      setOnlineUsers(prev =>
        prev.map(u => u.id === data.userId ? { ...u, lat: data.lat, lng: data.lng } : u)
      );
    })

    return () => {
      channel.unbind("position")
      pusherClient.unsubscribe("position-update")
    }
  }, []);

  const myPosition = useMemo(() => {
    const myPosition = onlineUsers.find(u => u.id === me?.id);
    if (!myPosition?.lat || !myPosition.lng) return null
    return { lat: myPosition.lat || 0, lng: myPosition.lng };
  }, [onlineUsers, me?.id]);

  const friendPosition = useMemo(() => {
    const friend = onlineUsers.find(u => u.id === userIdToTrack);
    if (!friend?.lat || !friend.lng) return null
    return { ...friend, latLng: { lat: friend.lat, lng: friend.lng } }
  }, [onlineUsers, userIdToTrack]);

  const myIcon = leafletMarkerIcon(me?.image);
  const friendIcon = leafletMarkerIcon(friendPosition?.image);

  return (
    <>
      {myPosition && (
        <MapContainer
          style={{ minHeight: '100vh' }}
          center={[myPosition.lat, myPosition.lng]}
          zoom={13}
          zoomControl={false}
          scrollWheelZoom={true}
          fadeAnimation
        >
          {!friendPosition && (
            <Marker
              position={[myPosition.lat, myPosition.lng]}
              icon={myIcon}
            >
              <Popup>
                <b>You are here!</b>
              </Popup>
            </Marker>
          )}

          {friendPosition && (
            <RoutingMachine
              waypoints={[myPosition, friendPosition.latLng]}
              myIcon={myIcon}
              friendIcon={friendIcon}
              myMarkerText={`<b>${me?.name} (you)</b><br />You are here!`}
              friendMarkerText={`<b>${friendPosition.name}</b> (friend)<br />Your friend is here!`}
            />
          )}

          <ZoomControl position='bottomleft' />
          <LayersControlSection />
        </MapContainer>
      )}
    </>
  )
}