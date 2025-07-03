"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, FileText, Search, Calendar, Users, BookOpen, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TopNavigation } from "@/components/top-navigation"

// Mock data
const mockDocs = [
  {
    id: 1,
    title: "Daily Standup - Jan 8, 2024",
    type: "Meeting Notes",
    folder: "Meetings",
    lastModified: "2024-01-08",
    author: "Alice Johnson",
    content:
      "## Attendees\n- Alice Johnson\n- Bob Smith\n- Carol Davis\n\n## Yesterday's Progress\n- Completed user authentication flow\n- Fixed responsive design issues\n\n## Today's Goals\n- Start dashboard implementation\n- Review design mockups",
  },
  {
    id: 2,
    title: "Q1 Product Roadmap",
    type: "Roadmap",
    folder: "Planning",
    lastModified: "2024-01-07",
    author: "Bob Smith",
    content:
      "# Q1 2024 Product Roadmap\n\n## Key Features\n1. User Dashboard\n2. Team Collaboration Tools\n3. Mobile App MVP\n\n## Timeline\n- January: Core features\n- February: Testing & refinement\n- March: Launch preparation",
  },
  {
    id: 3,
    title: "API Documentation",
    type: "Documentation",
    folder: "Technical",
    lastModified: "2024-01-06",
    author: "Carol Davis",
    content:
      "# API Documentation\n\n## Authentication\nAll API requests require authentication via JWT tokens.\n\n## Endpoints\n\n### GET /api/users\nReturns list of users\n\n### POST /api/tasks\nCreates a new task",
  },
]

const templates = [
  { id: "meeting", name: "Meeting Notes", icon: Users },
  { id: "standup", name: "Daily Standup", icon: Calendar },
  { id: "roadmap", name: "Roadmap", icon: BookOpen },
]

export default function DocsPage() {
  const [docs, setDocs] = useState(mockDocs)
  const [selectedDoc, setSelectedDoc] = useState<(typeof mockDocs)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredDocs = docs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDocSelect = (doc: (typeof mockDocs)[0]) => {
    setSelectedDoc(doc)
    setIsMobileMenuOpen(false)
  }

  const handleStartEdit = () => {
    setEditContent(selectedDoc?.content || "")
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (selectedDoc) {
      const updatedDocs = docs.map((doc) =>
        doc.id === selectedDoc.id
          ? { ...doc, content: editContent, lastModified: new Date().toISOString().split("T")[0] }
          : doc,
      )
      setDocs(updatedDocs)
      setSelectedDoc({ ...selectedDoc, content: editContent, lastModified: new Date().toISOString().split("T")[0] })
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent("")
  }

  const CreateDocumentForm = ({ onSuccess, onCancel }: { onSuccess: (doc: any) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      title: "",
      type: "Blank Document",
      folder: "General",
      content: "",
    })

    const getTemplateContent = (templateId: string) => {
      switch (templateId) {
        case "meeting":
          return "# Meeting Notes\n\n## Date\n[Date]\n\n## Attendees\n- \n- \n\n## Agenda\n1. \n2. \n\n## Discussion\n\n## Action Items\n- [ ] \n- [ ] \n\n## Next Steps\n"
        case "standup":
          return "# Daily Standup\n\n## Date\n[Date]\n\n## Team Members\n\n### [Name]\n**Yesterday:** \n**Today:** \n**Blockers:** \n\n### [Name]\n**Yesterday:** \n**Today:** \n**Blockers:** \n"
        case "roadmap":
          return "# Product Roadmap\n\n## Overview\n[Brief description]\n\n## Goals\n- \n- \n\n## Timeline\n\n### Q1\n- \n\n### Q2\n- \n\n## Success Metrics\n- \n- \n"
        case "Blank Document":
          return "# New Document\n\nStart writing your content here...\n"
        default:
          return "# New Document\n\nStart writing your content here...\n"
      }
    }

    const handleSubmit = () => {
      if (!formData.title.trim()) return

      const doc = {
        id: Date.now(), // Use timestamp for unique ID
        ...formData,
        lastModified: new Date().toISOString().split("T")[0],
        author: "You",
        content: formData.content || getTemplateContent(formData.type),
      }

      onSuccess(doc)

      // Reset form
      setFormData({
        title: "",
        type: "Blank Document",
        folder: "General",
        content: "",
      })
    }

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="doc-title">Title</Label>
          <Input
            id="doc-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter document title"
          />
        </div>

        <div>
          <Label htmlFor="doc-template">Template</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                type: value,
                content: getTemplateContent(value),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Blank Document">Blank Document</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="doc-folder">Folder</Label>
          <Select value={formData.folder} onValueChange={(value) => setFormData({ ...formData, folder: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Meetings">Meetings</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Create
          </Button>
        </div>
      </div>
    )
  }

  const DocumentSidebar = () => (
    <div className="h-full flex flex-col">
      <div className="p-3 md:p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm md:text-base">Documents</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
              </DialogHeader>
              <CreateDocumentForm
                onSuccess={(doc) => {
                  setDocs([doc, ...docs])
                  setSelectedDoc(doc)
                  setIsCreateDialogOpen(false)
                }}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredDocs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleDocSelect(doc)}
              className={`w-full text-left p-3 rounded-md hover:bg-accent transition-colors ${
                selectedDoc?.id === doc.id ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{doc.title}</p>
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {doc.type || "Document"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{doc.folder}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Modified {new Date(doc.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
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
        <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)]">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-80 border-r bg-muted/30">
            <DocumentSidebar />
          </div>

          {/* Mobile Sidebar */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetContent side="left" className="w-80 p-0">
              <DocumentSidebar />
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {selectedDoc ? (
              <>
                <div className="p-3 md:p-4 border-b">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm" className="md:hidden flex-shrink-0">
                            <Menu className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                      </Sheet>

                      <div className="min-w-0">
                        <h1 className="text-lg md:text-xl font-semibold truncate">{selectedDoc.title}</h1>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mt-1">
                          <span>By {selectedDoc.author}</span>
                          <span className="hidden sm:inline">
                            Modified {new Date(selectedDoc.lastModified).toLocaleDateString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {selectedDoc.folder}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSaveEdit} size="sm" className="flex-shrink-0">
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0 bg-transparent"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleStartEdit}
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0 bg-transparent"
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-3 md:p-6">
                  <div className="max-w-4xl mx-auto">
                    {isEditing ? (
                      <div className="space-y-4">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full h-96 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Write your content here..."
                        />
                        <p className="text-sm text-muted-foreground">
                          💡 Tip: Use Markdown formatting (# for headers, - for lists, etc.)
                        </p>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {selectedDoc.content.split("\n").map((line, index) => {
                          if (line.startsWith("# ")) {
                            return (
                              <h1 key={index} className="text-xl md:text-2xl font-bold mt-6 mb-4">
                                {line.substring(2)}
                              </h1>
                            )
                          } else if (line.startsWith("## ")) {
                            return (
                              <h2 key={index} className="text-lg md:text-xl font-semibold mt-5 mb-3">
                                {line.substring(3)}
                              </h2>
                            )
                          } else if (line.startsWith("### ")) {
                            return (
                              <h3 key={index} className="text-base md:text-lg font-medium mt-4 mb-2">
                                {line.substring(4)}
                              </h3>
                            )
                          } else if (line.startsWith("- ")) {
                            return (
                              <li key={index} className="ml-4 text-sm md:text-base">
                                {line.substring(2)}
                              </li>
                            )
                          } else if (line.match(/^\d+\. /)) {
                            return (
                              <li key={index} className="ml-4 list-decimal text-sm md:text-base">
                                {line.substring(line.indexOf(" ") + 1)}
                              </li>
                            )
                          } else if (line.trim() === "") {
                            return <br key={index} />
                          } else {
                            return (
                              <p key={index} className="mb-2 text-sm md:text-base">
                                {line}
                              </p>
                            )
                          }
                        })}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-sm">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold">No document selected</h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Choose a document from the sidebar to view its content
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Document
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create New Document</DialogTitle>
                        </DialogHeader>
                        <CreateDocumentForm
                          onSuccess={(doc) => {
                            setDocs([doc, ...docs])
                            setSelectedDoc(doc)
                            setIsCreateDialogOpen(false)
                          }}
                          onCancel={() => setIsCreateDialogOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto md:hidden bg-transparent">
                          <Menu className="h-4 w-4 mr-2" />
                          Browse Documents
                        </Button>
                      </SheetTrigger>
                    </Sheet>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
