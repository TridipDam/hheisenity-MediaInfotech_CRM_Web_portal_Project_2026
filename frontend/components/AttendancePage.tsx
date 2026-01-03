"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Calendar, 
  Filter, 
  Download, 
  Plus, 
  Clock, 
  MapPin, 
  FileText, 
  Users, 
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical
} from "lucide-react"

// Mock data for attendance with more professional structure
const attendanceData = [
  {
    id: 1,
    name: "Sarah Johnson",
    employeeId: "EMP001",
    department: "Engineering",
    position: "Senior Developer",
    clockIn: "08:45 AM",
    clockOut: "05:30 PM",
    workHours: "8h 45m",
    overtime: "0h 45m",
    status: "present",
    location: "Office - Floor 3",
    note: "Working on Q4 project deliverables",
    avatar: "SJ",
    profileImage: "sarah_profile.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    employeeId: "EMP002",
    department: "Marketing",
    position: "Marketing Manager",
    clockIn: "09:00 AM",
    clockOut: "06:15 PM",
    workHours: "9h 15m",
    overtime: "1h 15m",
    status: "present",
    location: "Office - Floor 2",
    note: "Client presentation preparation",
    avatar: "MC",
    profileImage: "michael_profile.jpg"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    employeeId: "EMP003",
    department: "Design",
    position: "UX Designer",
    clockIn: "08:30 AM",
    clockOut: "05:00 PM",
    workHours: "8h 30m",
    overtime: "0h 30m",
    status: "present",
    location: "Remote",
    note: "Design system updates and user research",
    avatar: "ER",
    profileImage: "emily_profile.jpg"
  },
  {
    id: 4,
    name: "David Thompson",
    employeeId: "EMP004",
    department: "Sales",
    position: "Sales Executive",
    clockIn: "09:15 AM",
    clockOut: "06:00 PM",
    workHours: "8h 45m",
    overtime: "0h 45m",
    status: "late",
    location: "Office - Floor 1",
    note: "Client meetings and follow-ups",
    avatar: "DT",
    profileImage: "david_profile.jpg"
  },
  {
    id: 5,
    name: "Lisa Wang",
    employeeId: "EMP005",
    department: "HR",
    position: "HR Specialist",
    clockIn: "08:00 AM",
    clockOut: "05:00 PM",
    workHours: "9h 00m",
    overtime: "1h 00m",
    status: "present",
    location: "Office - Floor 2",
    note: "Employee onboarding and training sessions",
    avatar: "LW",
    profileImage: "lisa_profile.jpg"
  },
  {
    id: 6,
    name: "James Wilson",
    employeeId: "EMP006",
    department: "Finance",
    position: "Financial Analyst",
    clockIn: "08:45 AM",
    clockOut: "05:30 PM",
    workHours: "8h 45m",
    overtime: "0h 45m",
    status: "present",
    location: "Office - Floor 4",
    note: "Monthly financial reports and analysis",
    avatar: "JW",
    profileImage: "james_profile.jpg"
  },
  {
    id: 7,
    name: "Anna Kowalski",
    employeeId: "EMP007",
    department: "Operations",
    position: "Operations Manager",
    clockIn: "07:30 AM",
    clockOut: "04:30 PM",
    workHours: "9h 00m",
    overtime: "1h 00m",
    status: "early",
    location: "Office - Floor 1",
    note: "Supply chain optimization meeting",
    avatar: "AK",
    profileImage: "anna_profile.jpg"
  },
  {
    id: 8,
    name: "Robert Martinez",
    employeeId: "EMP008",
    department: "IT",
    position: "System Administrator",
    clockIn: "09:00 AM",
    clockOut: "06:00 PM",
    workHours: "9h 00m",
    overtime: "1h 00m",
    status: "present",
    location: "Office - Server Room",
    note: "System maintenance and security updates",
    avatar: "RM",
    profileImage: "robert_profile.jpg"
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "present":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "late":
      return <AlertCircle className="h-4 w-4 text-amber-600" />
    case "early":
      return <Clock className="h-4 w-4 text-blue-600" />
    case "absent":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-400" />
  }
}

const getStatusBadge = (status: string) => {
  const variants = {
    present: "bg-green-50 text-green-700 border-green-200",
    late: "bg-amber-50 text-amber-700 border-amber-200",
    early: "bg-blue-50 text-blue-700 border-blue-200",
    absent: "bg-red-50 text-red-700 border-red-200"
  }
  
  return (
    <Badge className={`${variants[status as keyof typeof variants]} capitalize font-medium`}>
      {status}
    </Badge>
  )
}

export function AttendancePage() {
  const [currentDate, setCurrentDate] = React.useState("Monday, December 28, 2025")

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">Employee Attendance</h1>
              <p className="text-gray-600">Monitor and manage employee attendance records</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Date Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-semibold text-gray-700 px-3">{currentDate}</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: 2 minutes ago
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Present</CardTitle>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">247</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm font-medium">+5.2%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">vs yesterday</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Late Arrivals</CardTitle>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">12</span>
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="h-3 w-3" />
                    <span className="text-sm font-medium">-2.1%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">vs yesterday</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Absent</CardTitle>
                <div className="p-2 bg-red-50 rounded-lg">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">8</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingDown className="h-3 w-3" />
                    <span className="text-sm font-medium">-12.5%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">vs yesterday</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Avg. Hours</CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">8.7</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm font-medium">+0.3h</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">hours per day</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date Range
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem>Today</DropdownMenuItem>
                    <DropdownMenuItem>This Week</DropdownMenuItem>
                    <DropdownMenuItem>This Month</DropdownMenuItem>
                    <DropdownMenuItem>Custom Range</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                      <Filter className="h-4 w-4 mr-2" />
                      Department
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem>All Departments</DropdownMenuItem>
                    <DropdownMenuItem>Engineering</DropdownMenuItem>
                    <DropdownMenuItem>Marketing</DropdownMenuItem>
                    <DropdownMenuItem>Sales</DropdownMenuItem>
                    <DropdownMenuItem>HR</DropdownMenuItem>
                    <DropdownMenuItem>Finance</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                      <Filter className="h-4 w-4 mr-2" />
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem>All Status</DropdownMenuItem>
                    <DropdownMenuItem>Present</DropdownMenuItem>
                    <DropdownMenuItem>Late</DropdownMenuItem>
                    <DropdownMenuItem>Absent</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card className="bg-white shadow-sm border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 border-b border-gray-200">
                <TableHead className="w-[280px] py-4 px-6 font-semibold text-gray-700">Employee</TableHead>
                <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700">Status</TableHead>
                <TableHead className="w-[200px] py-4 px-6 font-semibold text-gray-700">Time In/Out</TableHead>
                <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700">Hours</TableHead>
                <TableHead className="w-[100px] py-4 px-6 font-semibold text-gray-700">Overtime</TableHead>
                <TableHead className="w-[180px] py-4 px-6 font-semibold text-gray-700">Location</TableHead>
                <TableHead className="py-4 px-6 font-semibold text-gray-700">Notes</TableHead>
                <TableHead className="w-[60px] py-4 px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((employee, index) => (
                <TableRow 
                  key={employee.id} 
                  className={`hover:bg-gray-50/50 border-b border-gray-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                          {employee.avatar}
                        </div>
                        {getStatusIcon(employee.status) && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                            {getStatusIcon(employee.status)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.employeeId} • {employee.position}</p>
                        <p className="text-xs text-gray-400">{employee.department}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    {getStatusBadge(employee.status)}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600 font-semibold">{employee.clockIn}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-red-600 font-semibold">{employee.clockOut}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="font-semibold text-gray-900">{employee.workHours}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    {employee.overtime !== "0h 00m" ? (
                      <span className="font-semibold text-amber-600">{employee.overtime}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm truncate">{employee.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-sm text-gray-600 line-clamp-2">{employee.note}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Record</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 bg-white rounded-lg p-4 border border-gray-200">
          <div>
            Showing 8 of 247 employees
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}