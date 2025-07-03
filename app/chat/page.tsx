"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Hash, Users, Plus, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TopNavigation } from "@/components/top-navigation"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock data - in real app, this would come from Supabase real-time
const mockChannels = [
  { id: 1, name: "general", unread: 0, type: "channel" },
  { id: 2, name: "development", unread: 3, type: "channel" },
  { id: 3, name: "design", unread: 1, type: "channel" },
  { id: 4, name: "Alice Johnson", unread: 2, type: "dm" },
  { id: 5, name: "Bob Smith", unread: 0, type: "dm" },
]

const mockMessages = [
  {
    id: 1,
    user: "Alice Johnson",
    message: "Hey team! Just finished the new dashboard mockups. What do you think?",
    timestamp: "10:30 AM",
    initials: "AJ",
  },
  {
    id: 2,
    user: "Bob Smith",
    message: "Looks great! The color scheme really works well with our brand.",
    timestamp: "10:32 AM",
    initials: "BS",
  },
  {
    id: 3,
    user: "Carol Davis",
    message: "I agree! Can we schedule a quick call to discuss the user flow?",
    timestamp: "10:35 AM",
    initials: "CD",
  },
  {
    id: 4,
    user: "You",
    message: "I'll create a meeting link in the Meet section.",
    timestamp: "10:37 AM",
    initials: "YU",
  },
]

const mockTeamMembers = [
  { id: 1, name: "Alice Johnson", initials: "AJ", status: "online" },
  { id: 2, name: "Bob Smith", initials: "BS", status: "online" },
  { id: 3, name: "Carol Davis", initials: "CD", status: "away" },
  { id: 4, name: "David Wilson", initials: "DW", status: "offline" },
]

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState(mockChannels[0])
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      user: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      initials: "YU",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleChannelSelect = (channel: (typeof mockChannels)[0]) => {
    setSelectedChannel(channel)
    setIsMobileMenuOpen(false)
  }

  const CreateChannelForm = ({ onSuccess, onCancel }: { onSuccess: (channel: any) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      name: "",
      selectedMembers: [] as number[],
    })

    const handleMemberToggle = (memberId: number) => {
      setFormData((prev) => ({
        ...prev,
        selectedMembers: prev.selectedMembers.includes(memberId)
          ? prev.selectedMembers.filter((id) => id !== memberId)
          : [...prev.selectedMembers, memberId],
      }))
    }

    const handleSubmit = () => {
      if (!formData.name.trim()) return

      const channel = {
        id: mockChannels.length + 1,
        name: formData.name,
        unread: 0,
        type: "channel" as const,
        members: formData.selectedMembers,
      }

      onSuccess(channel)

      // Reset form
      setFormData({
        name: "",
        selectedMembers: [],
      })
    }

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="channel-name">Channel Name</Label>
          <Input
            id="channel-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. marketing, design-team, project-alpha"
          />
        </div>

        <div>
          <Label>Team Members</Label>
          <p className="text-sm text-muted-foreground mb-3">Select members to add to this channel</p>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {mockTeamMembers.map((member) => {
              const isSelected = formData.selectedMembers.includes(member.id)
              return (
                <div
                  key={member.id}
                  onClick={() => handleMemberToggle(member.id)}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                        member.status === "online"
                          ? "bg-green-500"
                          : member.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{member.status}</p>
                  </div>
                  {isSelected && (
                    <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {formData.selectedMembers.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Selected members ({formData.selectedMembers.length}):</p>
              <div className="flex flex-wrap gap-1">
                {formData.selectedMembers.map((memberId) => {
                  const member = mockTeamMembers.find((m) => m.id === memberId)
                  return member ? (
                    <Badge key={memberId} variant="secondary" className="text-xs">
                      {member.name}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Create Channel
          </Button>
        </div>
      </div>
    )
  }

  const ChannelList = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Channels</h2>
          <Dialog open={isCreateChannelOpen} onOpenChange={setIsCreateChannelOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Channel</DialogTitle>
              </DialogHeader>
              <CreateChannelForm
                onSuccess={(channel) => {
                  // In a real app, you'd add this to your channels state
                  console.log("New channel created:", channel)
                  setIsCreateChannelOpen(false)
                }}
                onCancel={() => setIsCreateChannelOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {mockChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => handleChannelSelect(channel)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-accent transition-colors ${
                selectedChannel.id === channel.id ? "bg-accent" : ""
              }`}
            >
              {channel.type === "channel" ? (
                <Hash className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Users className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="flex-1 truncate text-sm">{channel.name}</span>
              {channel.unread > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {channel.unread}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <>
      <TopNavigation />
      <main className="pt-16 md:pt-20">
        <div className="container mx-auto h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] flex">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 border-r bg-muted/30">
            <ChannelList />
          </div>

          {/* Mobile Sidebar */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetContent side="left" className="w-64 p-0">
              <ChannelList />
            </SheetContent>
          </Sheet>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-3 md:p-4 border-b">
              <div className="flex items-center gap-2">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                </Sheet>

                {selectedChannel.type === "channel" ? (
                  <Hash className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                ) : (
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                )}
                <h1 className="font-semibold text-sm md:text-base truncate">{selectedChannel.name}</h1>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {messages.length} messages
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 md:p-4">
              <div className="space-y-3 md:space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`mb-4 ${message.user === "You" ? "text-right" : "text-left"}`}>
                    <div className={`flex gap-2 md:gap-3 ${message.user === "You" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">{message.initials}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex-1 max-w-[80%] md:max-w-[70%] ${message.user === "You" ? "text-right" : ""}`}
                      >
                        <div
                          className={`flex items-center gap-2 mb-1 ${message.user === "You" ? "flex-row-reverse" : ""}`}
                        >
                          <span className="font-medium text-xs md:text-sm">{message.user}</span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <div
                          className={`inline-block p-2 md:p-3 rounded-lg text-xs md:text-sm ${
                            message.user === "You" ? "bg-blue-500 text-white" : "bg-muted"
                          }`}
                        >
                          {message.message}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 md:p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${selectedChannel.name}`}
                  className="flex-1 text-sm"
                />
                <Button type="submit" size="icon" className="flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
