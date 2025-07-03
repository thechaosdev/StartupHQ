import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Message = Database["public"]["Tables"]["messages"]["Row"]
type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"]
type Channel = Database["public"]["Tables"]["channels"]["Row"]

export interface CreateMessageData {
  channelId: string
  content: string
}

export interface CreateChannelData {
  name: string
  description?: string
  type?: string
}

export const messagesApi = {
  // Create new message
  async createMessage(data: CreateMessageData, userId: string) {
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        channel_id: data.channelId,
        user_id: userId,
        content: data.content,
      })
      .select(`
        *,
        user:users(id, name, email, avatar_url)
      `)
      .single()

    if (error) throw error
    return message
  },

  // Get messages for channel
  async getChannelMessages(channelId: string, limit = 50) {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        user:users(id, name, email, avatar_url)
      `)
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true })
      .limit(limit)

    if (error) throw error
    return data
  },

  // Create new channel
  async createChannel(data: CreateChannelData, userId: string) {
    const { data: channel, error: channelError } = await supabase
      .from("channels")
      .insert({
        name: data.name,
        description: data.description,
        type: data.type || "channel",
        created_by: userId,
      })
      .select()
      .single()

    if (channelError) throw channelError

    // Add creator to channel
    const { error: memberError } = await supabase.from("channel_members").insert({
      channel_id: channel.id,
      user_id: userId,
    })

    if (memberError) throw memberError

    return channel
  },

  // Get user's channels
  async getUserChannels(userId: string) {
    const { data, error } = await supabase
      .from("channel_members")
      .select(`
        channel_id,
        joined_at,
        channels (
          id,
          name,
          description,
          type,
          created_by,
          created_at
        )
      `)
      .eq("user_id", userId)

    if (error) throw error
    return data
  },

  // Add user to channel
  async addChannelMember(channelId: string, userId: string) {
    const { data, error } = await supabase
      .from("channel_members")
      .insert({
        channel_id: channelId,
        user_id: userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get channel members
  async getChannelMembers(channelId: string) {
    const { data, error } = await supabase
      .from("channel_members")
      .select(`
        channel_id,
        user_id,
        joined_at,
        users (
          id,
          name,
          email,
          avatar_url,
          status
        )
      `)
      .eq("channel_id", channelId)

    if (error) throw error
    return data
  },

  // Subscribe to new messages in channel
  subscribeToMessages(channelId: string, callback: (message: any) => void) {
    return supabase
      .channel(`messages:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        callback,
      )
      .subscribe()
  },
}
