"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  LogOut,
  Settings,
  Home,
  FileText
} from "lucide-react"
import { EmployeeSelfAttendance } from "./EmployeeSelfAttendance"

interface StaffPortalProps {
  deviceInfo: any
}

interface EmployeeProfile {
  id: string
  name: string
  employeeId: string
  email: string
  phone?: string
  teamId?: string
  isTeamLeader: boolean
  status: string
}

export function StaffPortal({ deviceInfo }: StaffPortalProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [employeeProfile, setEmployeeProfile] = useState<EmployeeProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session || (session.user as any)?.userType !== "employee") {
      router.push("/login")
      return
    }

    fetchEmployeeProfile()
  }, [session, status, router])

  const fetchEmployeeProfile = async () => {
    try {
      if (!session?.user) return

      const employeeId = (session.user as any).employeeId
      if (!employeeId) return

      // Fetch employee profile from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/field-engineers/${employeeId}`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setEmployeeProfile({
            id: result.data.id,
            name: result.data.name,
            employeeId: result.data.employeeId,
            email: result.data.email,
            phone: result.data.phone,
            teamId: result.data.teamId,
            isTeamLeader: result.data.isTeamLeader,
            status: result.data.status
          })
        } else {
          // Fallback to session data
          setEmployeeProfile({
            id: session.user.id,
            name: session.user.name || "Employee",
            employeeId: employeeId,
            email: session.user.email || "",
            phone: undefined,
            teamId: undefined,
            isTeamLeader: false,
            status: "ACTIVE"
          })
        }
      } else {
        // Fallback to session data
        setEmployeeProfile({
          id: session.user.id,
          name: session.user.name || "Employee",
          employeeId: employeeId,
          email: session.user.email || "",
          phone: undefined,
          teamId: undefined,
          isTeamLeader: false,
          status: "ACTIVE"
        })
      }
    } catch (error) {
      console.error("Error fetching employee profile:", error)
      // Fallback to session data
      if (session?.user) {
        const employeeId = (session.user as any).employeeId
        setEmployeeProfile({
          id: session.user.id,
          name: session.user.name || "Employee",
          employeeId: employeeId,
          email: session.user.email || "",
          phone: undefined,
          teamId: undefined,
          isTeamLeader: false,
          status: "ACTIVE"
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    signOut({ 
      callbackUrl: '/',
      redirect: true 
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "INACTIVE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!employeeProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">Unable to load your employee profile.</p>
            <Button onClick={() => router.push("/login")}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Staff Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/employee-attendance")}
                className="text-gray-600 hover:text-gray-900"
              >
                <FileText className="h-4 w-4 mr-2" />
                Full Attendance
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {employeeProfile.name}! 👋
          </h2>
          <p className="text-gray-600 mt-1">
            Here's your staff portal dashboard. Manage your attendance and view your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${employeeProfile.name}`} 
                      alt={employeeProfile.name} 
                    />
                    <AvatarFallback className="text-lg">
                      {getInitials(employeeProfile.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{employeeProfile.name}</CardTitle>
                <p className="text-gray-600">{employeeProfile.employeeId}</p>
                <Badge className={getStatusColor(employeeProfile.status)}>
                  {employeeProfile.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{employeeProfile.email}</span>
                </div>
                {employeeProfile.phone && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{employeeProfile.phone}</span>
                  </div>
                )}
                {employeeProfile.teamId && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Team: {employeeProfile.teamId}</span>
                  </div>
                )}
                {employeeProfile.isTeamLeader && (
                  <Badge variant="secondary">Team Leader</Badge>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Today's Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Status</span>
                  </div>
                  <Badge variant="outline">Not Checked In</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Date</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Attendance */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span>Attendance Management</span>
                </CardTitle>
                <p className="text-gray-600">
                  Mark your attendance and track your location
                </p>
              </CardHeader>
              <CardContent>
                <EmployeeSelfAttendance deviceInfo={deviceInfo} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}