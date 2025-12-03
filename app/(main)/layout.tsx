import { RegisterServiceWorker } from '@/components/register-service-worker'
import { OnlineUsersProvider } from '@/context/online-users'
import React from 'react'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <OnlineUsersProvider>
        <RegisterServiceWorker />
        {children}
      </OnlineUsersProvider>
    </div>
  )
}
