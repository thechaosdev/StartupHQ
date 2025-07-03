"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageSquare, Video, CheckSquare, Calendar, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { CreateBoardModal } from "@/components/create-board-modal"
import { TopNavigation } from "@/components/top-navigation"

const mockData = {
  teamSummary: {
    totalMembers: 8,
    activeToday: 6,
    tasksCompleted: 12,
    meetingsToday: 3,
  },
  todaysTasks: [
    { id: 1, title: "Review design mockups", assignee: "Alice", priority: "high", dueTime: "2:00 PM" },
    { id: 2, title: "Update documentation", assignee: "Bob", priority: "medium", dueTime: "4:00 PM" },
    { id: 3, title: "Client call preparation", assignee: "Carol", priority: "high", dueTime: "5:00 PM" },
  ],
  recentMeetings: [
    { id: 1, title: "Daily Standup", date: "Today 9:00 AM", notes: "Discussed sprint progress and blockers" },
    { id: 2, title: "Product Review", date: "Yesterday 3:00 PM", notes: "Reviewed Q4 roadmap priorities" },
  ],
  upcomingEvents: [
    { id: 1, title: "Team Retrospective", time: "Tomorrow 10:00 AM", type: "meeting" },
    { id: 2, title: "Project Deadline", time: "Friday", type: "deadline" },
  ],
}

export default function Dashboard() {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("showCreateBoard") === "true") {
      setShowCreateBoardModal(true)
    }
  }, [searchParams])

  return (
    <>
      <TopNavigation />
      <main className="pt-16 md:pt-20">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Good morning! 👋</h1>
              <p className="text-sm md:text-base text-muted-foreground">Here's what's happening with your team today</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href="/tasks">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Quick Add Task</span>
                  <span className="sm:hidden">Add Task</span>
                </Link>
              </Button>
              {/* <Button variant="outline" asChild size="sm" className="w-full sm:w-auto bg-transparent">
                <Link href="/meet">
                  <Video className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Start Meeting</span>
                  <span className="sm:hidden">Meet</span>
                </Link>
              </Button> */}
            </div>
          </div>

          {/* Team Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Team Members</CardTitle>
                <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{mockData.teamSummary.totalMembers}</div>
                <p className="text-xs text-muted-foreground">{mockData.teamSummary.activeToday} active today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Tasks Done</CardTitle>
                <CheckSquare className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{mockData.teamSummary.tasksCompleted}</div>
                <p className="text-xs text-muted-foreground">+2 from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Meetings</CardTitle>
                <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{mockData.teamSummary.meetingsToday}</div>
                <p className="text-xs text-muted-foreground">2 done, 1 upcoming</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Productivity</CardTitle>
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">+5% from last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckSquare className="h-4 w-4 md:h-5 md:w-5" />
                  Today's Tasks
                </CardTitle>
                <CardDescription>Your team's focus for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockData.todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">{task.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Assigned to {task.assignee}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                        {task.priority}
                      </Badge>
                      <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">{task.dueTime}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/tasks">View All Tasks</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockData.recentMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-3 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                      <p className="font-medium text-sm md:text-base">{meeting.title}</p>
                      <span className="text-xs md:text-sm text-muted-foreground">{meeting.date}</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">{meeting.notes}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/docs">View Meeting Notes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Don't miss these important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockData.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div
                      className={`h-3 w-3 rounded-full flex-shrink-0 ${event.type === "meeting" ? "bg-blue-500" : "bg-orange-500"}`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">{event.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Board Modal */}
        <CreateBoardModal open={showCreateBoardModal} onOpenChange={setShowCreateBoardModal} />
      </main>
    </>
  )
}
