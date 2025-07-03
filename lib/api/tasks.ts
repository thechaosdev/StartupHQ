import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Task = Database["public"]["Tables"]["tasks"]["Row"]
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"]

export interface CreateTaskData {
  title: string
  description?: string
  status?: string
  priority?: string
  assignedTo?: string
  dueDate?: string
}

export const tasksApi = {
  // Create new task
  async createTask(data: CreateTaskData, userId: string) {
    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        title: data.title,
        description: data.description,
        status: data.status || "todo",
        priority: data.priority || "medium",
        assigned_to: data.assignedTo,
        created_by: userId,
        due_date: data.dueDate,
      })
      .select()
      .single()

    if (error) throw error
    return task
  },

  // Get all tasks
  async getTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assigned_user:users!tasks_assigned_to_fkey(id, name, email, avatar_url),
        created_user:users!tasks_created_by_fkey(id, name, email)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Get task by ID
  async getTask(taskId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assigned_user:users!tasks_assigned_to_fkey(id, name, email, avatar_url),
        created_user:users!tasks_created_by_fkey(id, name, email)
      `)
      .eq("id", taskId)
      .single()

    if (error) throw error
    return data
  },

  // Update task
  async updateTask(taskId: string, updates: Partial<TaskInsert>) {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete task
  async deleteTask(taskId: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId)

    if (error) throw error
  },

  // Get tasks by status
  async getTasksByStatus(status: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assigned_user:users!tasks_assigned_to_fkey(id, name, email, avatar_url),
        created_user:users!tasks_created_by_fkey(id, name, email)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Get tasks assigned to user
  async getUserTasks(userId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        assigned_user:users!tasks_assigned_to_fkey(id, name, email, avatar_url),
        created_user:users!tasks_created_by_fkey(id, name, email)
      `)
      .eq("assigned_to", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },
}
