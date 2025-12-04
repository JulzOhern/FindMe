import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar';
import { getMe } from '@/GET/me'
import { getNotifications } from '@/GET/notifications';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();
  const notifications = await getNotifications();

  return (
    <div>
      <Header me={me} notifications={notifications} />
      <Sidebar me={me} />
      {children}
    </div>
  )
}
