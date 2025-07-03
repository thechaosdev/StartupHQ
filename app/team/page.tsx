import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Calendar, CheckSquare, Users, Plus } from "lucide-react"
import { TopNavigation } from "@/components/top-navigation"

// Mock data
const teamMembers = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Product Designer",
    email: "alice@company.com",
    status: "online",
    tasksCompleted: 12,
    tasksInProgress: 3,
    lastActive: "Active now",
    skills: ["UI/UX", "Figma", "Prototyping"],
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Full Stack Developer",
    email: "bob@company.com",
    status: "online",
    tasksCompleted: 18,
    tasksInProgress: 2,
    lastActive: "Active now",
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: 3,
    name: "Carol Davis",
    role: "Technical Writer",
    email: "carol@company.com",
    status: "away",
    tasksCompleted: 8,
    tasksInProgress: 4,
    lastActive: "2 hours ago",
    skills: ["Documentation", "API Docs", "Technical Writing"],
  },
  {
    id: 4,
    name: "David Wilson",
    role: "DevOps Engineer",
    email: "david@company.com",
    status: "offline",
    tasksCompleted: 15,
    tasksInProgress: 1,
    lastActive: "Yesterday",
    skills: ["AWS", "Docker", "CI/CD"],
  },
]

export default function TeamPage() {
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

          {/* Team Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Total Members</CardTitle>
                <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{teamMembers.length}</div>
                <p className="text-xs text-muted-foreground">
                  {teamMembers.filter((m) => m.status === "online").length} online now
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Tasks Done</CardTitle>
                <CheckSquare className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0)}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Active Tasks</CardTitle>
                <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {teamMembers.reduce((sum, member) => sum + member.tasksInProgress, 0)}
                </div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">Productivity</CardTitle>
                <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">Team average</p>
              </CardContent>
            </Card>
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold">Team Members</h2>

            <div className="grid gap-4">
              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="relative flex-shrink-0 self-center sm:self-start">
                        <Avatar className="h-12 w-12 md:h-16 md:w-16">
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 h-3 w-3 md:h-4 md:w-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                        ></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base md:text-lg truncate">{member.name}</h3>
                            <p className="text-sm md:text-base text-muted-foreground">{member.role}</p>
                            <p className="text-xs md:text-sm text-muted-foreground truncate">{member.email}</p>
                          </div>

                          <div className="flex flex-col sm:items-end gap-1">
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              <div className={`h-2 w-2 rounded-full ${getStatusColor(member.status)}`}></div>
                              <span className="text-xs">{getStatusText(member.status)}</span>
                            </Badge>
                            <span className="text-xs text-muted-foreground">{member.lastActive}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <p className="text-xs md:text-sm font-medium">Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {member.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs md:text-sm font-medium">Tasks</p>
                            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
                              <span className="text-green-600">{member.tasksCompleted} completed</span>
                              <span className="text-blue-600">{member.tasksInProgress} in progress</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs md:text-sm font-medium">Actions</p>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                Chat
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                <Mail className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                Email
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
