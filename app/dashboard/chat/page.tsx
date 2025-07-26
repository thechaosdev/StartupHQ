"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Hash, Plus, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TopNavigation } from "@/components/top-navigation"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/lib/hooks/useAuth"
import { useRouter } from "next/navigation"

function useRealtimeMessages(channelId: string, supabase: any) {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    if (!channelId) return
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true })
        .limit(50)
      setMessages(data || [])
    }
    fetchMessages()

    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `channel_id=eq.${channelId}` },
        (payload: { eventType: string; new: any }) => {
          if (payload.eventType === "INSERT") {
            setMessages((msgs) => [...msgs, payload.new])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelId, supabase])

  return messages
}

export default function ChatPage() {
  const supabase = createClientComponentClient()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [channels, setChannels] = useState<any[]>([])
  const [selectedChannel, setSelectedChannel] = useState<any | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [usersById, setUsersById] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    if (!user) return
    const fetchChannels = async () => {
      const { data, error } = await supabase
        .from("channel_members")
        .select("channel_id, channels(id, name, created_by, created_at)")
        .eq("user_id", user.id)
      if (error) {
        setChannels([])
        return
      }
      const channelList = (data || [])
        .map((cm: any) => cm.channels)
        .filter(Boolean)
      setChannels(channelList)
      if (channelList.length > 0) setSelectedChannel(channelList[0])
    }
    fetchChannels()
  }, [user])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("users").select("id, name, status")
      setTeamMembers(data || [])
      const map: { [key: string]: any } = {}
      data?.forEach((u: any) => { map[u.id] = u })
      setUsersById(map)
    }
    fetchUsers()
  }, [])

  const messages = useRealtimeMessages(selectedChannel?.id || "", supabase)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !selectedChannel) return
    await supabase.from("messages").insert({
      channel_id: selectedChannel.id,
      user_id: user.id,
      content: newMessage,
    })
    setNewMessage("")
  }

  const handleChannelSelect = (channel: any) => {
    setSelectedChannel(channel)
    setIsMobileMenuOpen(false)
  }

  const CreateChannelForm = ({ onSuccess, onCancel }: { onSuccess: (channel: any) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      name: "",
      selectedMembers: [] as string[],
    })

    const handleMemberToggle = (memberId: string) => {
      setFormData((prev) => ({
        ...prev,
        selectedMembers: prev.selectedMembers.includes(memberId)
          ? prev.selectedMembers.filter((id) => id !== memberId)
          : [...prev.selectedMembers, memberId],
      }))
    }

    const handleSubmit = async () => {
      if (!formData.name.trim() || !user) return
      const { data: channelData, error } = await supabase
        .from("channels")
        .insert({ name: formData.name, created_by: user.id })
        .select()
        .single()
      if (error || !channelData) return
      const memberIds = Array.from(new Set([...formData.selectedMembers, user.id]))
      await supabase.from("channel_members").insert(
        memberIds.map((uid) => ({ channel_id: channelData.id, user_id: uid }))
      )
      onSuccess(channelData)
      setFormData({ name: "", selectedMembers: [] })
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
            {teamMembers.map((member) => {
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
                      <AvatarFallback className="text-xs">
                        {member.name.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{member.name}</p>
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
                  const member = teamMembers.find((m) => m.id === memberId)
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
                  setChannels((prev) => [...prev, channel])
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
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => handleChannelSelect(channel)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-accent transition-colors ${
                selectedChannel?.id === channel.id ? "bg-accent" : ""
              }`}
            >
                <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate text-sm">{channel.name}</span>
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

                  <Hash className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                <h1 className="font-semibold text-sm md:text-base truncate">{selectedChannel?.name}</h1>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {messages.length} messages
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 md:p-4">
              <div className="space-y-3 md:space-y-4">
                {messages.map((message) => {
                  const userInfo = usersById[message.user_id] || {}
                  return (
                    <div key={message.id} className={`mb-4 ${message.user_id === user?.id ? "text-right" : "text-left"}`}>
                      <div className={`flex gap-2 md:gap-3 ${message.user_id === user?.id ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                          <AvatarFallback className="text-xs">
                            {userInfo.name
                              ? userInfo.name.split(" ").map((n: string) => n[0]).join("")
                              : "--"}
                          </AvatarFallback>
                      </Avatar>
                        <div
                          className={`flex-1 max-w-[80%] md:max-w-[70%] ${message.user_id === user?.id ? "text-right" : ""}`}
                        >
                          <div
                            className={`flex items-center gap-2 mb-1 ${message.user_id === user?.id ? "flex-row-reverse" : ""}`}
                          >
                            <span className="font-medium text-xs md:text-sm">{userInfo.name || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">
                              {message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                            </span>
                        </div>
                        <div
                          className={`inline-block p-2 md:p-3 rounded-lg text-xs md:text-sm ${
                              message.user_id === user?.id ? "bg-blue-500 text-white" : "bg-muted"
                          }`}
                        >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 md:p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${selectedChannel?.name || ""}`}
                  className="flex-1 text-sm"
                  disabled={!selectedChannel}
                />
                <Button type="submit" size="icon" className="flex-shrink-0" disabled={!selectedChannel}>
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
