import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation';
import React from 'react'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) return redirect("/sign-in");

  return (
    <div>
      {children}
    </div>
  )
}
