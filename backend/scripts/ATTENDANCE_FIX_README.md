# Attendance Hours & Overtime Fix

## Problem
The hours and overtime calculations in the attendance table were showing "-" because:
1. Existing attendance records were missing `clockIn` and `clockOut` times
2. The backend service wasn't consistently setting these times when creating/updating records
3. The frontend calculation required both times to work properly

## What Was Fixed

### Backend Changes (attendance.service.ts)
1. **Improved clockIn/clockOut handling**: Now properly preserves existing times when updating records
2. **Added action-based logic**: Supports explicit 'check-in' and 'check-out' actions
3. **Default behavior**: Automatically sets clockIn for PRESENT/LATE status when no action specified
4. **Consistent across all paths**: Admin entries, bypass validation, and normal validation all follow same logic

### Frontend Changes (AttendancePage.tsx)
1. **Enhanced calculation**: Now shows hours worked even if clockOut is missing (calculates up to current time)
2. **Better display**: Shows "Working..." for employees who checked in but haven't checked out yet
3. **Improved Time In/Out column**: Displays both check-in and check-out times clearly

### Component Updates
1. **AddAttendanceRecord.tsx**: Now explicitly sets `action: 'check-in'` when creating records
2. **EmployeeSelfAttendance.tsx**: Already properly passing action parameter (no changes needed)

## How to Fix Existing Data

Run this script to update existing attendance records that are missing clockIn times:

```bash
# From the backend directory
node scripts/fix-attendance-times.js
```

This will:
- Find all PRESENT/LATE records without clockIn times
- Set their clockIn to their createdAt timestamp
- Preserve all other data

## How It Works Now

### Check-In Flow
1. Employee/Admin creates attendance with `action: 'check-in'`
2. Backend sets `clockIn = new Date()`
3. Frontend displays check-in time and calculates hours worked so far

### Check-Out Flow
1. Employee marks attendance with `action: 'check-out'`
2. Backend sets `clockOut = new Date()` (preserves existing clockIn)
3. Frontend calculates total hours worked and overtime

### Hours Calculation
- **Standard work hours**: 8 hours (configurable via STANDARD_WORK_HOURS)
- **Worked hours**: Min(total time, 8 hours)
- **Overtime**: Max(total time - 8 hours, 0)
- **If no clockOut**: Calculates hours from clockIn to current time (shows as "Working...")

## Testing

After applying the fix:
1. Check existing attendance records - should show hours worked
2. Create new attendance - should automatically set clockIn
3. Check-out - should calculate total hours and overtime
4. Verify overtime shows for employees working >8 hours

## Notes
- The fix is backward compatible - old records without action parameter will still work
- Admin-created records are marked with `source: 'ADMIN'`
- Employee self-attendance is marked with `source: 'SELF'`
- All times are stored in UTC and displayed in local timezone
