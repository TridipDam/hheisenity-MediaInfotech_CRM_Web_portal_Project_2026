"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Ticket, 
  User, 
  AlertTriangle,
  Clock,
  Save,
  X
} from "lucide-react"
import { Ticket as TicketType, generateId } from "@crmdemo/shared"

// Success popup component
interface SuccessPopupProps {
  isOpen: boolean
  onClose: () => void
  onCreateAnother: () => void
  ticketId: string
}

function SuccessPopup({ isOpen, onClose, onCreateAnother, ticketId }: SuccessPopupProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Ticket className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Ticket Created Successfully!</h3>
            <p className="text-muted-foreground mt-2">Your support ticket has been created and assigned ID:</p>
            <Badge className="mt-2 bg-green-50 text-green-700 border-green-200 font-mono">
              {ticketId}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            You will receive email notifications about updates to your ticket.
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Tickets
            </Button>
            <Button 
              variant="outline" 
              onClick={onCreateAnother}
              className="flex-1"
            >
              Create Another
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CreateTicketForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false)
  const [createdTicketId, setCreatedTicketId] = React.useState("")
  
  // Calculate default due date (7 days from now)
  const getDefaultDueDate = React.useCallback(() => {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }, [])
  
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    department: "",
    assignee: "",
    dueDate: getDefaultDueDate(),
    tags: "",
    estimatedHours: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateTicketId = () => {
    return generateId()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title.trim()) {
      alert('Please enter a ticket title')
      return
    }
    
    if (!formData.description.trim()) {
      alert('Please enter a description')
      return
    }
    
    if (!formData.category) {
      alert('Please select a category')
      return
    }
    
    if (!formData.priority) {
      alert('Please select a priority')
      return
    }
    
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const ticketId = generateTicketId()
    setCreatedTicketId(ticketId)
    setIsSubmitting(false)
    setShowSuccessPopup(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "",
      department: "",
      assignee: "",
      dueDate: getDefaultDueDate(),
      tags: "",
      estimatedHours: ""
    })
  }

  const handleSuccessClose = () => {
    setShowSuccessPopup(false)
    router.push('/tickets')
  }

  const handleCreateAnother = () => {
    setShowSuccessPopup(false)
    resetForm()
  }

  const isFormValid = formData.title && formData.description && formData.category && formData.priority

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.back()}
                className="border-border hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-foreground">Create New Ticket</h1>
                <p className="text-muted-foreground">Submit a new support request or issue report</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-card shadow-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title" className="text-sm font-medium text-foreground">
                      Ticket Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-foreground">
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Authentication">Authentication</SelectItem>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Network">Network</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Database">Database</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Setup">Setup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-sm font-medium text-foreground">
                      Priority *
                    </Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            High Priority
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-600" />
                            Medium Priority
                          </div>
                        </SelectItem>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            Low Priority
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the issue, including steps to reproduce, expected behavior, and any error messages..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="mt-1 min-h-[120px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Assignment & Timeline */}
            <Card className="bg-card shadow-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Assignment & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="department" className="text-sm font-medium text-foreground">
                      Department
                    </Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT Support">IT Support</SelectItem>
                        <SelectItem value="IT Infrastructure">IT Infrastructure</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Facilities">Facilities</SelectItem>
                        <SelectItem value="Procurement">Procurement</SelectItem>
                        <SelectItem value="HR Department">HR Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="assignee" className="text-sm font-medium text-foreground">
                      Preferred Assignee
                    </Label>
                    <Select value={formData.assignee} onValueChange={(value) => handleInputChange("assignee", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Auto-assign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                        <SelectItem value="David Wilson">David Wilson</SelectItem>
                        <SelectItem value="Robert Martinez">Robert Martinez</SelectItem>
                        <SelectItem value="Lisa Wang">Lisa Wang</SelectItem>
                        <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
                      Due Date
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="estimatedHours" className="text-sm font-medium text-foreground">
                      Estimated Hours
                    </Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      placeholder="e.g., 4"
                      value={formData.estimatedHours}
                      onChange={(e) => handleInputChange("estimatedHours", e.target.value)}
                      className="mt-1"
                      min="0"
                      step="0.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags" className="text-sm font-medium text-foreground">
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      placeholder="urgent, security, hardware (comma separated)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <Card className="bg-card shadow-sm border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    * Required fields must be filled out
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => router.back()}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="shadow-sm min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Ticket
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup 
        isOpen={showSuccessPopup}
        onClose={handleSuccessClose}
        onCreateAnother={handleCreateAnother}
        ticketId={createdTicketId}
      />
    </>
  )
}