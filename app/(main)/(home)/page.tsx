import { getMe } from "@/GET/me";
import { Leaflet } from "./_components/leaflet";

export default async function HomePage() {
  const me = await getMe();

  return (
    <div>
      <Leaflet me={me} />
    </div>
  )
}
