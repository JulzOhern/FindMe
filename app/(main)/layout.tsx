import { OnlineUsersProvider } from '@/context/online-users'
import React from 'react'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <OnlineUsersProvider>
        {children}
      </OnlineUsersProvider>
    </div>
  )
}
