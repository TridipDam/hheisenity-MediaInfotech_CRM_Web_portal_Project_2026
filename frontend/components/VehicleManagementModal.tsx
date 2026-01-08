"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getAllVehicles, getAllPetrolBills, createVehicle, Vehicle, PetrolBill } from "@/lib/server-api"
import {
  Car,
  Plus,
  Search,
  Eye,
  Edit,
  User
} from "lucide-react"

const getStatusBadge = (status: string) => {
  const variants = {
    AVAILABLE: "bg-green-50 text-green-700 border-green-200",
    ASSIGNED: "bg-blue-50 text-blue-700 border-blue-200",
    MAINTENANCE: "bg-yellow-50 text-yellow-700 border-yellow-200",
    OUT_OF_SERVICE: "bg-red-50 text-red-700 border-red-200"
  }

  return (
    <Badge className={`${variants[status as keyof typeof variants]} capitalize font-medium`}>
      {status.toLowerCase().replace('_', ' ')}
    </Badge>
  )
}

const getBillStatusBadge = (status: string) => {
  const variants = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    APPROVED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200"
  }

  return (
    <Badge className={`${variants[status as keyof typeof variants]} capitalize font-medium`}>
      {status.toLowerCase()}
    </Badge>
  )
}

export function VehicleManagementModal() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([])
  const [petrolBills, setPetrolBills] = React.useState<PetrolBill[]>([])
  const [loading, setLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState<'vehicles' | 'bills'>('vehicles')
  const [searchTerm, setSearchTerm] = React.useState("")

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [vehiclesResponse, billsResponse] = await Promise.all([
        getAllVehicles(),
        getAllPetrolBills()
      ])

      if (vehiclesResponse.success && vehiclesResponse.data) {
        setVehicles(vehiclesResponse.data)
      }

      if (billsResponse.success && billsResponse.data) {
        setPetrolBills(billsResponse.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVehicles = React.useMemo(() => {
    if (!searchTerm) return vehicles
    return vehicles.filter(vehicle =>
      vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [vehicles, searchTerm])

  const filteredBills = React.useMemo(() => {
    if (!searchTerm) return petrolBills
    return petrolBills.filter(bill =>
      bill.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [petrolBills, searchTerm])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vehicles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Car className="h-4 w-4 inline mr-2" />
            Vehicles ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('bills')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bills'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Petrol Bills ({petrolBills.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={activeTab === 'vehicles' ? "Search vehicles..." : "Search bills..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'vehicles' ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehicle.vehicleNumber}</div>
                      <div className="text-sm text-gray-500">
                        {vehicle.make} {vehicle.model} {vehicle.year && `(${vehicle.year})`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {vehicle.type.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(vehicle.status)}
                  </TableCell>
                  <TableCell>
                    {vehicle.employeeName ? (
                      <div>
                        <div className="font-medium">{vehicle.employeeName}</div>
                        <div className="text-sm text-gray-500">{vehicle.employeeId}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <User className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>
                    <div className="font-medium">{bill.vehicleNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{bill.employeeName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{bill.amount.toFixed(2)}</div>
                  </TableCell>
                  <TableCell>
                    {new Date(bill.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getBillStatusBadge(bill.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {bill.status === 'PENDING' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            Approve
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}