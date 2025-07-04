"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Calendar, User, List, LayoutGrid, GripVertical } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"
import { tasksApi } from "@/lib/api/tasks"
import { useAuth } from "@/lib/hooks/useAuth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

const statusColumns = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

export default function TasksPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [view, setView] = useState<"kanban" | "list">("kanban")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    dueDate: "",
  })
  const [users, setUsers] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await tasksApi.getTasks()
        setTasks(data)
      } catch (err) {
      }
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*")
      if (!error) setUsers(data)
    }
    fetchUsers()
  }, [])

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !user) return
    try {
      const created = await tasksApi.createTask(
        {
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          assignedTo: newTask.assignee,
          dueDate: newTask.dueDate,
        },
        user.id
      )
      setTasks([...tasks, created])
      setNewTask({
        title: "",
        description: "",
        assignee: "",
        priority: "medium",
        dueDate: "",
      })
      setIsAddingTask(false)
    } catch (err) {
    }
  }

  const moveTask = async (taskId: string, newStatus: string) => {
    try {
      const updated = await tasksApi.updateTask(taskId, { status: newStatus })
      setTasks(tasks.map((task) => (task.id === taskId ? updated : task)))
    } catch (err) {
    }
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (columnId: string) => {
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (draggedTask !== null) {
      await moveTask(draggedTask, columnId)
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const TaskCard = ({ task }: { task: any }) => (
    <Card
      className={`mb-3 cursor-grab hover:shadow-md transition-all duration-200 ${
        draggedTask === task.id ? "opacity-50 rotate-2 scale-105" : ""
      }`}
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-3 md:p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <h3 className="font-medium text-sm leading-tight flex-1">{task.title}</h3>
            </div>
            <Badge variant={getPriorityColor(task.priority)} className="text-xs flex-shrink-0">
              {task.priority}
            </Badge>
          </div>

          {task.description && <p className="text-xs text-muted-foreground line-clamp-2 ml-6">{task.description}</p>}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 ml-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5 md:h-6 md:w-6">
                <AvatarFallback className="text-xs">
                  {task.assigned_user?.name
                    ? task.assigned_user.name.split(" ").map((n: string) => n[0]).join("")
                    : "--"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">{task.assigned_user?.name || "Unassigned"}</span>
            </div>

            {task.due_date && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span className="hidden sm:inline">{new Date(task.due_date).toLocaleDateString()}</span>
                <span className="sm:hidden">
                  {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const DropZone = ({ columnId, children }: { columnId: string; children: React.ReactNode }) => (
    <div
      className={`space-y-2 min-h-[200px] p-2 rounded-lg transition-all duration-200 ${
        dragOverColumn === columnId ? "bg-blue-50 border-2 border-blue-300 border-dashed" : ""
      }`}
      onDragOver={handleDragOver}
      onDragEnter={() => handleDragEnter(columnId)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, columnId)}
    >
      {children}
      {dragOverColumn === columnId && (
        <div className="flex items-center justify-center h-16 border-2 border-blue-300 border-dashed rounded-lg bg-blue-50">
          <p className="text-sm text-blue-600 font-medium">Drop task here</p>
        </div>
      )}
    </div>
  )

  if (loading || (!user && !loading)) return null;

  return (
    <>
      <TopNavigation />
      <main className="pt-16 md:pt-20">
        <div className="p-3 md:p-6 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Tasks</h1>
              <p className="text-sm md:text-base text-muted-foreground">Manage your team's work</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "list")} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                  <TabsTrigger value="kanban" className="flex items-center gap-2 text-xs md:text-sm">
                    <LayoutGrid className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Kanban</span>
                    <span className="sm:hidden">Board</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2 text-xs md:text-sm">
                    <List className="h-3 w-3 md:h-4 md:w-4" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add Task</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Enter task description"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="assignee">Assignee</Label>
                        <Select
                          value={newTask.assignee}
                          onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((u) => (
                              <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddingTask(false)} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                      <Button onClick={handleAddTask} className="w-full sm:w-auto">
                        Create Task
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Drag and Drop Instructions */}
          {view === "kanban" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Drag and drop tasks between columns to change their status. Use the grip handle
                (⋮⋮) to drag tasks.
              </p>
            </div>
          )}

          {view === "kanban" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {statusColumns.map((column) => (
                <div key={column.id} className="space-y-4">
                  <div className={`p-3 rounded-lg ${column.color}`}>
                    <h2 className="font-semibold text-sm">{column.title}</h2>
                    <span className="text-xs text-muted-foreground">
                      {tasks.filter((task) => task.status === column.id).length} tasks
                    </span>
                  </div>

                  <DropZone columnId={column.id}>
                    {tasks
                      .filter((task) => task.status === column.id)
                      .map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                  </DropZone>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm md:text-base">{task.title}</h3>
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {statusColumns.find((col) => col.id === task.status)?.title}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="truncate">{task.assigned_user?.name || "Unassigned"}</span>
                        </div>
                        {task.due_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="whitespace-nowrap">{new Date(task.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}