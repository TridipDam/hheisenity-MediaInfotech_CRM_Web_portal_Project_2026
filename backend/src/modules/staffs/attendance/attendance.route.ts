// modules/staffs/attendance/attendance.route.ts
import { Router, Request, Response } from 'express'
import { detectDevice, getLocationData } from '@/modules/staffs/attendance/attendance.controller'

const router = Router()

// Attendance endpoint - POST
router.post('/attendance', (req: Request, res: Response) => {
  return
})


// Device detection endpoint
router.get('/device', (req: Request, res: Response) => {
  return detectDevice(req, res)
})

// Location data endpoint - GET with query parameters
router.get('/location', (req: Request, res: Response) => {
  return getLocationData(req, res)
})

// Location data endpoint - POST
router.post('/location', (req: Request, res: Response) => {
  return getLocationData(req, res)
})

// Location data endpoint - URL params
router.get('/location/:latitude/:longitude', (req: Request, res: Response) => {
  return getLocationData(req, res)
})

export default router