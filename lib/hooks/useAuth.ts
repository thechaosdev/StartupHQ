"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { authApi } from "@/lib/api/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    return authApi.signIn({ email, password })
  }

  const signUp = async (email: string, password: string, name: string, company?: string) => {
    return authApi.signUp({ email, password, name, company })
  }

  const signOut = async () => {
    return authApi.signOut()
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
