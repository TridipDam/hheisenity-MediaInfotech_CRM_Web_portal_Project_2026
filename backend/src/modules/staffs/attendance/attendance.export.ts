// modules/staffs/attendance/attendance.export.ts
import { Request, Response } from 'express'
import ExcelJS from 'exceljs'
import puppeteer from 'puppeteer'
import { prisma } from '@/lib/prisma'

interface ExportFilters {
  dateFrom?: string
  dateTo?: string
  date?: string
  employeeId?: string
  status?: string
}

// Helper function to get attendance data for export
async function getAttendanceDataForExport(filters: ExportFilters) {
  const where: any = {}
  
  if (filters.employeeId) {
    const employee = await prisma.fieldEngineer.findUnique({
      where: { employeeId: filters.employeeId }
    })
    if (employee) {
      where.employeeId = employee.id
    }
  }

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.date) {
    const targetDate = new Date(filters.date)
    targetDate.setHours(0, 0, 0, 0)
    where.date = targetDate
  } else if (filters.dateFrom || filters.dateTo) {
    where.date = {}
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      fromDate.setHours(0, 0, 0, 0)
      where.date.gte = fromDate
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999)
      where.date.lte = toDate
    }
  }

  const attendances = await prisma.attendance.findMany({
    where,
    include: {
      employee: {
        select: {
          name: true,
          employeeId: true,
          email: true,
          phone: true,
          teamId: true,
          isTeamLeader: true
        }
      },
      assignedTask: {
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          location: true,
          startTime: true,
          endTime: true,
          assignedBy: true,
          status: true
        }
      }
    },
    orderBy: [
      { date: 'desc' },
      { createdAt: 'desc' }
    ]
  })

  return attendances.map(attendance => ({
    employeeId: attendance.employee.employeeId,
    employeeName: attendance.employee.name,
    email: attendance.employee.email,
    phone: attendance.employee.phone,
    teamId: attendance.employee.teamId,
    isTeamLeader: attendance.employee.isTeamLeader,
    date: attendance.date.toISOString().split('T')[0],
    clockIn: attendance.clockIn?.toISOString(),
    clockOut: attendance.clockOut?.toISOString(),
    status: attendance.status,
    source: attendance.source,
    location: attendance.location,
    latitude: attendance.latitude ? Number(attendance.latitude) : undefined,
    longitude: attendance.longitude ? Number(attendance.longitude) : undefined,
    ipAddress: attendance.ipAddress,
    deviceInfo: attendance.deviceInfo,
    locked: attendance.locked,
    lockedReason: attendance.lockedReason,
    attemptCount: attendance.attemptCount,
    taskStartTime: attendance.taskStartTime,
    taskEndTime: attendance.taskEndTime,
    taskLocation: attendance.taskLocation,
    createdAt: attendance.createdAt.toISOString(),
    updatedAt: attendance.updatedAt.toISOString(),
    assignedTask: attendance.assignedTask ? {
      title: attendance.assignedTask.title,
      description: attendance.assignedTask.description,
      category: attendance.assignedTask.category,
      location: attendance.assignedTask.location,
      startTime: attendance.assignedTask.startTime,
      endTime: attendance.assignedTask.endTime,
      assignedBy: attendance.assignedTask.assignedBy,
      status: attendance.assignedTask.status
    } : null
  }))
}

// Helper function to calculate work hours
function calculateWorkHours(clockIn?: string, clockOut?: string) {
  if (!clockIn) return { worked: '-', overtime: '-' }
  
  const start = new Date(clockIn)
  const end = clockOut ? new Date(clockOut) : new Date()
  
  const diffMs = end.getTime() - start.getTime()
  if (diffMs <= 0) return { worked: '-', overtime: '-' }
  
  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const standardMinutes = 8 * 60 // 8 hours
  
  const workedMinutes = Math.min(totalMinutes, standardMinutes)
  const overtimeMinutes = Math.max(totalMinutes - standardMinutes, 0)
  
  const format = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }
  
  return {
    worked: format(workedMinutes),
    overtime: overtimeMinutes > 0 ? format(overtimeMinutes) : '0h 0m'
  }
}

export const exportAttendanceToExcel = async (req: Request, res: Response) => {
  try {
    const filters: ExportFilters = {
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
      date: req.query.date as string,
      employeeId: req.query.employeeId as string,
      status: req.query.status as string
    }

    const attendanceData = await getAttendanceDataForExport(filters)

    // Create a new workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Attendance Report')

    // Set up the header row
    const headers = [
      'Employee ID',
      'Employee Name',
      'Email',
      'Phone',
      'Team ID',
      'Team Leader',
      'Date',
      'Status',
      'Clock In',
      'Clock Out',
      'Work Hours',
      'Overtime',
      'Location',
      'Task Title',
      'Task Status',
      'Task Location',
      'Device Info',
      'IP Address',
      'Source',
      'Created At'
    ]

    // Add headers with styling
    const headerRow = worksheet.addRow(headers)
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '366092' }
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
    })

    // Add data rows
    attendanceData.forEach((record) => {
      const workHours = calculateWorkHours(record.clockIn, record.clockOut)
      
      const row = worksheet.addRow([
        record.employeeId,
        record.employeeName,
        record.email,
        record.phone || '',
        record.teamId || '',
        record.isTeamLeader ? 'Yes' : 'No',
        record.date,
        record.status,
        record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '-',
        record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-',
        workHours.worked,
        workHours.overtime,
        record.location || '',
        record.assignedTask?.title || '',
        record.assignedTask?.status || '',
        record.taskLocation || record.assignedTask?.location || '',
        record.deviceInfo || '',
        record.ipAddress || '',
        record.source,
        new Date(record.createdAt).toLocaleString()
      ])

      // Add borders to data cells
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })

      // Color code status
      const statusCell = row.getCell(8) // Status column
      switch (record.status) {
        case 'PRESENT':
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8F5E8' } }
          break
        case 'LATE':
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3CD' } }
          break
        case 'ABSENT':
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8D7DA' } }
          break
      }
    })

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      let maxLength = 0
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10
        if (columnLength > maxLength) {
          maxLength = columnLength
        }
      })
      column.width = Math.min(maxLength + 2, 50) // Max width of 50
    })

    // Add summary at the top
    worksheet.insertRow(1, [])
    worksheet.insertRow(1, ['Attendance Report Summary'])
    worksheet.insertRow(2, [`Generated on: ${new Date().toLocaleString()}`])
    worksheet.insertRow(3, [`Total Records: ${attendanceData.length}`])
    worksheet.insertRow(4, [])

    // Style the summary
    const summaryRow = worksheet.getRow(1)
    summaryRow.getCell(1).font = { bold: true, size: 16 }
    
    const dateRow = worksheet.getRow(2)
    dateRow.getCell(1).font = { italic: true }

    // Set response headers
    const filename = `attendance-report-${new Date().toISOString().split('T')[0]}.xlsx`
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

    // Write to response
    await workbook.xlsx.write(res)
    res.end()

  } catch (error) {
    console.error('Error exporting to Excel:', error)
    res.status(500).json({ success: false, error: 'Failed to export to Excel' })
  }
}

export const exportAttendanceToPDF = async (req: Request, res: Response) => {
  try {
    const filters: ExportFilters = {
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
      date: req.query.date as string,
      employeeId: req.query.employeeId as string,
      status: req.query.status as string
    }

    const attendanceData = await getAttendanceDataForExport(filters)

    // Generate HTML content for PDF
    const htmlContent = generateHTMLReport(attendanceData, filters)

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      printBackground: true
    })

    await browser.close()

    // Set response headers
    const filename = `attendance-report-${new Date().toISOString().split('T')[0]}.pdf`
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

    res.send(pdfBuffer)

  } catch (error) {
    console.error('Error exporting to PDF:', error)
    res.status(500).json({ success: false, error: 'Failed to export to PDF' })
  }
}

function generateHTMLReport(attendanceData: any[], filters: ExportFilters): string {
  const currentDate = new Date().toLocaleString()
  
  // Generate filter summary
  let filterSummary = ''
  if (filters.date) {
    filterSummary += `Date: ${filters.date}<br>`
  } else if (filters.dateFrom || filters.dateTo) {
    filterSummary += `Date Range: ${filters.dateFrom || 'Start'} to ${filters.dateTo || 'End'}<br>`
  }
  if (filters.employeeId) {
    filterSummary += `Employee ID: ${filters.employeeId}<br>`
  }
  if (filters.status) {
    filterSummary += `Status: ${filters.status}<br>`
  }

  // Calculate statistics
  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter(r => r.status === 'PRESENT').length,
    late: attendanceData.filter(r => r.status === 'LATE').length,
    absent: attendanceData.filter(r => r.status === 'ABSENT').length
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Attendance Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          font-size: 12px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #366092;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #366092;
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .summary {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-item .number {
          font-size: 24px;
          font-weight: bold;
          color: #366092;
        }
        .summary-item .label {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        .filters {
          background: #e9ecef;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .filters h3 {
          margin: 0 0 10px 0;
          color: #366092;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #366092;
          color: white;
          font-weight: bold;
          text-align: center;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .status-present { background-color: #d4edda !important; }
        .status-late { background-color: #fff3cd !important; }
        .status-absent { background-color: #f8d7da !important; }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Employee Attendance Report</h1>
        <p>Generated on: ${currentDate}</p>
        <p>Total Records: ${attendanceData.length}</p>
      </div>

      <div class="summary">
        <div class="summary-item">
          <div class="number">${stats.present}</div>
          <div class="label">Present</div>
        </div>
        <div class="summary-item">
          <div class="number">${stats.late}</div>
          <div class="label">Late</div>
        </div>
        <div class="summary-item">
          <div class="number">${stats.absent}</div>
          <div class="label">Absent</div>
        </div>
        <div class="summary-item">
          <div class="number">${stats.total}</div>
          <div class="label">Total</div>
        </div>
      </div>

      ${filterSummary ? `
        <div class="filters">
          <h3>Applied Filters:</h3>
          ${filterSummary}
        </div>
      ` : ''}

      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Work Hours</th>
            <th>Overtime</th>
            <th>Location</th>
            <th>Task</th>
            <th>Device</th>
          </tr>
        </thead>
        <tbody>
          ${attendanceData.map(record => {
            const workHours = calculateWorkHours(record.clockIn, record.clockOut)
            const statusClass = `status-${record.status.toLowerCase()}`
            
            return `
              <tr class="${statusClass}">
                <td>${record.employeeId}</td>
                <td>${record.employeeName}</td>
                <td>${record.date}</td>
                <td>${record.status}</td>
                <td>${record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '-'}</td>
                <td>${record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'}</td>
                <td>${workHours.worked}</td>
                <td>${workHours.overtime}</td>
                <td>${record.location || '-'}</td>
                <td>${record.assignedTask?.title || '-'}</td>
                <td>${record.deviceInfo || '-'}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>This report was generated automatically by the Employee Attendance Management System.</p>
        <p>For questions or concerns, please contact your system administrator.</p>
      </div>
    </body>
    </html>
  `
}