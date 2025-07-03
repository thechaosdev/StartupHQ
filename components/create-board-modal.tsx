"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  Code,
  Palette,
  Rocket,
  Building,
  GraduationCap,
  Check,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const boardTemplates = [
  {
    id: "startup",
    name: "Startup Team",
    description: "Perfect for early-stage startups and small teams",
    icon: Rocket,
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    features: ["Task Management", "Team Chat", "Product Planning", "Investor Updates"],
  },
  {
    id: "development",
    name: "Development Team",
    description: "Optimized for software development workflows",
    icon: Code,
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    features: ["Sprint Planning", "Code Reviews", "Bug Tracking", "Release Management"],
  },
  {
    id: "design",
    name: "Design Team",
    description: "Built for creative teams and design workflows",
    icon: Palette,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    features: ["Design Reviews", "Asset Management", "Client Feedback", "Brand Guidelines"],
  },
  {
    id: "business",
    name: "Business Team",
    description: "Great for business operations and management",
    icon: Briefcase,
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
    features: ["Project Management", "Client Relations", "Financial Planning", "Team Coordination"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Comprehensive solution for large organizations",
    icon: Building,
    color: "bg-gradient-to-r from-gray-600 to-gray-800",
    features: ["Advanced Analytics", "Custom Workflows", "Enterprise Security", "Multi-team Management"],
  },
  {
    id: "education",
    name: "Education",
    description: "Designed for educational institutions and teams",
    icon: GraduationCap,
    color: "bg-gradient-to-r from-indigo-500 to-blue-600",
    features: ["Course Management", "Student Collaboration", "Assignment Tracking", "Resource Sharing"],
  },
]

interface CreateBoardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBoardModal({ open, onOpenChange }: CreateBoardModalProps) {
  const [formData, setFormData] = useState({
    boardName: "",
    description: "",
    template: "",
    teamSize: "",
  })
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof boardTemplates)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleTemplateSelect = (template: (typeof boardTemplates)[0]) => {
    setSelectedTemplate(template)
    setFormData({
      ...formData,
      template: template.id,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.boardName.trim()) {
      toast({
        title: "Board name required",
        description: "Please enter a name for your board.",
        variant: "destructive",
      })
      return
    }

    if (!formData.template) {
      toast({
        title: "Template required",
        description: "Please select a template for your board.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call to create board
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Board created successfully! 🎉",
        description: `Welcome to ${formData.boardName}. Your team workspace is ready.`,
      })

      // Close modal and refresh page
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      toast({
        title: "Error creating board",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      boardName: "",
      description: "",
      template: "",
      teamSize: "",
    })
    setSelectedTemplate(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Welcome to TeamSync
            </div>
          </div>
          <DialogTitle className="text-2xl">Create your first board</DialogTitle>
          <DialogDescription className="text-base">
            Set up your team workspace with the perfect template for your needs. You can always customize it later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Board Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Board Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="boardName">Board Name *</Label>
                <Input
                  id="boardName"
                  placeholder="e.g., Acme Startup, Design Team, Project Alpha"
                  value={formData.boardName}
                  onChange={(e) => setFormData({ ...formData, boardName: e.target.value })}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Select
                  value={formData.teamSize}
                  onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 members</SelectItem>
                    <SelectItem value="6-15">6-15 members</SelectItem>
                    <SelectItem value="16-50">16-50 members</SelectItem>
                    <SelectItem value="50+">50+ members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your team or project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose a Template</h3>
            <p className="text-sm text-muted-foreground">Select a template that best matches your team's workflow</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {boardTemplates.map((template) => {
                const Icon = template.icon
                const isSelected = selectedTemplate?.id === template.id

                return (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`
                      relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                      ${isSelected ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300"}
                    `}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${template.color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{template.name}</h4>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600">{template.description}</p>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Includes</p>
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {selectedTemplate && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${selectedTemplate.color} flex-shrink-0`}>
                    <selectedTemplate.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2">{selectedTemplate.name} Template</h4>
                    <p className="text-sm text-blue-700 mb-3">{selectedTemplate.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Features included</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplate.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-white">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                "Creating your board..."
              ) : (
                <>
                  Create Board
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
