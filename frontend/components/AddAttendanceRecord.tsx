"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Loader2, CheckCircle, AlertCircle, User, Info, ArrowLeft, Save, Plus } from "lucide-react"
import { createFieldEngineer } from "@/lib/server-api"
import { EmployeeIdGenerator } from "@/components/EmployeeIdGenerator"

interface AddAttendanceRecordProps {
  onRecordAdded?: () => void // Changed to just notify without passing record
  onBack?: () => void
}

export function AddAttendanceRecord({ onRecordAdded, onBack }: AddAttendanceRecordProps) {
  const [loading, setLoading] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const [formData, setFormData] = React.useState({
    employeeId: '',
    employeeName: '',
    email: '',
    password: '',
    phone: '',
    isTeamLeader: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.employeeId.trim()) {
      setError('Employee ID is required')
      return
    }

    if (!formData.employeeName.trim()) {
      setError('Employee name is required')
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }

    if (!formData.password.trim()) {
      setError('Password is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // First, create the field engineer
      const fieldEngineerData = {
        name: formData.employeeName.trim(),
        employeeId: formData.employeeId.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        phone: formData.phone.trim() || undefined,
        isTeamLeader: formData.isTeamLeader
      }

      const fieldEngineerResponse = await createFieldEngineer(fieldEngineerData)
      
      if (!fieldEngineerResponse.success) {
        setError(fieldEngineerResponse.message || 'Failed to create field engineer')
        return
      }

      // Success - employee created (no attendance record)
      onRecordAdded?.() // Notify parent component
      setShowSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          employeeId: '',
          employeeName: '',
          email: '',
          password: '',
          phone: '',
          isTeamLeader: false
        })
        setShowSuccess(false)
        onBack?.()
      }, 2000)
    } catch (error) {
      console.error('Error creating field engineer:', error)
      setError(error instanceof Error ? error.message : 'Failed to create field engineer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="h-10 w-10 p-0 border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
              <p className="text-gray-600 mt-1">Create a new field engineer account</p>
            </div>
          </div>
        </div>

        {showSuccess ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="border-green-200 bg-green-50 w-full max-w-md">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-semibold text-green-900">Success!</h3>
                  <p className="text-green-700 text-lg">Employee account has been created successfully.</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-4 py-2">
                    Employee Added
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-900 text-lg">Error</h4>
                        <p className="text-red-700 mt-1">{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Add New Field Engineer */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-green-900">
                      <Plus className="h-5 w-5" />
                      Add New Field Engineer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-green-800">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={formData.employeeName}
                          onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                          placeholder="Enter full name"
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-green-800">
                          Employee ID <span className="text-red-500">*</span>
                        </Label>
                        <EmployeeIdGenerator
                          value={formData.employeeId}
                          onChange={(value) => setFormData(prev => ({ ...prev, employeeId: value }))}
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-green-800">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="employee@company.com"
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-green-800">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-green-800">
                          Phone (Optional)
                        </Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Phone number"
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-green-800">
                          Role
                        </Label>
                        <Select 
                          value={formData.isTeamLeader ? 'leader' : 'engineer'} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, isTeamLeader: value === 'leader' }))}
                        >
                          <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engineer">Field Engineer</SelectItem>
                            <SelectItem value="leader">Team Leader</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 h-14 text-base border-gray-300 hover:bg-gray-50 font-medium"
                    disabled={loading}
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.employeeId.trim() || !formData.employeeName.trim() || !formData.email.trim() || !formData.password.trim()}
                    className="flex-1 h-14 text-base bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-medium shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Creating Employee...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Create Employee
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {/* Preview Card */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Employee Preview</CardTitle>
                  </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Employee ID:</span>
                      <span className="font-medium text-gray-900">
                        {formData.employeeId || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Employee Name:</span>
                      <span className="font-medium text-gray-900">
                        {formData.employeeName || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium text-gray-900 text-xs">
                        {formData.email || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium text-gray-900">
                        {formData.phone || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Role:</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {formData.isTeamLeader ? 'Team Leader' : 'Field Engineer'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Info className="h-4 w-4 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg text-blue-900 font-semibold">Quick Tips</CardTitle>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Guidelines to help you fill out the form correctly</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-blue-200/50">
                      <div className="p-1 bg-blue-100 rounded-md shrink-0 mt-0.5">
                        <User className="h-3 w-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">New Field Engineer</p>
                        <p className="text-xs text-blue-700 mt-1">Creates employee account only - no attendance</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-blue-200/50">
                      <div className="p-1 bg-green-100 rounded-md shrink-0 mt-0.5">
                        <Clock className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">Self Attendance</p>
                        <p className="text-xs text-blue-700 mt-1">Employees must mark their own attendance</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-blue-200/50">
                      <div className="p-1 bg-purple-100 rounded-md shrink-0 mt-0.5">
                        <User className="h-3 w-3 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">Login Credentials</p>
                        <p className="text-xs text-blue-700 mt-1">Employee can login with email and password</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-blue-200/50">
                    <div className="flex items-center gap-2 text-xs text-blue-600">
                      <CheckCircle className="h-3 w-3" />
                      <span className="font-medium">All required fields must be completed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
