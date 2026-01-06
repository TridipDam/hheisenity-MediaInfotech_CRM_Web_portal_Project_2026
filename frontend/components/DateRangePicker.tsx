"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DateRange {
  from: Date | null
  to: Date | null
}

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
  className?: string
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const PRESET_RANGES = [
  {
    label: "Today",
    getValue: () => {
      const today = new Date()
      return { from: today, to: today }
    }
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return { from: yesterday, to: yesterday }
    }
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const today = new Date()
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 6)
      return { from: lastWeek, to: today }
    }
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const today = new Date()
      const lastMonth = new Date()
      lastMonth.setDate(lastMonth.getDate() - 29)
      return { from: lastMonth, to: today }
    }
  },
  {
    label: "This month",
    getValue: () => {
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      return { from: firstDay, to: today }
    }
  },
  {
    label: "Last month",
    getValue: () => {
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 0)
      return { from: firstDay, to: lastDay }
    }
  }
]

function CalendarGrid({ 
  currentMonth, 
  currentYear, 
  selectedRange, 
  onDateSelect,
  hoveredDate,
  onDateHover 
}: {
  currentMonth: number
  currentYear: number
  selectedRange: DateRange
  onDateSelect: (date: Date) => void
  hoveredDate: Date | null
  onDateHover: (date: Date | null) => void
}) {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const days = []
  
  // Previous month's trailing days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth, -i)
    days.push({ date, isCurrentMonth: false })
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    days.push({ date, isCurrentMonth: true })
  }
  
  // Next month's leading days
  const remainingCells = 42 - days.length
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(currentYear, currentMonth + 1, day)
    days.push({ date, isCurrentMonth: false })
  }

  const isDateInRange = (date: Date) => {
    if (!selectedRange.from || !selectedRange.to) return false
    return date >= selectedRange.from && date <= selectedRange.to
  }

  const isDateSelected = (date: Date) => {
    if (!selectedRange.from) return false
    if (!selectedRange.to) return date.toDateString() === selectedRange.from.toDateString()
    return date.toDateString() === selectedRange.from.toDateString() || 
           date.toDateString() === selectedRange.to.toDateString()
  }

  const isDateInHoverRange = (date: Date) => {
    if (!selectedRange.from || !hoveredDate || selectedRange.to) return false
    const start = selectedRange.from < hoveredDate ? selectedRange.from : hoveredDate
    const end = selectedRange.from < hoveredDate ? hoveredDate : selectedRange.from
    return date >= start && date <= end
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-2">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map(day => (
          <div key={day} className="h-7 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, isCurrentMonth }, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(date)}
            onMouseEnter={() => onDateHover(date)}
            onMouseLeave={() => onDateHover(null)}
            disabled={!isCurrentMonth}
            className={cn(
              "h-7 w-7 text-sm rounded transition-all duration-150 relative flex items-center justify-center",
              "hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500",
              !isCurrentMonth && "text-gray-300 cursor-not-allowed hover:bg-transparent",
              isCurrentMonth && "text-gray-900 hover:text-blue-700",
              isDateSelected(date) && "bg-blue-600 text-white hover:bg-blue-700 font-medium",
              isDateInRange(date) && !isDateSelected(date) && "bg-blue-100 text-blue-900",
              isDateInHoverRange(date) && "bg-blue-50 text-blue-700",
              isToday(date) && !isDateSelected(date) && "bg-gray-100 font-medium ring-1 ring-gray-300"
            )}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  )
}

export function DateRangePicker({ value, onChange, placeholder = "Select date range", className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedRange, setSelectedRange] = React.useState<DateRange>(value || { from: null, to: null })
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear())
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null)

  React.useEffect(() => {
    if (value) {
      setSelectedRange(value)
    }
  }, [value])

  const handleDateSelect = (date: Date) => {
    if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
      // Start new selection
      const newRange = { from: date, to: null }
      setSelectedRange(newRange)
    } else {
      // Complete the range
      const newRange = selectedRange.from <= date 
        ? { from: selectedRange.from, to: date }
        : { from: date, to: selectedRange.from }
      setSelectedRange(newRange)
      onChange?.(newRange)
      setIsOpen(false)
    }
  }

  const handlePresetSelect = (preset: typeof PRESET_RANGES[0]) => {
    const range = preset.getValue()
    setSelectedRange(range)
    onChange?.(range)
    setIsOpen(false)
  }

  const handleClear = () => {
    const clearedRange = { from: null, to: null }
    setSelectedRange(clearedRange)
    onChange?.(clearedRange)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const formatDateRange = () => {
    if (!selectedRange.from) return placeholder
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      })
    }
    
    if (!selectedRange.to) {
      return formatDate(selectedRange.from)
    }
    
    if (selectedRange.from.toDateString() === selectedRange.to.toDateString()) {
      return formatDate(selectedRange.from)
    }
    
    return `${formatDate(selectedRange.from)} - ${formatDate(selectedRange.to)}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal border-gray-300 hover:bg-gray-50 h-10",
            !selectedRange.from && "text-gray-500",
            className
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
          <span className="flex-1 truncate">{formatDateRange()}</span>
          {selectedRange.from && (
            <X 
              className="ml-2 h-4 w-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-0.5" 
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-md border border-gray-200" align="start">
        <div className="flex bg-white rounded-md overflow-hidden">
          {/* Preset Ranges */}
          <div className="border-r border-gray-200 bg-gray-50/30">
            <div className="p-3 space-y-1 min-w-[140px]">
              <div className="text-xs font-medium text-gray-700 mb-2">Quick Select</div>
              {PRESET_RANGES.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetSelect(preset)}
                  className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-white hover:shadow-sm transition-colors text-gray-700 hover:text-gray-900"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Calendar */}
          <div className="p-3 min-w-[240px]">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-7 w-7 p-0 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium text-gray-900 px-2">
                {MONTHS[currentMonth]} {currentYear}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-7 w-7 p-0 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Calendar Grid */}
            <CalendarGrid
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedRange={selectedRange}
              onDateSelect={handleDateSelect}
              hoveredDate={hoveredDate}
              onDateHover={setHoveredDate}
            />
            
            {/* Selected Range Display */}
            {selectedRange.from && (
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Selected:</span>
                  <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {formatDateRange()}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}