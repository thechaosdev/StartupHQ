"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckSquare, Calendar, Users, TrendingUp, FileText } from "lucide-react"
import Link from "next/link"
import { CreateBoardModal } from "@/components/create-board-modal"
import { TopNavigation } from "@/components/top-navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/lib/hooks/useAuth"
import { useRouter } from "next/navigation"


export default function Dashboard() {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (searchParams.get("showCreateBoard") === "true") {
      setShowCreateBoardModal(true)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: userData } = await supabase.from("users").select("*")
      setUsers(userData || [])
      const today = new Date().toISOString().split("T")[0]
      const { data: taskData } = await supabase
        .from("tasks")
        .select("*, assigned_user:users!tasks_assigned_to_fkey(id, name)")
        .limit(3)
      setTasks(taskData || [])
      const { data: docData } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)
      setDocuments(docData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

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
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Team Members</CardTitle>
                <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Total team members</p>
                {/* <p className="text-xs text-muted-foreground">{users.filter((u) => u.status === "online").length} active today</p> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Tasks Done</CardTitle>
                <CheckSquare className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{tasks.filter((t) => t.status === "done").length}</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Meetings</CardTitle>
                <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">No data</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Productivity</CardTitle>
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">No data</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckSquare className="h-4 w-4 md:h-5 md:w-5" />
                  Today's Tasks
                </CardTitle>
                <CardDescription>Your team's focus for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-muted-foreground">No tasks for today.</div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm md:text-base truncate">{task.title}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Assigned to {task.assigned_user?.name || "Unassigned"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                          {task.priority}
                        </Badge>
                        <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                          {task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/tasks">View All Tasks</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-4 w-4 md:h-5 md:w-5" />
                  Recent Documents
                </CardTitle>
                <CardDescription>Latest docs from your team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.length === 0 ? (
                  <div className="text-muted-foreground">No documents found.</div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="p-3 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                        <p className="font-medium text-sm md:text-base">{doc.title}</p>
                        <span className="text-xs md:text-sm text-muted-foreground">
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{doc.content?.slice(0, 100)}...</p>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/docs">View Documents</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Don't miss these important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="text-muted-foreground">(Connect events table for real data)</div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <CreateBoardModal open={showCreateBoardModal} onOpenChange={setShowCreateBoardModal} />
      </main>
    </>
  )
}
