import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Board = Database["public"]["Tables"]["boards"]["Row"]
type BoardInsert = Database["public"]["Tables"]["boards"]["Insert"]
type BoardMember = Database["public"]["Tables"]["board_members"]["Row"]

export interface CreateBoardData {
  name: string
  description?: string
  template: string
  teamSize?: string
}

export const boardsApi = {
  // Create new board
  async createBoard(data: CreateBoardData, userId: string) {
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .insert({
        name: data.name,
        description: data.description,
        template: data.template,
        team_size: data.teamSize,
        created_by: userId,
      })
      .select()
      .single()

    if (boardError) throw boardError

    // Add creator as board admin
    const { error: memberError } = await supabase.from("board_members").insert({
      board_id: board.id,
      user_id: userId,
      role: "admin",
    })

    if (memberError) throw memberError

    return board
  },

  // Get user's boards
  async getUserBoards(userId: string) {
    const { data, error } = await supabase
      .from("board_members")
      .select(`
        board_id,
        role,
        joined_at,
        boards (
          id,
          name,
          description,
          template,
          team_size,
          created_by,
          created_at,
          updated_at
        )
      `)
      .eq("user_id", userId)

    if (error) throw error
    return data
  },

  // Get board by ID
  async getBoard(boardId: string) {
    const { data, error } = await supabase.from("boards").select("*").eq("id", boardId).single()

    if (error) throw error
    return data
  },

  // Update board
  async updateBoard(boardId: string, updates: Partial<BoardInsert>) {
    const { data, error } = await supabase
      .from("boards")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", boardId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete board
  async deleteBoard(boardId: string) {
    const { error } = await supabase.from("boards").delete().eq("id", boardId)

    if (error) throw error
  },

  // Add member to board
  async addBoardMember(boardId: string, userId: string, role = "member") {
    const { data, error } = await supabase
      .from("board_members")
      .insert({
        board_id: boardId,
        user_id: userId,
        role,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get board members
  async getBoardMembers(boardId: string) {
    const { data, error } = await supabase
      .from("board_members")
      .select(`
        board_id,
        user_id,
        role,
        joined_at,
        users (
          id,
          email,
          name,
          role,
          avatar_url,
          status,
          last_active
        )
      `)
      .eq("board_id", boardId)

    if (error) throw error
    return data
  },

  // Remove member from board
  async removeBoardMember(boardId: string, userId: string) {
    const { error } = await supabase.from("board_members").delete().eq("board_id", boardId).eq("user_id", userId)

    if (error) throw error
  },
}
