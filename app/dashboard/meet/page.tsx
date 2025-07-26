"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, Plus, Calendar, Users, Clock, ExternalLink, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TopNavigation } from "@/components/top-navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { useRouter } from "next/navigation"

// Mock data
const mockMeetings = [
  {
    id: 1,
    title: "Daily Standup",
    description: "Daily team sync and progress update",
    date: "2024-01-08",
    time: "09:00",
    duration: 30,
    attendees: ["Alice Johnson", "Bob Smith", "Carol Davis"],
    status: "upcoming",
    meetingLink: "https://meet.jit.si/daily-standup-team-alpha",
    agenda: "Review yesterday's progress, discuss today's goals, identify blockers",
  },
  {
    id: 2,
    title: "Product Review",
    description: "Review Q1 product roadmap and priorities",
    date: "2024-01-08",
    time: "14:00",
    duration: 60,
    attendees: ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson"],
    status: "upcoming",
    meetingLink: "https://meet.jit.si/product-review-q1-2024",
    agenda: "Discuss roadmap priorities, review user feedback, plan next sprint",
  },
  {
    id: 3,
    title: "Team Retrospective",
    description: "Sprint retrospective and process improvements",
    date: "2024-01-05",
    time: "15:00",
    duration: 45,
    attendees: ["Alice Johnson", "Bob Smith", "Carol Davis"],
    status: "completed",
    meetingLink: "https://meet.jit.si/retro-sprint-12",
    agenda: "What went well, what could be improved, action items for next sprint",
    notes: "Great sprint overall. Need to improve code review process. Action: Implement PR templates.",
  },
]

export default function MeetPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [meetings, setMeetings] = useState(mockMeetings)
  const [isCreating, setIsCreating] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const { toast } = useToast()
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 30,
    attendees: [] as string[],
    agenda: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login")
    }
  }, [user, loading, router])

  if (loading || (!user && !loading)) return null;

  const generateMeetingLink = (title: string) => {
    const roomName = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    return `https://meet.jit.si/${roomName}-${Date.now()}`
  }

  const handleCreateMeeting = () => {
    if (!newMeeting.title.trim() || !newMeeting.date || !newMeeting.time) return

    const meeting = {
      id: meetings.length + 1,
      ...newMeeting,
      status: "upcoming" as const,
      meetingLink: generateMeetingLink(newMeeting.title),
      attendees: ["You", ...newMeeting.attendees],
    }

    setMeetings([...meetings, meeting])
    setNewMeeting({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: 30,
      attendees: [],
      agenda: "",
    })
    setIsCreating(false)

    toast({
      title: "Meeting created!",
      description: "Meeting link has been generated and is ready to share.",
    })
  }

  const copyMeetingLink = async (link: string, meetingId: number) => {
    try {
      await navigator.clipboard.writeText(link)
      setCopiedLink(link)
      setTimeout(() => setCopiedLink(null), 2000)

      toast({
        title: "Link copied!",
        description: "Meeting link has been copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the meeting link.",
        variant: "destructive",
      })
    }
  }

  const startInstantMeeting = () => {
    const instantLink = generateMeetingLink("instant-meeting")
    window.open(instantLink, "_blank")

    toast({
      title: "Instant meeting started!",
      description: "Opening meeting in new tab...",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default"
      case "in-progress":
        return "destructive"
      case "completed":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <>
      <TopNavigation />
      <main className="pt-16 md:pt-20">
        <div className="p-3 md:p-6 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Meet</h1>
              <p className="text-sm md:text-base text-muted-foreground">Video meetings and collaboration</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                onClick={startInstantMeeting}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-transparent"
              >
                <Video className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Start Instant Meeting</span>
                <span className="sm:hidden">Instant Meet</span>
              </Button>

              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Schedule Meeting</span>
                    <span className="sm:hidden">Schedule</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Schedule New Meeting</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Meeting Title</Label>
                      <Input
                        id="title"
                        value={newMeeting.title}
                        onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                        placeholder="Enter meeting title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newMeeting.description}
                        onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                        placeholder="Brief description of the meeting"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newMeeting.date}
                          onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newMeeting.time}
                          onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Select
                          value={newMeeting.duration.toString()}
                          onValueChange={(value) => setNewMeeting({ ...newMeeting, duration: Number.parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="agenda">Agenda</Label>
                      <Textarea
                        id="agenda"
                        value={newMeeting.agenda}
                        onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                        placeholder="Meeting agenda and topics to discuss"
                        rows={3}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreating(false)} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                      <Button onClick={handleCreateMeeting} className="w-full sm:w-auto">
                        Schedule Meeting
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={startInstantMeeting}>
              <CardContent className="p-4 md:p-6 text-center">
                <Video className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">Start Instant Meeting</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Begin a meeting right now</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsCreating(true)}>
              <CardContent className="p-4 md:p-6 text-center">
                <Calendar className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-3 text-green-500" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">Schedule Meeting</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Plan a meeting for later</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6 text-center">
                <Users className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-3 text-purple-500" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">Join Meeting</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Enter a meeting ID or link</p>
              </CardContent>
            </Card>
          </div>

          {/* Meetings List */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold">Scheduled Meetings</h2>

            <div className="grid gap-4">
              {meetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                          <h3 className="font-semibold text-base md:text-lg">{meeting.title}</h3>
                          <Badge variant={getStatusColor(meeting.status)} className="text-xs">
                            {meeting.status}
                          </Badge>
                        </div>

                        {meeting.description && (
                          <p className="text-sm md:text-base text-muted-foreground mb-3">{meeting.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                            <span>{new Date(meeting.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 md:h-4 md:w-4" />
                            <span>
                              {meeting.time} ({meeting.duration} min)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 md:h-4 md:w-4" />
                            <span>{meeting.attendees.length} attendees</span>
                          </div>
                        </div>

                        {meeting.agenda && (
                          <div className="mb-3">
                            <p className="text-xs md:text-sm font-medium mb-1">Agenda:</p>
                            <p className="text-xs md:text-sm text-muted-foreground">{meeting.agenda}</p>
                          </div>
                        )}

                        {meeting.notes && (
                          <div className="mb-3">
                            <p className="text-xs md:text-sm font-medium mb-1">Meeting Notes:</p>
                            <p className="text-xs md:text-sm text-muted-foreground">{meeting.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-4">
                        {meeting.status === "upcoming" && (
                          <Button
                            onClick={() => window.open(meeting.meetingLink, "_blank")}
                            className="flex items-center gap-2 w-full sm:w-auto"
                            size="sm"
                          >
                            <Video className="h-4 w-4" />
                            <span className="hidden sm:inline">Join Meeting</span>
                            <span className="sm:hidden">Join</span>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyMeetingLink(meeting.meetingLink, meeting.id)}
                          className="flex items-center gap-2 w-full sm:w-auto"
                        >
                          {copiedLink === meeting.meetingLink ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="hidden sm:inline">
                            {copiedLink === meeting.meetingLink ? "Copied!" : "Copy Link"}
                          </span>
                          <span className="sm:hidden">{copiedLink === meeting.meetingLink ? "✓" : "Copy"}</span>
                        </Button>
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
