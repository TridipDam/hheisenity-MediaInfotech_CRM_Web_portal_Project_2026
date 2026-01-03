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
  DollarSign, 
  Users, 
  TrendingUp,
  TrendingDown,
  Calculator,
  CreditCard,
  FileText,
  MoreVertical,
  Eye,
  Send
} from "lucide-react"

// Mock data for payroll
const payrollData = [
  {
    id: 1,
    name: "Sarah Johnson",
    employeeId: "EMP001",
    department: "Engineering",
    position: "Senior Developer",
    baseSalary: 6800000,
    overtime: 100000,
    bonus: 160000,
    deductions: 68000,
    netPay: 6992000,
    status: "processed",
    payPeriod: "Dec 1-15, 2025",
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    employeeId: "EMP002",
    department: "Marketing",
    position: "Marketing Manager",
    baseSalary: 6000000,
    overtime: 64000,
    bonus: 120000,
    deductions: 57600,
    netPay: 6126400,
    status: "pending",
    payPeriod: "Dec 1-15, 2025",
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    employeeId: "EMP003",
    department: "Design",
    position: "UX Designer",
    baseSalary: 5600000,
    overtime: 48000,
    bonus: 80000,
    deductions: 54400,
    netPay: 5673600,
    status: "processed",
    payPeriod: "Dec 1-15, 2025",
    avatar: "ER"
  },
  {
    id: 4,
    name: "David Thompson",
    employeeId: "EMP004",
    department: "Sales",
    position: "Sales Executive",
    baseSalary: 5200000,
    overtime: 76000,
    bonus: 240000,
    deductions: 52000,
    netPay: 5464000,
    status: "processed",
    payPeriod: "Dec 1-15, 2025",
    avatar: "DT"
  },
  {
    id: 5,
    name: "Lisa Wang",
    employeeId: "EMP005",
    department: "HR",
    position: "HR Specialist",
    baseSalary: 4800000,
    overtime: 32000,
    bonus: 64000,
    deductions: 46400,
    netPay: 4849600,
    status: "pending",
    payPeriod: "Dec 1-15, 2025",
    avatar: "LW"
  },
  {
    id: 6,
    name: "James Wilson",
    employeeId: "EMP006",
    department: "Finance",
    position: "Financial Analyst",
    baseSalary: 5760000,
    overtime: 57600,
    bonus: 96000,
    deductions: 55200,
    netPay: 5858400,
    status: "processed",
    payPeriod: "Dec 1-15, 2025",
    avatar: "JW"
  },
  {
    id: 7,
    name: "Anna Kowalski",
    employeeId: "EMP007",
    department: "Operations",
    position: "Operations Manager",
    baseSalary: 6400000,
    overtime: 88000,
    bonus: 144000,
    deductions: 62400,
    netPay: 6569600,
    status: "draft",
    payPeriod: "Dec 1-15, 2025",
    avatar: "AK"
  },
  {
    id: 8,
    name: "Robert Martinez",
    employeeId: "EMP008",
    department: "IT",
    position: "System Administrator",
    baseSalary: 5440000,
    overtime: 68000,
    bonus: 80000,
    deductions: 51200,
    netPay: 5536800,
    status: "processed",
    payPeriod: "Dec 1-15, 2025",
    avatar: "RM"
  }
]

const getStatusBadge = (status: string) => {
  const variants = {
    processed: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    draft: "bg-gray-50 text-gray-700 border-gray-200",
    failed: "bg-red-50 text-red-700 border-red-200"
  }
  
  return (
    <Badge className={`${variants[status as keyof typeof variants]} capitalize font-medium`}>
      {status}
    </Badge>
  )
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function PayrollPage() {
  const [currentPeriod, setCurrentPeriod] = React.useState("December 1-15, 2025")

  // Calculate totals
  const totalGrossPay = payrollData.reduce((sum, emp) => sum + emp.baseSalary + emp.overtime + emp.bonus, 0)
  const totalDeductions = payrollData.reduce((sum, emp) => sum + emp.deductions, 0)
  const totalNetPay = payrollData.reduce((sum, emp) => sum + emp.netPay, 0)
  const processedCount = payrollData.filter(emp => emp.status === 'processed').length

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
              <p className="text-gray-600">Manage employee compensation and payroll processing</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export Payroll
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Process Payroll
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Pay Period Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-semibold text-gray-700 px-3">{currentPeriod}</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last processed: 2 hours ago
            </div>
          </div>
        </div>

        {/* Payroll Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Gross Pay</CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{formatCurrency(totalGrossPay / 10000000)}Cr</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm font-medium">+3.2%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">vs last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Deductions</CardTitle>
                <div className="p-2 bg-red-50 rounded-lg">
                  <Calculator className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{formatCurrency(totalDeductions)}</span>
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm font-medium">+1.8%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">taxes & benefits</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Net Payroll</CardTitle>
                <div className="p-2 bg-green-50 rounded-lg">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{formatCurrency(totalNetPay / 10000000)}Cr</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm font-medium">+2.9%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">total payout</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Processed</CardTitle>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{processedCount}</span>
                  <span className="text-sm text-gray-500">/ {payrollData.length}</span>
                </div>
                <p className="text-sm text-gray-500">employees paid</p>
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
                      Pay Period
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem>Current Period</DropdownMenuItem>
                    <DropdownMenuItem>Previous Period</DropdownMenuItem>
                    <DropdownMenuItem>Last 3 Months</DropdownMenuItem>
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
                    <DropdownMenuItem>Processed</DropdownMenuItem>
                    <DropdownMenuItem>Pending</DropdownMenuItem>
                    <DropdownMenuItem>Draft</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Table */}
        <Card className="bg-white shadow-sm border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 border-b border-gray-200">
                <TableHead className="w-[280px] py-4 px-6 font-semibold text-gray-700">Employee</TableHead>
                <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700">Base Salary</TableHead>
                <TableHead className="w-[100px] py-4 px-6 font-semibold text-gray-700">Overtime</TableHead>
                <TableHead className="w-[100px] py-4 px-6 font-semibold text-gray-700">Bonus</TableHead>
                <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700">Deductions</TableHead>
                <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700">Net Pay</TableHead>
                <TableHead className="w-[120px] py-4 px-6 font-semibold text-gray-700">Status</TableHead>
                <TableHead className="w-[60px] py-4 px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((employee, index) => (
                <TableRow 
                  key={employee.id} 
                  className={`hover:bg-gray-50/50 border-b border-gray-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {employee.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.employeeId} • {employee.position}</p>
                        <p className="text-xs text-gray-400">{employee.department}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="font-semibold text-gray-900">{formatCurrency(employee.baseSalary)}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="font-semibold text-green-600">{formatCurrency(employee.overtime)}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="font-semibold text-blue-600">{formatCurrency(employee.bonus)}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="font-semibold text-red-600">-{formatCurrency(employee.deductions)}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="font-bold text-gray-900 text-lg">{formatCurrency(employee.netPay)}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    {getStatusBadge(employee.status)}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Paystub
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" />
                          Send Payment
                        </DropdownMenuItem>
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