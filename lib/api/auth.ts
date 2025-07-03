import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type User = Database["public"]["Tables"]["users"]["Row"]
type UserInsert = Database["public"]["Tables"]["users"]["Insert"]

export interface SignUpData {
  email: string
  password: string
  name: string
  company?: string
}

export interface SignInData {
  email: string
  password: string
}

export const authApi = {
  // Sign up new user
  async signUp(data: SignUpData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          company: data.company,
        },
      },
    })

    if (authError) throw authError

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: data.company || "Team Member",
        status: "online",
      })

      if (profileError) throw profileError
    }

    return authData
  },

  // Sign in user
  async signIn(data: SignInData) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) throw error

    // Update user status to online
    if (authData.user) {
      await supabase
        .from("users")
        .update({
          status: "online",
          last_active: new Date().toISOString(),
        })
        .eq("id", authData.user.id)
    }

    return authData
  },

  // Sign out user
  async signOut() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Update user status to offline
      await supabase.from("users").update({ status: "offline" }).eq("id", user.id)
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserInsert>) {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
