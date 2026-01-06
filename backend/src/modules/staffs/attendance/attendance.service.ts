// attendance.service.ts
import { prisma } from '@/lib/prisma'
import {
  AttendanceRecord,
  GeolocationCoordinates
} from './attendance.types'
import {
  getHumanReadableLocation,
  getLocationFromCoordinates,
  getCoordinatesFromLocation,
  calculateDistanceMeters
} from '@/utils/geolocation'
import { getDeviceInfo } from '@/utils/deviceinfo'

// Environment-configurable defaults
const DEFAULT_ATTENDANCE_RADIUS_METERS = Number(process.env.DEFAULT_ATTENDANCE_RADIUS_METERS || 50)
const DEFAULT_FLEXIBLE_WINDOW_MINUTES = Number(process.env.DEFAULT_FLEXIBLE_WINDOW_MINUTES || 120)
const MAX_ATTEMPTS = 3

// Helper functions to convert between AttemptCount enum and numbers
function attemptCountToNumber(attemptCount: any): number {
  if (attemptCount === 'ZERO') return 0
  if (attemptCount === 'ONE') return 1
  if (attemptCount === 'TWO') return 2
  if (attemptCount === 'THREE') return 3
  return 0
}

function numberToAttemptCount(num: number): any {
  if (num <= 0) return 'ZERO'
  if (num === 1) return 'ONE'
  if (num === 2) return 'TWO'
  if (num >= 3) return 'THREE'
  return 'ZERO'
}

type ValidationResult = {
  isMatch: boolean
  confidence: 'exact' | 'nearby' | 'city' | 'none'
  details: string
  distance?: number
  radiusUsed?: number
  assignedCoords?: GeolocationCoordinates | null
  code?: string
}

// Strictly consider 0,0 as placeholder / invalid
function hasValidCoordinates(coords?: GeolocationCoordinates | null) {
  if (!coords) return false
  const lat = Number(coords.latitude)
  const lon = Number(coords.longitude)
  if (Number.isNaN(lat) || Number.isNaN(lon)) return false
  // treat 0,0 as invalid placeholder
  return !(lat === 0 && lon === 0)
}

// Validate by GPS coordinates (Haversine)
async function validateLocationByGPS(
  userCoordinates: GeolocationCoordinates,
  assignedCoordinates: GeolocationCoordinates,
  allowedRadiusMeters: number
): Promise<ValidationResult> {
  try {
    if (!hasValidCoordinates(assignedCoordinates)) {
      return {
        isMatch: false,
        confidence: 'none',
        details: 'Assigned coordinates are not present or invalid',
        code: 'ASSIGNED_COORDS_MISSING'
      }
    }

    const distance = Math.round(
      calculateDistanceMeters(
        userCoordinates.latitude,
        userCoordinates.longitude,
        assignedCoordinates.latitude,
        assignedCoordinates.longitude
      )
    )

    if (distance <= allowedRadiusMeters) {
      return {
        isMatch: true,
        confidence: 'exact',
        details: `Within ${allowedRadiusMeters}m (distance: ${distance}m)`,
        distance,
        radiusUsed: allowedRadiusMeters,
        assignedCoords: assignedCoordinates
      }
    }

    if (distance <= allowedRadiusMeters * 2) {
      return {
        isMatch: false,
        confidence: 'nearby',
        details: `Close but outside allowed radius (${distance}m away, allowed ${allowedRadiusMeters}m)`,
        distance,
        radiusUsed: allowedRadiusMeters,
        assignedCoords: assignedCoordinates,
        code: 'LOCATION_MISMATCH'
      }
    }

    return {
      isMatch: false,
      confidence: 'none',
      details: `Too far from assigned coordinates (${distance}m > ${allowedRadiusMeters}m)`,
      distance,
      radiusUsed: allowedRadiusMeters,
      assignedCoords: assignedCoordinates,
      code: 'LOCATION_MISMATCH'
    }
  } catch (err) {
    console.error({ event: 'validate_gps_error', error: err instanceof Error ? err.message : err })
    return { isMatch: false, confidence: 'none', details: 'Error validating GPS', code: 'LOCATION_SERVICE_ERROR' }
  }
}

// Area-based fallback: token matching (coarse)
async function validateLocationByArea(
  userCoordinates: GeolocationCoordinates,
  assignedLocationText: string
): Promise<ValidationResult> {
  try {
    const userLocation = await getLocationFromCoordinates(userCoordinates)
    if (!userLocation) {
      return { isMatch: false, confidence: 'none', details: 'Could not reverse geocode user coordinates', code: 'LOCATION_SERVICE_ERROR' }
    }

    const userAddress = (userLocation.address || '').toLowerCase()
    const userCity = (userLocation.city || '').toLowerCase()
    const assignedNormalized = assignedLocationText.toLowerCase().trim()

    // Split assignedName into meaningful keywords
    const assignedKeywords = assignedNormalized
      .split(/[\s,.-]+/)
      .map(w => w.trim())
      .filter(w => w.length > 2)

    // If nothing meaningful, cannot validate
    if (assignedKeywords.length === 0) {
      return { isMatch: false, confidence: 'none', details: 'Assigned location too generic for area validation', code: 'ASSIGNED_LOCATION_GENERIC' }
    }

    // Check exact terms in user address first
    for (const kw of assignedKeywords) {
      if (userAddress.includes(kw)) {
        return { isMatch: true, confidence: 'exact', details: `Matched keyword "${kw}" in user address` }
      }
    }

    // City-level match is weaker
    for (const kw of assignedKeywords) {
      if (userCity.includes(kw)) {
        return { isMatch: false, confidence: 'city', details: `User is in ${userCity} but not in the assigned area ${assignedNormalized}`, code: 'CITY_LEVEL_MATCH' }
      }
    }

    return { isMatch: false, confidence: 'none', details: `No area-level match: user ${userAddress}, assigned ${assignedNormalized}`, code: 'LOCATION_MISMATCH' }
  } catch (err) {
    console.error({ event: 'validate_area_error', error: err instanceof Error ? err.message : err })
    return { isMatch: false, confidence: 'none', details: 'Error validating area', code: 'LOCATION_SERVICE_ERROR' }
  }
}

// Main validator used by controller/service. Returns rich metadata.
export async function validateEmployeeLocation(
  employeeId: string,
  coordinates: GeolocationCoordinates
): Promise<{
  isValid: boolean
  details: string
  code?: string
  distance?: number
  radiusUsed?: number
  assignedCoords?: GeolocationCoordinates | null
  confidence?: 'exact' | 'nearby' | 'city' | 'none'
  allowedLocation?: any
}> {
  // Normalize config
  const now = new Date()

  // Find employee
  const employee = await prisma.fieldEngineer.findUnique({ where: { employeeId } })
  if (!employee) {
    return { isValid: false, details: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' }
  }

  // Find today's assignment
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dailyLocation = await prisma.dailyLocation.findUnique({
    where: { employeeId_date: { employeeId: employee.id, date: today } }
  })

  if (!dailyLocation) {
    return { isValid: false, details: 'No assigned location for today', code: 'NO_ASSIGNMENT' }
  }

  // time windows
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const startMinutes = dailyLocation.startTime.getHours() * 60 + dailyLocation.startTime.getMinutes()
  const endMinutes = dailyLocation.endTime.getHours() * 60 + dailyLocation.endTime.getMinutes()

  // Determine assignment type
  const assignedLat = Number(dailyLocation.latitude)
  const assignedLon = Number(dailyLocation.longitude)
  const assignedHasCoords = hasValidCoordinates({ latitude: assignedLat, longitude: assignedLon })
  const assignedAreaText = (dailyLocation.address || dailyLocation.city || '').toString().trim()

  // Strict time enforcement for GPS-based assignments
  if (assignedHasCoords) {
    if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
      return {
        isValid: false,
        details: `Attendance only allowed between ${dailyLocation.startTime.toLocaleTimeString()} and ${dailyLocation.endTime.toLocaleTimeString()}`,
        code: 'TIME_WINDOW_VIOLATION',
        allowedLocation: dailyLocation
      }
    }
  } else {
    // flexible window for area/task-based
    const flex = DEFAULT_FLEXIBLE_WINDOW_MINUTES // Remove flexibleWindowMinutes as it doesn't exist in schema
    const flexStart = startMinutes - flex
    const flexEnd = Math.max(endMinutes, startMinutes) + flex
    if (currentMinutes < flexStart || currentMinutes > flexEnd) {
      const s = new Date()
      s.setHours(Math.floor(flexStart / 60), flexStart % 60, 0, 0)
      const e = new Date()
      e.setHours(Math.floor(flexEnd / 60), flexEnd % 60, 0, 0)
      return {
        isValid: false,
        details: `Attendance allowed between ${s.toLocaleTimeString()} and ${e.toLocaleTimeString()} (flexible window)`,
        code: 'TIME_WINDOW_VIOLATION',
        allowedLocation: dailyLocation
      }
    }
  }

  // Reverse geocode for user readability (removed unused variable)

  // If assigned coordinates exist, prefer them (authoritative)
  if (assignedHasCoords) {
    const assignedCoords: GeolocationCoordinates = { latitude: assignedLat, longitude: assignedLon }
    const radiusToUse = Number(dailyLocation.radius ?? DEFAULT_ATTENDANCE_RADIUS_METERS)

    const gpsResult = await validateLocationByGPS(coordinates, assignedCoords, radiusToUse)
    console.info({
      event: 'validate_gps_attempt',
      employeeId,
      assignedCoords,
      userCoords: coordinates,
      gpsResult
    })

    if (gpsResult.isMatch) {
      return {
        isValid: true,
        details: gpsResult.details,
        distance: gpsResult.distance,
        radiusUsed: gpsResult.radiusUsed,
        assignedCoords,
        confidence: gpsResult.confidence
      }
    }

    // GPS failed: do NOT mark present. Return detailed info to caller
    return {
      isValid: false,
      details: gpsResult.details,
      code: gpsResult.code || 'LOCATION_MISMATCH',
      distance: gpsResult.distance,
      radiusUsed: gpsResult.radiusUsed,
      assignedCoords,
      confidence: gpsResult.confidence,
      allowedLocation: dailyLocation
    }
  }

  // Assigned has no coordinates -> attempt forward geocoding once
  if (assignedAreaText) {
    const geocode = await getCoordinatesFromLocation(assignedAreaText)
    console.info({ event: 'forward_geocode', assignedAreaText, geocode })

    if (geocode && geocode.latitude && geocode.longitude) {
      // If granularity is too coarse (city/region) treat as insufficient unless admin explicitly allowed large radius
      const adminRadius = Number(dailyLocation.radius ?? 0)
      const radiusToUse = adminRadius > 0 ? adminRadius : DEFAULT_ATTENDANCE_RADIUS_METERS

      if (geocode.granularity === 'city' || geocode.granularity === 'region' || geocode.granularity === 'country') {
        // only accept city/region-level if admin explicitly set a higher radius
        if (!adminRadius || adminRadius <= DEFAULT_ATTENDANCE_RADIUS_METERS) {
          // fallback to area-based token matching (coarse) — do not accept as exact GPS
          const areaResult = await validateLocationByArea(coordinates, assignedAreaText)
          return {
            isValid: areaResult.isMatch,
            details: areaResult.details,
            code: areaResult.code,
            confidence: areaResult.confidence,
            allowedLocation: dailyLocation
          }
        }
        // else admin allowed large radius - continue with GPS-style check using admin radius
      }

      // Use the forward-geocoded coords for GPS check
      const assignedCoords: GeolocationCoordinates = { latitude: geocode.latitude, longitude: geocode.longitude }
      const gpsResult = await validateLocationByGPS(coordinates, assignedCoords, radiusToUse)
      // attach assignedCoords and geocode metadata
      if (gpsResult.isMatch) {
        return {
          isValid: true,
          details: gpsResult.details,
          distance: gpsResult.distance,
          radiusUsed: gpsResult.radiusUsed,
          assignedCoords,
          confidence: gpsResult.confidence,
          allowedLocation: dailyLocation
        }
      } else {
        return {
          isValid: false,
          details: gpsResult.details,
          code: gpsResult.code || 'LOCATION_MISMATCH',
          distance: gpsResult.distance,
          radiusUsed: gpsResult.radiusUsed,
          assignedCoords,
          confidence: gpsResult.confidence,
          allowedLocation: dailyLocation
        }
      }
    } else {
      // Could not geocode assigned area — fallback to area matching
      const areaResult = await validateLocationByArea(coordinates, assignedAreaText)
      return {
        isValid: areaResult.isMatch,
        details: areaResult.details,
        code: areaResult.code,
        confidence: areaResult.confidence,
        allowedLocation: dailyLocation
      }
    }
  }

  // No coords + no area -> task-based (no location enforcement). If admin marked task-based, allow.
  return {
    isValid: true,
    details: 'Task-based assignment (no GPS required)',
    assignedCoords: null,
    confidence: 'exact',
    allowedLocation: dailyLocation
  }
}

// Create attendance record with atomic attempt increments and strict rules
export async function createAttendanceRecord(data: {
  employeeId: string
  coordinates?: GeolocationCoordinates
  ipAddress: string
  userAgent: string
  photo?: string
  status: 'PRESENT' | 'LATE'
  locationText?: string
  bypassLocationValidation?: boolean
  action?: 'check-in' | 'check-out' // Add action parameter
}): Promise<AttendanceRecord> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const employee = await prisma.fieldEngineer.findUnique({ where: { employeeId: data.employeeId } })
  if (!employee) throw new Error('EMPLOYEE_NOT_FOUND')

  // read existing attendance if any
  const existing = await prisma.attendance.findUnique({
    where: { employeeId_date: { employeeId: employee.id, date: today } }
  })

  // If coordinates provided, ensure they are in valid range and not 0,0 (which is placeholder)
  if (data.coordinates) {
    const lat = Number(data.coordinates.latitude)
    const lon = Number(data.coordinates.longitude)
    if (Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new Error('INVALID_COORDINATES')
    }
    if (lat === 0 && lon === 0 && !data.bypassLocationValidation && !data.locationText) {
      // never accept 0,0 as a valid coordinate for non-admin flows
      throw new Error('INVALID_COORDINATES')
    }
  }

  // Admin entry path (no coordinates accepted) — require locationText
  if ((!data.coordinates || (data.coordinates.latitude === 0 && data.coordinates.longitude === 0)) && data.locationText) {
    const deviceInfo = getDeviceInfo(data.userAgent)
    const deviceString = `${deviceInfo.os} - ${deviceInfo.browser} - ${deviceInfo.device}`
    // Upsert admin-provided attendance immediately (admin trusting)
    if (existing && existing.locked) throw new Error('ATTENDANCE_LOCKED')
    
    const updateData: any = {
      location: data.locationText,
      ipAddress: data.ipAddress,
      deviceInfo: deviceString,
      photo: data.photo ?? existing?.photo,
      status: data.status,
      updatedAt: new Date()
    }

    // Handle check-in/check-out for admin entries
    if (data.action === 'check-in') {
      updateData.clockIn = new Date()
    } else if (data.action === 'check-out') {
      updateData.clockOut = new Date()
    }

    const saved = existing
      ? await prisma.attendance.update({
          where: { id: existing.id },
          data: updateData
        })
      : await prisma.attendance.create({
          data: {
            employeeId: employee.id,
            date: today,
            clockIn: data.action === 'check-in' ? new Date() : null,
            clockOut: data.action === 'check-out' ? new Date() : null,
            latitude: null,
            longitude: null,
            location: data.locationText,
            ipAddress: data.ipAddress,
            deviceInfo: deviceString,
            photo: data.photo,
            status: data.status,
            lockedReason: '',
            locked: false,
            attemptCount: 'ZERO'
          }
        })

    return {
      employeeId: data.employeeId,
      timestamp: saved.createdAt.toISOString(),
      location: saved.location || data.locationText || '',
      ipAddress: saved.ipAddress || data.ipAddress || '',
      deviceInfo: saved.deviceInfo || deviceString || '',
      photo: saved.photo || data.photo || undefined,
      status: saved.status as any
    }
  }

  // Normal path: coordinates must be present (unless bypass)
  if (!data.coordinates && !data.bypassLocationValidation) {
    throw new Error('MISSING_COORDINATES')
  }

  // If bypass requested, create or update without validation
  if (data.bypassLocationValidation) {
    const human = data.coordinates ? await getHumanReadableLocation(data.coordinates) : data.locationText ?? 'Bypass'
    const deviceInfo = getDeviceInfo(data.userAgent)
    const deviceString = `${deviceInfo.os} - ${deviceInfo.browser} - ${deviceInfo.device}`
    if (existing && existing.locked) throw new Error('ATTENDANCE_LOCKED')
    
    const updateData: any = {
      latitude: data.coordinates ? data.coordinates.latitude : existing?.latitude,
      longitude: data.coordinates ? data.coordinates.longitude : existing?.longitude,
      location: human,
      ipAddress: data.ipAddress,
      deviceInfo: deviceString,
      photo: data.photo ?? existing?.photo,
      status: data.status,
      updatedAt: new Date()
    }

    // Handle check-in/check-out for bypass entries
    if (data.action === 'check-in') {
      updateData.clockIn = new Date()
    } else if (data.action === 'check-out') {
      updateData.clockOut = new Date()
    }

    const saved = existing
      ? await prisma.attendance.update({
          where: { id: existing.id },
          data: updateData
        })
      : await prisma.attendance.create({
          data: {
            employeeId: employee.id,
            date: today,
            clockIn: data.action === 'check-in' ? new Date() : null,
            clockOut: data.action === 'check-out' ? new Date() : null,
            latitude: data.coordinates ? data.coordinates.latitude : null,
            longitude: data.coordinates ? data.coordinates.longitude : null,
            location: human,
            ipAddress: data.ipAddress,
            deviceInfo: deviceString,
            photo: data.photo,
            status: data.status,
            lockedReason: '',
            locked: false,
            attemptCount: 'ZERO'
          }
        })

    return {
      employeeId: data.employeeId,
      timestamp: saved.createdAt.toISOString(),
      location: saved.location || human || '',
      ipAddress: saved.ipAddress || data.ipAddress || '',
      deviceInfo: saved.deviceInfo || deviceString || '',
      photo: saved.photo || data.photo || undefined,
      status: saved.status as any
    }
  }

  // Real validation: validate coordinates
  const validation = await validateEmployeeLocation(data.employeeId, data.coordinates as GeolocationCoordinates)

  if (!validation.isValid) {
    // Atomic increment of attemptCount using transaction
    const txResult = await prisma.$transaction(async (tx) => {
      // re-fetch inside tx to avoid race
      const att = await tx.attendance.findUnique({
        where: { employeeId_date: { employeeId: employee.id, date: today } }
      })

      const prevAttempts = att ? attemptCountToNumber(att.attemptCount) : 0
      const nextAttempts = Math.min(MAX_ATTEMPTS, prevAttempts + 1)

      // If reached max attempts -> mark ABSENT and lock
      if (nextAttempts >= MAX_ATTEMPTS) {
        const up = att
          ? await tx.attendance.update({
              where: { id: att.id },
              data: {
                status: 'ABSENT',
                attemptCount: numberToAttemptCount(nextAttempts),
                latitude: data.coordinates?.latitude ?? att.latitude,
                longitude: data.coordinates?.longitude ?? att.longitude,
                location: validation.details || att.location,
                ipAddress: data.ipAddress,
                deviceInfo: `${getDeviceInfo(data.userAgent).os} - ${getDeviceInfo(data.userAgent).browser} - ${getDeviceInfo(data.userAgent).device}`,
                lockedReason: 'Maximum location validation attempts exceeded',
                locked: true,
                updatedAt: new Date()
              }
            })
          : await tx.attendance.create({
              data: {
                employeeId: employee.id,
                date: today,
                status: 'ABSENT',
                attemptCount: numberToAttemptCount(nextAttempts),
                latitude: data.coordinates?.latitude ?? null,
                longitude: data.coordinates?.longitude ?? null,
                location: validation.details,
                ipAddress: data.ipAddress,
                deviceInfo: `${getDeviceInfo(data.userAgent).os} - ${getDeviceInfo(data.userAgent).browser} - ${getDeviceInfo(data.userAgent).device}`,
                lockedReason: 'Maximum location validation attempts exceeded',
                locked: true
              }
            })
        return { action: 'locked', record: up, attempts: nextAttempts }
      }

      // Otherwise upsert with PRESENT status (not PENDING as it's not in enum)
      const up = att
        ? await tx.attendance.update({
            where: { id: att.id },
            data: {
              attemptCount: numberToAttemptCount(nextAttempts),
              updatedAt: new Date()
            }
          })
        : await tx.attendance.create({
            data: {
              employeeId: employee.id,
              date: today,
              status: 'PRESENT', // Use PRESENT instead of PENDING
              attemptCount: numberToAttemptCount(nextAttempts),
              latitude: data.coordinates?.latitude ?? null,
              longitude: data.coordinates?.longitude ?? null,
              location: validation.details || '',
              ipAddress: data.ipAddress,
              deviceInfo: `${getDeviceInfo(data.userAgent).os} - ${getDeviceInfo(data.userAgent).browser} - ${getDeviceInfo(data.userAgent).device}`
            }
          })
      return { action: 'attempt_incremented', record: up, attempts: nextAttempts }
    })

    // Return informative error (do not create attendance as PRESENT)
    if (txResult.action === 'locked') {
      console.warn({ event: 'max_attempts_exceeded', employeeId: data.employeeId, attempts: txResult.attempts })
      const e = new Error(`Maximum attempts exceeded. Marked ABSENT. ${validation.details}`)
      ;(e as any).code = 'MAX_ATTEMPTS_EXCEEDED'
      throw e
    }

    // else inform user of failed validation and attempts left
    const attemptsLeft = Math.max(0, MAX_ATTEMPTS - (txResult as any).attempts)
    const err = new Error(`${validation.details} Attempt ${ (txResult as any).attempts }/${MAX_ATTEMPTS}. ${attemptsLeft} attempt(s) remaining.`)
    ;(err as any).code = validation.code || 'LOCATION_MISMATCH'
    throw err
  }

  // If validation is ok -> persist as PRESENT (or given status)
  const humanReadable = await getHumanReadableLocation(data.coordinates as GeolocationCoordinates)
  const deviceInfo = getDeviceInfo(data.userAgent)
  const deviceString = `${deviceInfo.os} - ${deviceInfo.browser} - ${deviceInfo.device}`

  if (existing && existing.locked) {
    throw new Error('ATTENDANCE_LOCKED')
  }

  // Prepare update data based on action
  const updateData: any = {
    latitude: data.coordinates?.latitude ?? existing?.latitude,
    longitude: data.coordinates?.longitude ?? existing?.longitude,
    location: humanReadable,
    ipAddress: data.ipAddress,
    deviceInfo: deviceString,
    photo: data.photo ?? existing?.photo,
    status: data.status,
    updatedAt: new Date(),
    attemptCount: 'ZERO' // reset attempts on success
  }

  // Handle check-in/check-out logic
  if (data.action === 'check-in') {
    updateData.clockIn = new Date()
  } else if (data.action === 'check-out') {
    updateData.clockOut = new Date()
    // For check-out, preserve existing clockIn if it exists
    if (!existing?.clockIn) {
      updateData.clockIn = new Date() // Set clockIn to current time if not already set
    }
  } else {
    // Default behavior for backward compatibility
    if (!existing?.clockIn) {
      updateData.clockIn = data.status === 'PRESENT' ? new Date() : null
    }
  }

  const saved = existing
    ? await prisma.attendance.update({
        where: { id: existing.id },
        data: updateData
      })
    : await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          date: today,
          clockIn: data.action === 'check-in' ? new Date() : null,
          clockOut: data.action === 'check-out' ? new Date() : null,
          latitude: data.coordinates?.latitude ?? null,
          longitude: data.coordinates?.longitude ?? null,
          location: humanReadable,
          ipAddress: data.ipAddress,
          deviceInfo: deviceString,
          photo: data.photo,
          status: data.status,
          lockedReason: '',
          locked: false,
          attemptCount: 'ZERO'
        }
      })

  return {
    employeeId: data.employeeId,
    timestamp: saved.createdAt.toISOString(),
    location: saved.location || humanReadable || '',
    ipAddress: saved.ipAddress || data.ipAddress || '',
    deviceInfo: saved.deviceInfo || deviceString || '',
    photo: saved.photo || data.photo || undefined,
    status: saved.status as any
  }
}

// Get remaining attempts (updated to numeric)
export async function getRemainingAttempts(employeeId: string): Promise<{ remainingAttempts: number; isLocked: boolean; status?: string }> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const employee = await prisma.fieldEngineer.findUnique({ where: { employeeId } })
  if (!employee) throw new Error('EMPLOYEE_NOT_FOUND')

  const attendance = await prisma.attendance.findUnique({
    where: { employeeId_date: { employeeId: employee.id, date: today } }
  })

  if (!attendance) {
    return { remainingAttempts: MAX_ATTEMPTS, isLocked: false }
  }

  if (attendance.locked) {
    return { remainingAttempts: 0, isLocked: true, status: attendance.status }
  }

  const used = attemptCountToNumber(attendance.attemptCount)
  return { remainingAttempts: Math.max(0, MAX_ATTEMPTS - used), isLocked: false, status: attendance.status }
}

// Get today's assigned location (unchanged)
export async function getTodayAssignedLocation(employeeId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const employee = await prisma.fieldEngineer.findUnique({ where: { employeeId } })
  if (!employee) throw new Error('EMPLOYEE_NOT_FOUND')
  return await prisma.dailyLocation.findUnique({
    where: { employeeId_date: { employeeId: employee.id, date: today } }
  })
}

// Expose helper for tests if needed
export const __test_helpers = {
  calculateDistanceMeters
}
