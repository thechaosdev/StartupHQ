import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type User = Database["public"]["Tables"]["users"]["Row"]
type UserInsert = Database["public"]["Tables"]["users"]["Insert"]

export const usersApi = {
  // Get all users
  async getUsers() {
    const { data, error } = await supabase.from("users").select("*").order("name", { ascending: true })

    if (error) throw error
    return data
  },

  // Get user by ID
  async getUser(userId: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  },

  // Update user
  async updateUser(userId: string, updates: Partial<UserInsert>) {
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

  // Update user status
  async updateUserStatus(userId: string, status: string) {
    const { data, error } = await supabase
      .from("users")
      .update({
        status,
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Search users
  async searchUsers(query: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order("name", { ascending: true })

    if (error) throw error
    return data
  },

  // Get online users
  async getOnlineUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("status", "online")
      .order("name", { ascending: true })

    if (error) throw error
    return data
  },

  // Subscribe to user status changes
  subscribeToUserStatus(callback: (user: any) => void) {
    return supabase
      .channel("user-status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
        },
        callback,
      )
      .subscribe()
  },
}
