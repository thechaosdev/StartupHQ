"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function useRealtime<T>(table: string, filter?: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData)

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setData((current) => [...current, payload.new as T])
          } else if (payload.eventType === "UPDATE") {
            setData((current) => current.map((item: any) => (item.id === payload.new.id ? payload.new : item)))
          } else if (payload.eventType === "DELETE") {
            setData((current) => current.filter((item: any) => item.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter])

  return data
}
