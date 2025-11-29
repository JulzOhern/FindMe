"use client"

import { getPosition } from "@/actions/position";
import { requestFriendPosition } from "@/actions/request-friend-position";
import { LayersControlSection } from "@/app/(main)/(home)/_components/layers-control-section";
import { useOnlineUsersContext } from "@/context/online-users"
import { User } from "@/generated/prisma/client";
import { pusherClient } from "@/lib/pusher";
import { leafletMarkerIcon } from "@/utils/leaflet-marker-icon";
import { useEffect, useMemo } from "react";

import { MapContainer, Marker, Popup, ZoomControl } from 'react-leaflet'

type MapProps = {
  user: User | null
  me: User | null
}

export default function Map({ user, me }: MapProps) {
  const { onlineUsers } = useOnlineUsersContext();
  const userIcon = leafletMarkerIcon(user?.image);

  useEffect(() => {
    if (user?.id) {
      requestFriendPosition(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`private-friend-request-${me?.id}`);

    channel.bind("position-request", (data: any) => {
      const myPosition = onlineUsers.find(u => u.id === data.userId);
      getPosition(myPosition?.lat || 0, myPosition?.lng || 0);
    })

    return () => {
      channel.unbind("position-request")
      pusherClient.unsubscribe(`private-friend-request-${user?.id}`)
    }
  }, [onlineUsers])

  const userPosition = useMemo(() => {
    const myPosition = onlineUsers.find(u => u.id === user?.id);
    if (!myPosition?.lat || !myPosition.lng) return null
    return { lat: myPosition.lat || 0, lng: myPosition.lng };
  }, [onlineUsers, user?.id]);

  const isOffline = !onlineUsers.some((u) => u.id === user?.id);

  if (isOffline) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 px-6 py-12 rounded-3xl border bg-card shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shadow-inner">
          <div className="w-3 h-3 rounded-full bg-red-500" />
        </div>

        <h2 className="text-xl font-semibold mt-6">This user is currently offline</h2>

        <p className="text-muted-foreground mt-2 max-w-sm">
          Their live location can't be shown at the moment.
          You can view their location in the map once they are online.
        </p>

        <button
          onClick={() => location.reload()}
          className="mt-6 px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {userPosition?.lat && userPosition.lng && (
        <MapContainer
          style={{ aspectRatio: 16 / 9 }}
          center={[userPosition.lat, userPosition.lng]}
          zoom={13}
          zoomControl={false}
          scrollWheelZoom={true}
          fadeAnimation
        >
          <Marker
            position={[userPosition.lat, userPosition.lng]}
            icon={userIcon}
          >
            <Popup>
              <b>{user?.name}</b> (friend)<br />Your friend is here!
            </Popup>
          </Marker>

          <ZoomControl position='bottomleft' />
          <LayersControlSection />
        </MapContainer>
      )}
    </div>
  )
}
