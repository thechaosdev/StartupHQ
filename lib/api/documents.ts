import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Document = Database["public"]["Tables"]["documents"]["Row"]
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"]

export interface CreateDocumentData {
  title: string
  content?: string
  type?: string
  folder?: string
}

export const documentsApi = {
  // Create new document
  async createDocument(data: CreateDocumentData, userId: string) {
    const { data: document, error } = await supabase
      .from("documents")
      .insert({
        title: data.title,
        content: data.content,
        type: data.type,
        folder: data.folder || "General",
        created_by: userId,
      })
      .select(`
        *,
        created_user:users!documents_created_by_fkey(id, name, email)
      `)
      .single()

    if (error) throw error
    return document
  },

  // Get all documents
  async getDocuments() {
    const { data, error } = await supabase
      .from("documents")
      .select(`
        *,
        created_user:users!documents_created_by_fkey(id, name, email)
      `)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Get document by ID
  async getDocument(documentId: string) {
    const { data, error } = await supabase
      .from("documents")
      .select(`
        *,
        created_user:users!documents_created_by_fkey(id, name, email)
      `)
      .eq("id", documentId)
      .single()

    if (error) throw error
    return data
  },

  // Update document
  async updateDocument(documentId: string, updates: Partial<DocumentInsert>) {
    const { data, error } = await supabase
      .from("documents")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId)
      .select(`
        *,
        created_user:users!documents_created_by_fkey(id, name, email)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Delete document
  async deleteDocument(documentId: string) {
    const { error } = await supabase.from("documents").delete().eq("id", documentId)

    if (error) throw error
  },

  // Get documents by folder
  async getDocumentsByFolder(folder: string) {
    const { data, error } = await supabase
      .from("documents")
      .select(`
        *,
        created_user:users!documents_created_by_fkey(id, name, email)
      `)
      .eq("folder", folder)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Search documents
  async searchDocuments(query: string) {
    const { data, error } = await supabase
      .from("documents")
      .select(`
        *,
        created_user:users!documents_created_by_fkey(id, name, email)
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data
  },
}
