import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Meeting = Database["public"]["Tables"]["meetings"]["Row"]
type MeetingInsert = Database["public"]["Tables"]["meetings"]["Insert"]

export interface CreateMeetingData {
  title: string
  description?: string
  meetingLink?: string
  agenda?: string
  date: string
  time: string
  duration?: number
  attendees?: string[]
}

export const meetingsApi = {
  // Create new meeting
  async createMeeting(data: CreateMeetingData, userId: string) {
    const { data: meeting, error: meetingError } = await supabase
      .from("meetings")
      .insert({
        title: data.title,
        description: data.description,
        meeting_link: data.meetingLink,
        agenda: data.agenda,
        date: data.date,
        time: data.time,
        duration: data.duration || 30,
        status: "upcoming",
        created_by: userId,
      })
      .select()
      .single()

    if (meetingError) throw meetingError

    // Add attendees
    if (data.attendees && data.attendees.length > 0) {
      const attendeeInserts = data.attendees.map((attendeeId) => ({
        meeting_id: meeting.id,
        user_id: attendeeId,
      }))

      const { error: attendeeError } = await supabase.from("meeting_attendees").insert(attendeeInserts)

      if (attendeeError) throw attendeeError
    }

    return meeting
  },

  // Get all meetings
  async getMeetings() {
    const { data, error } = await supabase
      .from("meetings")
      .select(`
        *,
        created_user:users!meetings_created_by_fkey(id, name, email),
        meeting_attendees (
          user_id,
          users (id, name, email, avatar_url)
        )
      `)
      .order("date", { ascending: true })

    if (error) throw error
    return data
  },

  // Get meeting by ID
  async getMeeting(meetingId: string) {
    const { data, error } = await supabase
      .from("meetings")
      .select(`
        *,
        created_user:users!meetings_created_by_fkey(id, name, email),
        meeting_attendees (
          user_id,
          users (id, name, email, avatar_url)
        )
      `)
      .eq("id", meetingId)
      .single()

    if (error) throw error
    return data
  },

  // Update meeting
  async updateMeeting(meetingId: string, updates: Partial<MeetingInsert>) {
    const { data, error } = await supabase
      .from("meetings")
      .update(updates)
      .eq("id", meetingId)
      .select(`
        *,
        created_user:users!meetings_created_by_fkey(id, name, email),
        meeting_attendees (
          user_id,
          users (id, name, email, avatar_url)
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  // Delete meeting
  async deleteMeeting(meetingId: string) {
    const { error } = await supabase.from("meetings").delete().eq("id", meetingId)

    if (error) throw error
  },

  // Add meeting attendee
  async addMeetingAttendee(meetingId: string, userId: string) {
    const { data, error } = await supabase
      .from("meeting_attendees")
      .insert({
        meeting_id: meetingId,
        user_id: userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Remove meeting attendee
  async removeMeetingAttendee(meetingId: string, userId: string) {
    const { error } = await supabase
      .from("meeting_attendees")
      .delete()
      .eq("meeting_id", meetingId)
      .eq("user_id", userId)

    if (error) throw error
  },

  // Get upcoming meetings for user
  async getUserUpcomingMeetings(userId: string) {
    const { data, error } = await supabase
      .from("meeting_attendees")
      .select(`
        meeting_id,
        meetings (
          id,
          title,
          description,
          meeting_link,
          agenda,
          date,
          time,
          duration,
          status,
          created_by,
          created_at
        )
      `)
      .eq("user_id", userId)
      .gte("meetings.date", new Date().toISOString().split("T")[0])
      .order("meetings.date", { ascending: true })

    if (error) throw error
    return data
  },
}
