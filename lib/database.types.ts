export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string | null
          avatar_url: string | null
          status: string
          last_active: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: string | null
          avatar_url?: string | null
          status?: string
          last_active?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string | null
          avatar_url?: string | null
          status?: string
          last_active?: string
          created_at?: string
          updated_at?: string
        }
      }
      channels: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          created_by?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          channel_id: string
          user_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          user_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          user_id?: string | null
          content?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string
          priority: string
          assigned_to: string | null
          created_by: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          assigned_to?: string | null
          created_by?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          assigned_to?: string | null
          created_by?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          content: string | null
          type: string | null
          folder: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          type?: string | null
          folder?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          type?: string | null
          folder?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          title: string
          description: string | null
          meeting_link: string | null
          agenda: string | null
          notes: string | null
          date: string
          time: string
          duration: number
          status: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          meeting_link?: string | null
          agenda?: string | null
          notes?: string | null
          date: string
          time: string
          duration?: number
          status?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          meeting_link?: string | null
          agenda?: string | null
          notes?: string | null
          date?: string
          time?: string
          duration?: number
          status?: string
          created_by?: string | null
          created_at?: string
        }
      }
      meeting_attendees: {
        Row: {
          meeting_id: string
          user_id: string
        }
        Insert: {
          meeting_id: string
          user_id: string
        }
        Update: {
          meeting_id?: string
          user_id?: string
        }
      }
      channel_members: {
        Row: {
          channel_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          channel_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          channel_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      boards: {
        Row: {
          id: string
          name: string
          description: string | null
          template: string
          team_size: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          template: string
          team_size?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          template?: string
          team_size?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      board_members: {
        Row: {
          board_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          board_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          board_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
