"use client"

import type { ReactNode } from 'react'
import { UserContext } from '@/components/context/userContext'
import type { User } from '@supabase/supabase-js'

type UserProviderProps = {
  user: User
  children: ReactNode
}

export function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}