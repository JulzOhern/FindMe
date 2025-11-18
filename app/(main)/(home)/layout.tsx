import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar';
import { getMe } from '@/GET/me'

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();

  return (
    <div>
      <Header me={me} />
      <Sidebar me={me} />
      {children}
    </div>
  )
}
