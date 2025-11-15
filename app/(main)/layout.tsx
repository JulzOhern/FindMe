import { Header } from '@/components/header'
import { getMe } from '@/GET/me'
import React from 'react'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();

  return (
    <div>
      <Header me={me} />
      {children}
    </div>
  )
}
