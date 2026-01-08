import { Router } from 'express'
import { VehicleController } from './vehicle.controller'

const router = Router()
const vehicleController = new VehicleController()

// Vehicle routes
router.get('/vehicles', (req, res) => vehicleController.getAllVehicles(req, res))
router.get('/vehicles/:id', (req, res) => vehicleController.getVehicleById(req, res))
router.post('/vehicles', (req, res) => vehicleController.createVehicle(req, res))
router.delete('/vehicles/:id', (req, res) => vehicleController.deleteVehicle(req, res))
router.post('/vehicles/:id/assign', (req, res) => vehicleController.assignVehicle(req, res))
router.post('/vehicles/:id/unassign', (req, res) => vehicleController.unassignVehicle(req, res))
router.get('/vehicles/employee/:employeeId', (req, res) => vehicleController.getEmployeeVehicle(req, res))

// Petrol bill routes
router.get('/petrol-bills', (req, res) => vehicleController.getAllPetrolBills(req, res))
router.post('/petrol-bills', (req, res) => vehicleController.createPetrolBill(req, res))
router.post('/petrol-bills/:id/approve', (req, res) => vehicleController.approvePetrolBill(req, res))

export default router