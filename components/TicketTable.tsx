"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type Ticket = {
  id: string
  title: string
  date: Date
  category: string
  userName: string
  status: "Medium" | "High"
  isOpen: boolean
}

const openedData: Ticket[] = [
  {
    id: "59678",
    title: "Designing with Adobe Illustrator",
    date: new Date("2026-04-09"),
    category: "Inefficient Algorithms",
    userName: "Jane Austen",
    status: "Medium",
    isOpen: true,
  },
  {
    id: "21234",
    title: "Creating Stunning Logos",
    date: new Date("2026-02-28"),
    category: "Workflow Bottlenecks",
    userName: "J.K. Rowling",
    status: "High",
    isOpen: true,
  },
  {
    id: "46890",
    title: "Animation Basics with After Effects",
    date: new Date("2026-07-28"),
    category: "Script Errors",
    userName: "Harper Lee",
    status: "Medium",
    isOpen: true,
  },
  {
    id: "12345",
    title: "Advanced Photo Editing Techniques",
    date: new Date("2026-03-15"),
    category: "Performance Issues",
    userName: "Mark Twain",
    status: "High",
    isOpen: true,
  },
  {
    id: "67890",
    title: "Web Design Fundamentals",
    date: new Date("2026-05-20"),
    category: "UI/UX Problems",
    userName: "Virginia Woolf",
    status: "Medium",
    isOpen: true,
  },
  {
    id: "54321",
    title: "Digital Illustration Masterclass",
    date: new Date("2026-06-10"),
    category: "Technical Debt",
    userName: "Ernest Hemingway",
    status: "High",
    isOpen: true,
  },
  {
    id: "98765",
    title: "Typography and Layout Design",
    date: new Date("2026-08-05"),
    category: "Design System",
    userName: "George Orwell",
    status: "Medium",
    isOpen: true,
  },
  {
    id: "11111",
    title: "Color Theory in Practice",
    date: new Date("2026-09-12"),
    category: "Visual Design",
    userName: "Agatha Christie",
    status: "Medium",
    isOpen: true,
  },
  {
    id: "22222",
    title: "Brand Identity Development",
    date: new Date("2026-10-18"),
    category: "Marketing Materials",
    userName: "Charles Dickens",
    status: "High",
    isOpen: true,
  },
  {
    id: "33333",
    title: "Infographic Creation Guide",
    date: new Date("2026-11-22"),
    category: "Data Visualization",
    userName: "Emily Bronte",
    status: "Medium",
    isOpen: true,
  },
]

const closedData: Ticket[] = [
  {
    id: "44444",
    title: "Completed Project A",
    date: new Date("2025-12-15"),
    category: "Completed",
    userName: "William Shakespeare",
    status: "Medium",
    isOpen: false,
  },
  {
    id: "55555",
    title: "Completed Project B",
    date: new Date("2025-11-20"),
    category: "Completed",
    userName: "Jane Doe",
    status: "High",
    isOpen: false,
  },
  {
    id: "66666",
    title: "Completed Project C",
    date: new Date("2025-10-10"),
    category: "Completed",
    userName: "John Smith",
    status: "Medium",
    isOpen: false,
  },
  {
    id: "77777",
    title: "Completed Project D",
    date: new Date("2025-09-05"),
    category: "Completed",
    userName: "Alice Johnson",
    status: "Medium",
    isOpen: false,
  },
  {
    id: "88888",
    title: "Completed Project E",
    date: new Date("2025-08-01"),
    category: "Completed",
    userName: "Bob Williams",
    status: "High",
    isOpen: false,
  },
]

const columns: ColumnDef<Ticket>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "sno",
    header: "S.No.",
    enableSorting: false,
    cell: ({row, table}) => {
      const pageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const serialNumber = (pageIndex * pageSize) + row.index + 1
      return <div className="font-medium">{serialNumber.toString().padStart(2, '0')}</div>
    }
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Ticket ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium text-slate-900">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const ticket = row.original
      const formattedDate = ticket.date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      return (
        <div className="max-w-[400px] whitespace-normal">
          <div className="font-semibold text-slate-900 text-sm">{ticket.title}</div>
          <div className="text-xs text-slate-500 mt-0.5">{formattedDate}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-slate-700">{row.getValue("category")}</div>,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          User Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-slate-700">{row.getValue("userName")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as "Medium" | "High"
      return (
        <Badge 
          variant={status === "High" ? "destructive" : "secondary"}
          className={`font-medium px-2 py-0.5 text-xs ${
            status === "High" 
              ? "bg-red-100 text-red-800 border-red-200" 
              : "bg-blue-100 text-blue-800 border-blue-200"
          }`}
        >
          {status} Priority
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: () => {
      return (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
          >
            <span className="sr-only">View ticket</span>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 w-7 p-0 hover:bg-slate-100"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase">Actions</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer">
                Edit Ticket
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Assign Agent
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Close Ticket
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600">
                Delete Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export function TicketTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [activeTab, setActiveTab] = React.useState("opened")
  const [globalFilter, setGlobalFilter] = React.useState("")

  const currentData = activeTab === "opened" ? openedData : closedData

  const table = useReactTable({
    data: currentData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const openedCount = openedData.length
  const closedCount = closedData.length

  return (
    <div className="w-full space-y-3 bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Support Tickets</h2>
            <p className="text-xs text-slate-600 mt-0.5">Manage and track customer support requests</p>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-white border border-slate-200 shadow-sm">
              <TabsTrigger 
                value="opened" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-3 py-1.5 text-sm"
              >
                Open Tickets ({openedCount})
              </TabsTrigger>
              <TabsTrigger 
                value="closed"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium px-3 py-1.5 text-sm"
              >
                Closed Tickets ({closedCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 mt-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search tickets, users, or categories..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8 pr-12 h-8 text-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border bg-slate-100 px-1 font-mono text-[9px] font-medium text-slate-500">
              <span className="text-[8px]">⌘</span>K
            </kbd>
          </div>
          
          <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 h-8 px-3 text-xs">
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            Filter
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 h-8 px-3 text-xs">
                Sort by
                <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter((column) => column.getCanSort())
                .map((column) => {
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      className="cursor-pointer"
                    >
                      {column.id}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </DropdownMenuItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm bg-white">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-slate-200 bg-slate-50/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      className={`px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider ${header.column.id === "title" ? "whitespace-normal" : "whitespace-nowrap"}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-25"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isTitleColumn = cell.column.id === "title"
                    return (
                      <TableCell 
                        key={cell.id} 
                        className={`px-4 py-2.5 text-sm ${isTitleColumn ? "whitespace-normal" : "whitespace-nowrap"}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                      <Search className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium">No tickets found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search or filter criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white border-t border-slate-200 px-4 py-2.5">
        <div className="text-xs text-slate-600">
          Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{" "}
          of <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> results
        </div>
        <div className="flex items-center space-x-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-slate-300 hover:bg-slate-50 disabled:opacity-50 h-7 px-2.5 text-xs"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-slate-600">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-slate-300 hover:bg-slate-50 disabled:opacity-50 h-7 px-2.5 text-xs"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}