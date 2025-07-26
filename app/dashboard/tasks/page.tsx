"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, User, List, LayoutGrid, GripVertical } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"
import { tasksApi } from "@/lib/api/tasks"
import { useAuth } from "@/lib/hooks/useAuth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const statusColumns = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

export default function TasksPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [tasks, setTasks] = useState<any[]>([])
  const [view, setView] = useState<"kanban" | "list">("kanban")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [currentTask, setCurrentTask] = useState<any>(null)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    dueDate: "",
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [users, setUsers] = useState<any[]>([])
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [longPressTaskId, setLongPressTaskId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (selectedDate) {
      setNewTask(prev => ({
        ...prev,
        dueDate: format(selectedDate, "yyyy-MM-dd")
      }))
    }
  }, [selectedDate])

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user?.id) return
      
      // Check localStorage first for cached plan
      const cachedPlan = localStorage.getItem('userPlan')
      if (cachedPlan) {
        setUserPlan(cachedPlan)
      }
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single()
        
        const plan = profile?.plan || "free"
        setUserPlan(plan)
        localStorage.setItem('userPlan', plan)
      } catch (err) {
        console.error("Error fetching user plan:", err)
        setUserPlan("free")
      }
    }

    const fetchData = async () => {
      try {
        await Promise.all([
          fetchUserPlan(),
          
          // Fetch tasks
          (async () => {
            const tasksData = await tasksApi.getTasks()
            const tasksWithUsers = await Promise.all(tasksData.map(async (task: any) => {
              if (task.assigned_to) {
                const { data: user } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', task.assigned_to)
                  .single()
                return { ...task, assigned_user: user }
              }
              return task
            }))
            setTasks(tasksWithUsers)
          })(),
          
          // Fetch users
          (async () => {
            const { data: usersData } = await supabase.from("users").select("*")
            setUsers(usersData || [])
          })()
        ])
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [user?.id])

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
      
      if (created.assigned_to) {
        const { data: assignedUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', created.assigned_to)
          .single()
        created.assigned_user = assignedUser
      }
      
      setTasks([...tasks, created])
      setNewTask({
        title: "",
        description: "",
        assignee: "",
        priority: "medium",
        dueDate: "",
      })
      setSelectedDate(undefined)
      setIsAddingTask(false)
    } catch (err) {
      console.error("Error creating task:", err)
    }
  }

  const handleEditTask = async () => {
    if (!currentTask?.title.trim() || !currentTask?.id) return
    
    try {
      const updated = await tasksApi.updateTask(currentTask.id, {
        title: currentTask.title,
        description: currentTask.description,
        priority: currentTask.priority,
        assignedTo: currentTask.assigned_to,
        dueDate: currentTask.due_date,
      })
      
      if (updated.assigned_to) {
        const { data: assignedUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', updated.assigned_to)
          .single()
        updated.assigned_user = assignedUser
      }
      
      setTasks(tasks.map(task => task.id === updated.id ? updated : task))
      setIsEditingTask(false)
      setCurrentTask(null)
    } catch (err) {
      console.error("Error updating task:", err)
    }
  }

  const handleDeleteTask = async () => {
    if (!longPressTaskId) return
    
    try {
      await tasksApi.deleteTask(longPressTaskId)
      setTasks(tasks.filter(task => task.id !== longPressTaskId))
      setLongPressTaskId(null)
      setShowDeleteDialog(false)
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  const moveTask = async (taskId: string, newStatus: string) => {
    try {
      const updated = await tasksApi.updateTask(taskId, { status: newStatus })
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
    } catch (err) {
      console.error("Error moving task:", err)
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
    const rect = e.currentTarget.getBoundingClientRect()
    const { clientX, clientY } = e
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (draggedTask) {
      await moveTask(draggedTask, columnId)
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleTaskDoubleClick = (task: any) => {
    setCurrentTask(task)
    setIsEditingTask(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "default"
    }
  }

  const userTaskCount = user?.id ? tasks.filter(task => task.created_by === user.id).length : 0
  const isFreePlanLimitReached = userPlan === "free" && userTaskCount >= 5

  // Loading state
  if (userPlan === null) {
    return (
      <>
        <TopNavigation />
        <main className="pt-16 md:pt-20">
          <div className="p-3 md:p-6 space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-4 w-[150px] mt-2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-[100px]" />
                <Skeleton className="h-10 w-[80px]" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {statusColumns.map((column) => (
                <div key={column.id} className="space-y-4">
                  <div className={`p-3 rounded-lg ${column.color}`}>
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-4 w-[50px] mt-1" />
                  </div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-[100px] w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    )
  }

  const TaskCard = ({ task }: { task: any }) => {
    let pressTimer: NodeJS.Timeout

    const startPress = () => {
      pressTimer = setTimeout(() => {
        setLongPressTaskId(task.id)
        setShowDeleteDialog(true)
      }, 800) // 800ms for long press
    }

    const endPress = () => {
      clearTimeout(pressTimer)
    }

    return (
      <Card
        className={`mb-3 cursor-grab hover:shadow-md transition-all ${
          draggedTask === task.id ? "opacity-50 rotate-2 scale-105" : ""
        }`}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={handleDragEnd}
        onDoubleClick={() => handleTaskDoubleClick(task)}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
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

            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 ml-6">{task.description}</p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 ml-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5 md:h-6 md:w-6">
                  <AvatarFallback className="text-xs">
                    {task.assigned_user?.name?.split(" ").map((n: string) => n[0]).join("") || "--"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">
                  {task.assigned_user?.name || "Unassigned"}
                </span>
              </div>

              {task.due_date && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {format(new Date(task.due_date), "MMM dd, yyyy")}
                  </span>
                  <span className="sm:hidden">
                    {format(new Date(task.due_date), "MMM dd")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const DropZone = ({ columnId, children }: { columnId: string; children: React.ReactNode }) => (
    <div
      className={`space-y-2 min-h-[200px] p-2 rounded-lg transition-all ${
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
              <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full sm:w-auto">
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

              {isFreePlanLimitReached ? (
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/billing")}
                >
                  Upgrade Plan to Add More Tasks
                </Button>
              ) : (
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
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          placeholder="Enter task title"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          placeholder="Enter task description"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="assignee">Assignee</Label>
                          <Select
                            value={newTask.assignee}
                            onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={newTask.priority}
                            onValueChange={(value) => setNewTask({...newTask, priority: value})}
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
                        <Label>Due Date</Label>
                        <div className="flex items-center gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !newTask.dueDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newTask.dueDate ? 
                                  format(new Date(newTask.dueDate), "PPP") : 
                                  <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                                onSelect={setSelectedDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setNewTask({...newTask, dueDate: ""})
                              setSelectedDate(undefined)
                            }}
                            className="shrink-0"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddTask}>
                          Create Task
                        </Button>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <Dialog open={isEditingTask} onOpenChange={setIsEditingTask}>
            <DialogContent className="w-[95vw] max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={currentTask?.title || ""}
                    onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={currentTask?.description || ""}
                    onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
                    placeholder="Enter task description"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-assignee">Assignee</Label>
                    <Select
                      value={currentTask?.assigned_to || ""}
                      onValueChange={(value) => setCurrentTask({...currentTask, assigned_to: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={currentTask?.priority || "medium"}
                      onValueChange={(value) => setCurrentTask({...currentTask, priority: value})}
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
                  <Label>Due Date</Label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !currentTask?.due_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {currentTask?.due_date ? 
                            format(new Date(currentTask.due_date), "PPP") : 
                            <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={currentTask?.due_date ? new Date(currentTask.due_date) : undefined}
                          onSelect={(date) => setCurrentTask({
                            ...currentTask, 
                            due_date: date ? format(date, "yyyy-MM-dd") : ""
                          })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentTask({...currentTask, due_date: ""})}
                      className="shrink-0"
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditingTask(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditTask}>
                    Update Task
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Task</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete this task?</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteTask}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {view === "kanban" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Drag and drop tasks between columns to change their status. Double-click to edit. Long press to delete.
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
                      className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-3 border rounded-lg hover:bg-accent/50"
                      onDoubleClick={() => handleTaskDoubleClick(task)}
                      onTouchStart={(e) => {
                        const timer = setTimeout(() => {
                          setLongPressTaskId(task.id)
                          setShowDeleteDialog(true)
                        }, 1000)
                        const clearTimer = () => clearTimeout(timer)
                        e.currentTarget.addEventListener('touchend', clearTimer, { once: true })
                      }}
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
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="truncate">{task.assigned_user?.name || "Unassigned"}</span>
                        </div>
                        {task.due_date && (
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="whitespace-nowrap">
                              {format(new Date(task.due_date), "MMM dd, yyyy")}
                            </span>
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