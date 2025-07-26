"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Calendar, CheckSquare, Users, Plus } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/lib/hooks/useAuth"
import { useRouter } from "next/navigation"


export default function TeamPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const supabase = createClientComponentClient()
  const [tasks, setTasks] = useState<any[]>([])


  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*")
      if (!error && data) setTeamMembers(data)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const { data: taskData } = await supabase
        .from("tasks")
        .select("*, assigned_user:users!tasks_assigned_to_fkey(id, name)")
        .limit(3)
      setTasks(taskData || [])
    }
    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "away":
        return "Away"
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  return (
    <>
      <TopNavigation />
      <main className="pt-16 md:pt-20">
        <div className="p-3 md:p-6 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Team</h1>
              <p className="text-sm md:text-base text-muted-foreground">Manage your team members and collaboration</p>
            </div>

            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Total Members</CardTitle>
                <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{teamMembers.length}</div>
                {/* <p className="text-xs text-muted-foreground">
                  {teamMembers.filter((m) => m.status === "online").length} online now
                </p> */}
                <p className="text-xs text-muted-foreground">
                Total team members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Tasks Done</CardTitle>
                <CheckSquare className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* <div className="text-xl md:text-2xl font-bold">
                  {teamMembers.reduce((sum, member) => sum + (member.tasksCompleted || 0), 0)}
                </div> */}
                <div className="text-xl md:text-2xl font-bold">{tasks.filter((t) => t.status === "done").length}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Active Tasks</CardTitle>
                <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* <div className="text-xl md:text-2xl font-bold">
                  {teamMembers.reduce((sum, member) => sum + (member.tasksInProgress || 0), 0)}
                </div> */}
                <div className="text-xl md:text-2xl font-bold">{tasks.filter((t) => t.status === "in-progress").length}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Productivity</CardTitle>
                <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">No data</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold">Team Members</h2>

            {loading ? (
              <div className="text-center text-muted-foreground py-8">Loading...</div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No team members found.</div>
            ) : (
              <div className="grid gap-4">
                {teamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="relative flex-shrink-0 self-center sm:self-start">
                          <Avatar className="h-12 w-12 md:h-16 md:w-16">
                            <AvatarFallback>
                              {member.name
                                ? member.name.split(" ").map((n: string) => n[0]).join("")
                                : "--"}
                            </AvatarFallback>
                          </Avatar>
                          {/* <div
                            className={`absolute -bottom-1 -right-1 h-3 w-3 md:h-4 md:w-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                          ></div> */}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-base md:text-lg truncate">{member.name}</h3>
                              <p className="text-sm md:text-base text-muted-foreground">{member.role}</p>
                              <p className="text-xs md:text-sm text-muted-foreground truncate">{member.email}</p>
                            </div>

                            {/* <div className="flex flex-col sm:items-end gap-1">
                            <div className="space-y-2">
                              <p className="text-xs md:text-sm font-medium">Actions</p>
                              <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  Chat
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs bg-transparent"
                                  disabled
                                >
                                  <Mail className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  Email
                                </Button>
                              </div>
                            </div>
                              
                            </div> */}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* <div className="space-y-2">
                              <p className="text-xs md:text-sm font-medium">Skills</p>
                              <div className="flex flex-wrap gap-1">
                                {(member.skills || []).map((skill: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div> */}

                            {/* <div className="space-y-2">
                              <p className="text-xs md:text-sm font-medium">Tasks</p>
                              <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
                                <span className="text-green-600">{member.tasksCompleted || 0} completed</span>
                                <span className="text-blue-600">{member.tasksInProgress || 0} in progress</span>
                              </div>
                            </div> */}

                       
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}