"use client"

import { useContext } from 'react'
import { UserContext } from '@/components/context/userContext'

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}